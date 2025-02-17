package database

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
)

func (db *ProfessorDB) GetProfessors(ctx context.Context) ([]model.Professor, error) {
	var professors []model.Professor

	rows, err := db.db.Pool.Query(ctx, `SELECT email, name FROM professor.professor WHERE visible ORDER BY views DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var professor model.Professor
		err := rows.Scan(&professor.Email, &professor.Name)
		if err != nil {
			return nil, err
		}
		professors = append(professors, professor)
	}

	return professors, nil
}

func (db *ProfessorDB) GetProfessor(ctx context.Context, email string) (*model.Professor, error) {
	var professor model.Professor

	err := db.db.Pool.QueryRow(ctx, `SELECT email, name, college, views, visible, university FROM professor.professor WHERE email = $1 AND visible`, email).Scan(&professor.Email, &professor.Name, &professor.College, &professor.Views, &professor.Visible, &professor.University)
	if err != nil {
		return nil, err
	}

	err = db.incrementProfessorViews(ctx, email)

	return &professor, err
}

func (db *ProfessorDB) incrementProfessorViews(ctx context.Context, email string) error {
	_, err := db.db.Pool.Exec(ctx, `UPDATE professor.professor SET views = views + 1 WHERE email = $1`, email)
	return err
}
