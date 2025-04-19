package model

import (
	"net"
	"time"
)

type Professor struct {
	Email      string
	Name       string
	College    string
	University string
	Views      int
	Visible    bool
}

type Review struct {
	Id             uint64
	Score          int
	Positive       bool
	Content        string
	ProfessorEmail string
	Attachment     string
	Reviewed       bool
	SoftDeleted    bool
	Visible        bool
	CreatedAt      time.Time
	IpAddress      string
	SessionId      *int64
	UserId         *int64
}

type ReviewRating struct {
	Id        int64
	Value     bool
	CreatedAt time.Time
	IpAddress net.IPNet
	ReviewId  int64
	UserId    *int64
	SessionId int64
}

type ReviewAttachment struct {
	Id        int64
	MimeType  string
	Size      int
	width     int
	height    int
	visible   bool
	CreatedAt time.Time
}

type ReviewReply struct {
	Id          int64
	Content     string
	Gif         string
	SoftDeleted bool
	CreatedAt   time.Time
	ReviewId    int64
	UserId      *int64
	SessionId   int64
	MentionId   *int64
}

type ReplyName struct {
	Id        int64
	Name      string
	ReviewId  int64
	UserId    *int64
	SessionId int64
}

type ReplyLike struct {
	Id        int64
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
