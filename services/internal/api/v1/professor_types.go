package v1

import "time"

type ProfessorInList struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type ProfessorResponse struct {
	Email             string             `json:"email"`
	Name              string             `json:"name"`
	College           string             `json:"college"`
	University        string             `json:"university"`
	Reviews           []Review           `json:"reviews"`
	SimilarProfessors []SimilarProfessor `json:"similar_professors"`
	Reviewed          bool               `json:"reviewed"`
	Score             float64            `json:"score"`
}

type SimilarProfessor struct {
	ProfessorEmail   string  `json:"professor_email"`
	ProfessorName    string  `json:"professor_name"`
	ProfessorCollege string  `json:"professor_college"`
	ReviewsCount     int     `json:"reviews_count"`
	Score            float64 `json:"score"`
	ReviewPreview    string  `json:"review_preview"`
}

type Review struct {
	SortIndex    int64            `json:"sort_index"`
	ID           int64            `json:"id"`
	Score        int              `json:"score"`
	Positive     bool             `json:"positive"`
	Text         string           `json:"text"`
	CreatedAt    time.Time        `json:"created_at"`
	Author       string           `json:"author"`
	Language     string           `json:"language"`
	LikeCount    int              `json:"like_count"`
	DislikeCount int              `json:"dislike_count"`
	CommentCount int              `json:"comment_count"`
	Attachment   ReviewAttachment `json:"attachment"`
	Lang         string           `json:"lang"`
	Self         bool             `json:"self"`
	Rated        string           `json:"rated,omitempty"`
	UaeuOrigin   bool             `json:"uaeu_origin"`
}

type ReviewAttachment struct {
	ID     uint64 `json:"id"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
	URL    string `json:"url"`
}

type ReviewPostBody struct {
	Text           string `json:"text"`
	Score          int    `json:"score"`
	Positive       bool   `json:"positive"`
	ProfessorEmail string `json:"professorEmail"`
	RecaptchaToken string `json:"recaptchaToken"`
	Attachment     string `json:"attachment"`
}

type ReviewAttachmentResponse struct {
	ID uint64 `json:"id"`
}

type ReviewRatingBody struct {
	ReviewID int64  `json:"review_id"`
	Rating   string `json:"rating"`
}

type ReviewPostResponse struct {
	Comment    string            `json:"comment"`
	Score      int               `json:"score"`
	Positive   bool              `json:"positive"`
	Attachment *ReviewAttachment `json:"attachment,omitempty"`
	ID         uint64            `json:"id"`
	Flagged    *bool             `json:"flagged,omitempty"`
}

type SuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ReviewTranslationResponse struct {
	Content string `json:"content"`
	Target  string `json:"target"`
}
