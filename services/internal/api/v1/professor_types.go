package v1

import "time"

type ProfessorFindResponse struct {
	Email          string        `json:"email"`
	Name           string        `json:"name"`
	College        string        `json:"college"`
	University     string        `json:"university"`
	Reviews        []Review      `json:"reviews"`
	SimilarlyRated []interface{} `json:"similarlyRated"`
	CanReview      bool          `json:"canReview"`
	Score          float64       `json:"score"`
}

type Review struct {
	Id          int           `json:"id"`
	Score       int           `json:"score"`
	Positive    bool          `json:"positive"`
	Comment     string        `json:"comment"`
	CreatedAt   time.Time     `json:"created_at"`
	Author      string        `json:"author"`
	Likes       int           `json:"likes"`
	Dislikes    int           `json:"dislikes"`
	Comments    int           `json:"comments"`
	Attachments []interface{} `json:"attachments"`
	Self        bool          `json:"self"`
	UaeuOrigin  bool          `json:"uaeuOrigin"`
}

type ReviewPostBody struct {
	Comment        string `json:"comment"`
	Score          int    `json:"score"`
	Positive       bool   `json:"positive"`
	ProfessorEmail string `json:"professorEmail"`
	RecaptchaToken string `json:"recaptchaToken"`
	Attachment     string `json:"attachment"`
}

type ReviewPostResponse struct {
	Comment    string    `json:"comment"`
	Score      int       `json:"score"`
	Positive   bool      `json:"positive"`
	Attachment string    `json:"attachment"`
	Id         uint64    `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
}
