package virustotal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"sync"
	"time"
)

type ServiceNeeded int

const (
	FileUpload ServiceNeeded = iota
	FileAnalysis
)

type QueueItem struct {
	FilePath      string
	BlobName      string
	ServiceNeeded ServiceNeeded
	VtID          string
	RetryCount    int
	MaxRetries    int
}

type RateLimiter struct {
	MinuteLimit int
	DailyLimit  int
	MinuteUsed  int
	DailyUsed   int
	Mutex       sync.Mutex
}

func (r *RateLimiter) CanUseAPI() bool {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	if r.DailyUsed >= r.DailyLimit || r.MinuteUsed >= r.MinuteLimit {
		return false
	}
	r.MinuteUsed++
	r.DailyUsed++
	return true
}

func (r *RateLimiter) ResetMinuteLimit() {
	r.Mutex.Lock()
	r.MinuteUsed = 0
	r.Mutex.Unlock()
}

func (r *RateLimiter) ResetDailyLimit() {
	r.Mutex.Lock()
	r.DailyUsed = 0
	r.Mutex.Unlock()
}

type WorkerPool struct {
	Jobs      chan QueueItem
	WaitGroup sync.WaitGroup
}

type Client struct {
	Config      Config
	Client      *http.Client
	WorkerPool  *WorkerPool
	RateLimiter *RateLimiter
}

func New(cfg Config, httpClient *http.Client, workerCount int) *Client {
	c := &Client{
		Config:      cfg,
		Client:      httpClient,
		RateLimiter: &RateLimiter{MinuteLimit: cfg.MinuteLimit, DailyLimit: cfg.DailyLimit},
		WorkerPool:  &WorkerPool{Jobs: make(chan QueueItem, 100)},
	}

	// Start workers
	for i := 0; i < workerCount; i++ {
		go c.worker()
	}

	// Start rate limit reset tickers
	go func() {
		minTicker := time.NewTicker(time.Minute)
		dayTicker := time.NewTicker(24 * time.Hour)
		for {
			select {
			case <-minTicker.C:
				c.RateLimiter.ResetMinuteLimit()
			case <-dayTicker.C:
				c.RateLimiter.ResetDailyLimit()
			}
		}
	}()

	return c
}

// AddToQueue submits a file for processing
func (c *Client) AddToQueue(item QueueItem) {
	if item.MaxRetries == 0 {
		item.MaxRetries = 5
	}
	c.WorkerPool.WaitGroup.Add(1)
	c.WorkerPool.Jobs <- item
}

// worker handles queue items
func (c *Client) worker() {
	for job := range c.WorkerPool.Jobs {
		switch job.ServiceNeeded {
		case FileUpload:
			c.uploadFile(job)
		case FileAnalysis:
			c.storeAnalysis(job)
		}
		c.WorkerPool.WaitGroup.Done()
	}
}

// uploadFile safely handles rate limits and re-queues if needed
func (c *Client) uploadFile(job QueueItem) {
	if !c.RateLimiter.CanUseAPI() {
		c.requeue(job)
		return
	}

	file, err := os.Open(job.FilePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", job.FilePath)
	if err != nil {
		fmt.Println("Error creating form file:", err)
		return
	}
	if _, err := io.Copy(part, file); err != nil {
		fmt.Println("Error copying file:", err)
		return
	}
	writer.Close()

	req, _ := http.NewRequest("POST", c.Config.EndPoint+"/files", body)
	req.Header.Set("x-apikey", c.Config.APIKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := c.Client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		fmt.Println("Upload failed, re-queuing:", err)
		c.requeue(job)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("JSON decode error:", err)
		c.requeue(job)
		return
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok || data["id"] == nil {
		fmt.Println("Invalid response from VirusTotal")
		c.requeue(job)
		return
	}

	vtID := data["id"].(string)
	os.Remove(job.FilePath)

	// Schedule analysis
	c.AddToQueue(QueueItem{
		BlobName:      job.BlobName,
		VtID:          vtID,
		ServiceNeeded: FileAnalysis,
	})
}

// storeAnalysis fetches analysis results
func (c *Client) storeAnalysis(job QueueItem) {
	req, _ := http.NewRequest("GET", c.Config.EndPoint+"/analyses/"+job.VtID, nil)
	req.Header.Set("x-apikey", c.Config.APIKey)

	resp, err := c.Client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		fmt.Println("Analysis fetch failed, re-queuing:", err)
		c.requeue(job)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("JSON decode error:", err)
		c.requeue(job)
		return
	}

	fmt.Println("Analysis completed for", job.BlobName)
}

// requeue retries a job with backoff
func (c *Client) requeue(job QueueItem) {
	if job.RetryCount >= job.MaxRetries {
		fmt.Println("Max retries reached for", job.BlobName)
		return
	}
	job.RetryCount++
	go func() {
		time.Sleep(time.Duration(job.RetryCount*5) * time.Second) // simple linear backoff
		c.AddToQueue(job)
	}()
}
