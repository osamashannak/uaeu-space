package database

import "github.com/osamashannak/uaeu-space/services/pkg/database"

type ProfessorDB struct {
	Db *database.DB
}

func New(db *database.DB) *ProfessorDB {
	return &ProfessorDB{
		Db: db,
	}
}
