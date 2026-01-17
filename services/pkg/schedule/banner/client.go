package banner

import (
	"encoding/json"
	"fmt"
	"github.com/osamashannak/uaeu-space/services/pkg/schedule/models"
	"golang.org/x/net/html"
	"io"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	baseURL       = "https://eservices.uaeu.ac.ae/StudentRegistrationSsb/ssb"
	termSelect    = baseURL + "/term/termSelection?mode=search"
	termSearch    = baseURL + "/term/search?mode=search"
	searchResults = baseURL + "/searchResults/searchResults"
	pageSize      = 500
)

type Banner struct {
	client *http.Client
}

func New() *Banner {
	jar, _ := cookiejar.New(nil)
	return &Banner{
		client: &http.Client{
			Timeout: 30 * time.Second,
			Jar:     jar, // Handles JSESSIONID automatically
		},
	}
}

// FetchAllCourses is the main entry point
func (b *Banner) FetchAllCourses(term string) ([]models.Section, error) {
	// 1. Initialize Session & Get CSRF Token
	token, err := b.getSynchronizerToken()
	if err != nil {
		return nil, fmt.Errorf("failed to get sync token: %w", err)
	}

	// 2. Generate Unique Session ID (Client-side random string)
	uniqueID := generateSessionID()

	// 3. Post Term (Locks the session to "202610")
	if err := b.postTerm(term, token, uniqueID); err != nil {
		return nil, fmt.Errorf("failed to set term: %w", err)
	}

	// 4. Fetch First Page to get Total Count
	firstPage, totalCount, err := b.fetchPage(term, uniqueID, 0, pageSize)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch first page: %w", err)
	}

	allRawSections := firstPage

	// 5. Concurrent Fetch for remaining pages
	if totalCount > pageSize {
		// Calculate offsets (e.g., 500, 1000, 1500...)
		var offsets []int
		for i := pageSize; i < totalCount; i += pageSize {
			offsets = append(offsets, i)
		}

		// Use a mutex to safely append to the slice
		var mu sync.Mutex
		var wg sync.WaitGroup

		// Limit concurrency to 5 workers to be polite/safe
		semaphore := make(chan struct{}, 5)

		for _, offset := range offsets {
			wg.Add(1)
			go func(off int) {
				defer wg.Done()
				semaphore <- struct{}{}        // Acquire token
				defer func() { <-semaphore }() // Release token

				// Retry logic could go here
				pageData, _, err := b.fetchPage(term, uniqueID, off, pageSize)
				if err == nil {
					mu.Lock()
					allRawSections = append(allRawSections, pageData...)
					mu.Unlock()
				} else {
					fmt.Printf("Error fetching offset %d: %v\n", off, err)
				}
			}(offset)
		}
		wg.Wait()
	}

	// 6. Convert Raw Data to Clean Models
	return mapRawToClean(allRawSections), nil
}

// --- Helper Methods ---

func (b *Banner) fetchPage(term, uniqueID string, offset, max int) ([]rawSection, int, error) {
	// Construct URL params
	params := url.Values{}
	params.Set("txt_term", term)
	params.Set("uniqueSessionId", uniqueID)
	params.Set("pageOffset", strconv.Itoa(offset))
	params.Set("pageMaxSize", strconv.Itoa(max))
	params.Set("sortColumn", "subjectDescription")
	params.Set("sortDirection", "asc")

	// Add required filters (Undergrad + Lecture types)
	params.Set("txt_level", "UG")
	params.Set("txt_scheduleType", "B,LB,LL,LC,LW,L")

	req, _ := http.NewRequest("GET", searchResults+"?"+params.Encode(), nil)

	resp, err := b.client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, 0, fmt.Errorf("status code %d", resp.StatusCode)
	}

	var wrapper responseWrapper
	if err := json.NewDecoder(resp.Body).Decode(&wrapper); err != nil {
		return nil, 0, err
	}

	return wrapper.Data, wrapper.TotalCount, nil
}

func (b *Banner) postTerm(term, token, uniqueID string) error {
	form := url.Values{}
	form.Set("mode", "search")
	form.Set("term", term)
	form.Set("uniqueSessionId", uniqueID)

	req, _ := http.NewRequest("POST", termSearch, strings.NewReader(form.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("X-Synchronizer-Token", token)
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	resp, err := b.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("failed to post term, status: %d", resp.StatusCode)
	}
	return nil
}

func (b *Banner) getSynchronizerToken() (string, error) {
	resp, err := b.client.Get(termSelect)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Simple HTML parser to find <meta name="synchronizerToken" content="...">
	z := html.NewTokenizer(resp.Body)
	for {
		tt := z.Next()
		if tt == html.ErrorToken {
			if z.Err() == io.EOF {
				break
			}
			return "", z.Err()
		}
		if tt == html.SelfClosingTagToken || tt == html.StartTagToken {
			t := z.Token()
			if t.Data == "meta" {
				isSyncToken := false
				content := ""
				for _, attr := range t.Attr {
					if attr.Key == "name" && attr.Val == "synchronizerToken" {
						isSyncToken = true
					}
					if attr.Key == "content" {
						content = attr.Val
					}
				}
				if isSyncToken {
					return content, nil
				}
			}
		}
	}
	return "", fmt.Errorf("token not found")
}

func generateSessionID() string {
	randPart := make([]byte, 5)
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	for i := range randPart {
		randPart[i] = charset[rand.Intn(len(charset))]
	}
	timestamp := time.Now().UnixMilli()
	return fmt.Sprintf("%s%d", randPart, timestamp)
}

// --- Mapper Function ---

func mapRawToClean(raw []rawSection) []models.Section {
	var clean []models.Section
	for _, r := range raw {
		// 1. Map Faculty
		var facs []models.Faculty
		for _, f := range r.Faculty {
			facs = append(facs, models.Faculty{
				Name:  f.DisplayName,
				Email: f.Email,
			})
		}

		// 2. Map Meetings (filter FINL, parse days)
		var meets []models.Meeting
		for _, m := range r.Meetings {
			if m.MeetingTime.MeetingType == "FINL" {
				continue
			}

			// Parse Days
			var days []time.Weekday
			mt := m.MeetingTime
			if mt.Sunday {
				days = append(days, time.Sunday)
			}
			if mt.Monday {
				days = append(days, time.Monday)
			}
			if mt.Tuesday {
				days = append(days, time.Tuesday)
			}
			if mt.Wednesday {
				days = append(days, time.Wednesday)
			}
			if mt.Thursday {
				days = append(days, time.Thursday)
			}
			if mt.Friday {
				days = append(days, time.Friday)
			}
			if mt.Saturday {
				days = append(days, time.Saturday)
			}

			meets = append(meets, models.Meeting{
				Type:      mt.MeetingType,
				StartTime: mt.BeginTime,
				EndTime:   mt.EndTime,
				Building:  mt.Building,
				Room:      mt.Room,
				Days:      days,
			})
		}

		clean = append(clean, models.Section{
			CRN:            r.CRN,
			Subject:        r.Subject,
			CourseNumber:   r.CourseNumber,
			Title:          r.Title,
			SeatsAvailable: r.SeatsAvailable,
			Faculty:        facs,
			Meetings:       meets,
		})
	}
	return clean
}
