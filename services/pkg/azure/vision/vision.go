package vision

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type AzureVision struct {
	httpClient *http.Client
	config     *Config
}

func New(config *Config) *AzureVision {
	return &AzureVision{
		config: config,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *AzureVision) AnalyzeImageSafety(imageURL string) (*SafetyAnalysisResult, error) {
	const features = "Adult"

	body, err := json.Marshal(urlRequestBody{URL: imageURL})
	if err != nil {
		fmt.Println("Error marshaling request body:", err)
		return nil, fmt.Errorf("error marshalling request body: %w", err)
	}

	uri := fmt.Sprintf("%s/vision/v3.2/analyze?visualFeatures=%s", c.config.Endpoint, features)

	req, err := http.NewRequest("POST", uri, bytes.NewBuffer(body))
	if err != nil {
		fmt.Println("Error creating HTTP request:", err)
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Ocp-Apim-Subscription-Key", c.config.SubscriptionKey)

	respBody, err := c.doRequest(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return nil, err
	}

	var result SafetyAnalysisResult
	if err := json.Unmarshal(respBody, &result); err != nil {
		fmt.Println("Error parsing JSON response:", err)
		return nil, fmt.Errorf("failed to parse JSON response: %w", err)
	}

	return &result, nil
}

type urlRequestBody struct {
	URL string `json:"url"`
}

func (c *AzureVision) doRequest(req *http.Request) ([]byte, error) {
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status code %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

func (s *SafetyAnalysisResult) IsSafe() bool {
	if s.Adult == nil {
		return false
	}
	return s.Adult.IsAdultContent == false && s.Adult.IsRacyContent == false && s.Adult.IsGoryContent == false
}
