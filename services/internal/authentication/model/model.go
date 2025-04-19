package model

import "time"

type User struct {
	Id            int64
	Username      string
	Email         string
	EmailVerified bool
	CreatedAt     time.Time
}

type UserCredentials struct {
	UserId int64
	Salt   string
	Hash   string
}

type Session struct {
	Id int64
}
