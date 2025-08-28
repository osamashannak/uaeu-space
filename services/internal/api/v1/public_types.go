package v1

type FeedbackPostBody struct {
	ID     int64  `json:"id,string"`
	Answer string `json:"answer"`
}

type NewFeedbackResponse struct {
	FeedbackID     int64            `json:"feedback_id,string"`
	Completed      bool             `json:"complete"`
	Question       FeedbackResponse `json:"question,omitempty"`
	RemainingCount int              `json:"remaining_count"`
}

type FeedbackResponse struct {
	Text           string    `json:"text"`
	Options        *[]string `json:"options,omitempty"`
	Type           string    `json:"type"`
	RemainingCount *int      `json:"remaining_count,omitempty"`
}
