package database

import "github.com/osamashannak/uaeu-space/services/pkg/database"

type AuthenticationDB struct {
	db *database.DB
}

func New(db *database.DB) *AuthenticationDB {
	return &AuthenticationDB{
		db: db,
	}
}
