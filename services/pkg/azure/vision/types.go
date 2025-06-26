package vision

type AdultInfo struct {
	IsAdultContent bool    `json:"isAdultContent"`
	IsRacyContent  bool    `json:"isRacyContent"`
	IsGoryContent  bool    `json:"isGoryContent"`
	AdultScore     float64 `json:"adultScore"`
	RacyScore      float64 `json:"racyScore"`
	GoryScore      float64 `json:"goryScore"`
}

// SafetyAnalysisResult is the top-level structure for unmarshalling the API response.
type SafetyAnalysisResult struct {
	Adult *AdultInfo `json:"adult"`
}
