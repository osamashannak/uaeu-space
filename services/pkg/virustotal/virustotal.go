package virustotal

import (
	"bytes"
	"fmt"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"sync"
	"time"
)

// ServiceNeeded represents the type of processing required
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
}

type RateLimiter struct {
	MinuteLimit int
	DailyLimit  int
	MinuteUsed  int
	DailyUsed   int
	Mutex       sync.Mutex
}

type Client struct {
	Config      Config
	Client      *http.Client
	FileQueue   chan QueueItem
	RateLimiter *RateLimiter
	WorkerPool  *WorkerPool
}

type WorkerPool struct {
	Jobs      chan QueueItem
	WaitGroup sync.WaitGroup
}

func New(cfg Config, client *http.Client, workerCount int) *Client {
	vtClient := &Client{
		Config:    cfg,
		Client:    client,
		FileQueue: make(chan QueueItem, 100),
		RateLimiter: &RateLimiter{
			MinuteLimit: cfg.MinuteLimit,
			DailyLimit:  cfg.DailyLimit,
		},
	}

	// Start the worker pool
	vtClient.WorkerPool = vtClient.createWorkerPool(workerCount)

	// Start rate limit resets
	go vtClient.scheduleRateLimitResets()

	return vtClient
}

func (c *Client) createWorkerPool(workerCount int) *WorkerPool {
	pool := &WorkerPool{Jobs: make(chan QueueItem, 100)}
	for i := 0; i < workerCount; i++ {
		go c.worker(pool)
	}
	return pool
}

// worker processes queue items concurrently
func (c *Client) worker(pool *WorkerPool) {
	for job := range pool.Jobs {
		switch job.ServiceNeeded {
		case FileUpload:
			c.uploadFile(job.FilePath, job.BlobName)
		case FileAnalysis:
			c.storeAnalysis(job.BlobName, job.VtID)
		}
		pool.WaitGroup.Done()
	}
}

// scheduleRateLimitResets resets API rate limits periodically
func (c *Client) scheduleRateLimitResets() {
	tickerMinute := time.NewTicker(1 * time.Minute)
	tickerDaily := time.NewTicker(24 * time.Hour)

	for {
		select {
		case <-tickerMinute.C:
			c.RateLimiter.resetMinuteLimit()
		case <-tickerDaily.C:
			c.RateLimiter.resetDailyLimit()
		}
	}
}

// resetMinuteLimit resets the per-minute API limit
func (r *RateLimiter) resetMinuteLimit() {
	r.Mutex.Lock()
	r.MinuteUsed = 0
	r.Mutex.Unlock()
}

// resetDailyLimit resets the daily API limit
func (r *RateLimiter) resetDailyLimit() {
	r.Mutex.Lock()
	r.DailyUsed = 0
	r.Mutex.Unlock()
}

// canUseAPI checks if API requests are within limits
func (r *RateLimiter) canUseAPI() bool {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	return r.DailyUsed < r.DailyLimit && r.MinuteUsed < r.MinuteLimit
}

// AddToQueue submits a file for processing
func (c *Client) AddToQueue(filePath, blobName string) {
	job := QueueItem{FilePath: filePath, BlobName: blobName, ServiceNeeded: FileUpload}
	c.WorkerPool.WaitGroup.Add(1)
	c.WorkerPool.Jobs <- job
}

// uploadFile sends a file to VirusTotal
func (c *Client) uploadFile(filePath, blobName string) {
	if !c.RateLimiter.canUseAPI() {
		fmt.Println("Rate limit reached. Retrying later.")
		time.Sleep(10 * time.Second)
		c.AddToQueue(filePath, blobName) // Re-add to queue
		return
	}

	fmt.Println("Uploading file:", filePath)
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", filePath)
	if err != nil {
		fmt.Println("Error creating form file:", err)
		return
	}

	_, err = io.Copy(part, file)
	if err != nil {
		fmt.Println("Error copying file:", err)
		return
	}
	writer.Close()

	req, err := http.NewRequest("POST", c.Config.EndPoint+"/files", body)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("x-apikey", c.Config.APIKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := c.Client.Do(req)
	if err != nil {
		fmt.Println("Upload failed, retrying...")
		time.Sleep(5 * time.Second)
		c.AddToQueue(filePath, blobName)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	status, err := jsonutil.Unmarshal(resp, req, &result)
	if err != nil {
		fmt.Println("JSON Error:", err)
		return
	}
	if status != http.StatusOK {
		fmt.Println("API Error:", result)
		return
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok || data["id"] == nil {
		fmt.Println("Invalid response from VirusTotal")
		return
	}

	c.RateLimiter.MinuteUsed++
	c.RateLimiter.DailyUsed++

	vtID := data["id"].(string)
	c.storeAnalysis(blobName, vtID)

	os.Remove(filePath)
}

// storeAnalysis retrieves analysis results from VirusTotal
func (c *Client) storeAnalysis(blobName, vtID string) {
	fmt.Println("Fetching analysis for:", blobName)

	req, err := http.NewRequest("GET", c.Config.EndPoint+"/analyses/"+vtID, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("x-apikey", c.Config.APIKey)

	resp, err := c.Client.Do(req)
	if err != nil {
		fmt.Println("Analysis retrieval failed, retrying...")
		time.Sleep(5 * time.Second)
		c.AddToQueue("", blobName) // Retry analysis retrieval
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	status, err := jsonutil.Unmarshal(resp, req, &result)
	if err != nil {
		fmt.Println("JSON Error:", err)
		return
	}
	if status != http.StatusOK {
		fmt.Println("API Error:", result)
		return
	}

	fmt.Println("Analysis completed for", blobName)
}
