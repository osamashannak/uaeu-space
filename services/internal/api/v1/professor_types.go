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
	SortIndex    int64             `json:"sort_index"`
	ID           int64             `json:"id"`
	Score        int               `json:"score"`
	Positive     bool              `json:"positive"`
	Text         string            `json:"text"`
	CreatedAt    time.Time         `json:"created_at"`
	Author       string            `json:"author"`
	Language     string            `json:"language"`
	LikeCount    int               `json:"like_count"`
	DislikeCount int               `json:"dislike_count"`
	ReplyCount   int               `json:"reply_count"`
	Attachment   *ReviewAttachment `json:"attachment,omitempty"`
	Self         bool              `json:"self"`
	Rated        *string           `json:"rated,omitempty"`
	UaeuOrigin   bool              `json:"uaeu_origin"`
}

type ReviewAttachment struct {
	ID     int64  `json:"id"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
	URL    string `json:"url"`
}

type ReviewPostBody struct {
	Text           string  `json:"text"`
	Score          *int    `json:"score" required:"true"`
	Positive       *bool   `json:"positive" required:"true"`
	ProfessorEmail *string `json:"professor_email" required:"true"`
	RecaptchaToken *string `json:"recaptcha_token" required:"true"`
	Attachment     *int64  `json:"attachment"`
}

type ReviewAttachmentResponse struct {
	ID int64 `json:"id"`
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
	ID         int64             `json:"id"`
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

type ReplyNameBody struct {
	ReviewID int64 `json:"review_id"`
}

type ReplyNameResponse struct {
	Name string `json:"name"`
}

type ReplyPostBody struct {
	ReviewID int64   `json:"review_id" required:"true"`
	ReplyID  *int64  `json:"reply_id"`
	Comment  string  `json:"comment"`
	Gif      *string `json:"gif"`
}

type Reply struct {
	ID        int64     `json:"id"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	Gif       *string   `json:"gif,omitempty"`
	Author    string    `json:"author"`
	Mention   *string   `json:"mention,omitempty"`
	Op        bool      `json:"op"`
	Self      bool      `json:"self"`
	Liked     bool      `json:"liked"`
	LikeCount int       `json:"like_count"`
}

type GetRepliesResponse struct {
	Replies []Reply `json:"replies"`
}
