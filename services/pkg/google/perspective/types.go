package perspective

type Comment struct {
	Text string `json:"text"`
}

type Attribute struct {
	ScoreThreshold float64 `json:"scoreThreshold"`
}

type RequestBody struct {
	Comment             Comment              `json:"comment"`
	SpanAnnotations     bool                 `json:"spanAnnotations"`
	RequestedAttributes map[string]Attribute `json:"requestedAttributes"`
}

type AttributeScore struct {
	SummaryScore struct {
		Value float64 `json:"value"`
		Type  string  `json:"type"`
	} `json:"summaryScore"`
}

type ResponseBody struct {
	AttributeScores   map[string]AttributeScore `json:"attributeScores"`
	DetectedLanguages []string                  `json:"detectedLanguages"`
}

type AnalysisResult struct {
	Toxicity       *float64 `json:"TOXICITY,omitempty"`
	SevereToxicity *float64 `json:"SEVERE_TOXICITY,omitempty"`
	IdentityAttack *float64 `json:"IDENTITY_ATTACK,omitempty"`
	Insult         *float64 `json:"INSULT,omitempty"`
	Profanity      *float64 `json:"PROFANITY,omitempty"`
	Threat         *float64 `json:"THREAT,omitempty"`
	Language       string   `json:"language"`
}
