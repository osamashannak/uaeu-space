package model

import (
	"time"
)

type Professor struct {
	Email      string
	Name       string
	College    string
	University string
}

type Review struct {
	SortIndex      int64
	ID             int64
	Score          int
	Positive       bool
	Content        string
	Attachment     *int64
	ProfessorEmail string
	IpAddress      string
	DeletedAt      *time.Time
	Visible        bool
	Reviewed       bool
	LikeCount      int
	DislikeCount   int
	Language       string
	UaeuOrigin     bool
	SessionId      *int64
	UserId         *int64
	CreatedAt      time.Time
}

type ReviewAttachment struct {
	ID        int64
	MimeType  string
	Size      int
	Width     int
	Height    int
	Visible   bool
	URL       string
	CreatedAt time.Time
}

type ReviewRating struct {
	Value     bool
	IpAddress string
	CreatedAt time.Time
	ReviewId  int64
	SessionId int64
	UserId    *int64
}

type ReviewReply struct {
	ID          int64
	Content     string
	Gif         *string
	SoftDeleted bool
	Op          bool
	CreatedAt   time.Time
	ReviewId    int64
	UserId      *int64
	SessionId   int64
	MentionId   *int64
}

type ReviewScores struct {
	ReviewId  int64
	Attribute string
	Score     int
	CreatedAt time.Time
}

type ReplyName struct {
	ID        int64
	Name      string
	ReviewId  int64
	UserId    *int64
	SessionId int64
}

type ReplyLike struct {
	ID        int64
	SessionId int64
	UserId    *int64
	ReplyId   int64
	CreatedAt time.Time
}

type ReviewTranslation struct {
	ReviewId       int64
	TranslatedText string
	Target         string
	CreatedAt      time.Time
}
