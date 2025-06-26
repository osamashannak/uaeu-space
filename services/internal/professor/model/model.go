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
	ID             uint64
	Score          int
	Positive       bool
	Content        string
	Attachment     string
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
	ID        uint64
	MimeType  string
	Size      int
	Width     int
	Height    int
	Visible   bool
	URL       string
	CreatedAt time.Time
}

type ReviewReply struct {
	ID          uint64
	Content     string
	Gif         string
	SoftDeleted bool
	CreatedAt   time.Time
	ReviewId    int64
	UserId      *int64
	SessionId   int64
	MentionId   *int64
}

type ReviewScores struct {
	ReviewId  uint64
	Attribute string
	Score     int
	CreatedAt time.Time
}

type ReplyName struct {
	ID        uint64
	Name      string
	ReviewId  int64
	UserId    *int64
	SessionId int64
}

type ReplyLike struct {
	ID        uint64
	SessionId int64
	UserId    *int64
	ReplyId   int64
	CreatedAt time.Time
}

type ReviewTranslation struct {
	ReviewId       uint64
	TranslatedText string
	Target         string
	CreatedAt      time.Time
}
