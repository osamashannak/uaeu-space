package database

import (
	"github.com/osamashannak/uaeu-space/services/pkg/database"
)

type CourseDB struct {
	Db *database.DB
}

func New(db *database.DB) *CourseDB {
	return &CourseDB{Db: db}
}
