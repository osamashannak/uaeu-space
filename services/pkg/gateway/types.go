package gateway

import "github.com/golang-jwt/jwt/v5"

type SessionClaims struct {
	SessionId int64 `json:"sid"`
	jwt.RegisteredClaims
}

type Profile struct {
	SessionId int64
}

type contextKey string
