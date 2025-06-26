package database

import (
	"context"
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"time"
)

func (db *ProfessorDB) GetProfessors(ctx context.Context, university string) ([]v1.ProfessorInList, error) {
	var professors = make([]v1.ProfessorInList, 0)

	rows, err := db.db.Pool.Query(ctx, `SELECT email, name FROM professor.professor WHERE visible AND university = $1 ORDER BY views DESC`, university)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var (
			email string
			name  string
		)

		err := rows.Scan(&email, &name)
		if err != nil {
			return nil, err
		}

		professors = append(professors, v1.ProfessorInList{
			Email: email,
			Name:  name,
		})
	}

	return professors, nil
}

func (db *ProfessorDB) GetProfessor(ctx context.Context, email string) (*model.Professor, error) {
	rows, err := db.db.Pool.Query(ctx, `SELECT email, name, university, college FROM professor.professor WHERE visible AND email = $1`, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, fmt.Errorf("professor not found")
	}

	var (
		profEmail   string
		profName    string
		profUni     string
		profCollege string
	)

	err = rows.Scan(&profEmail, &profName, &profUni, &profCollege)
	if err != nil {
		return nil, err
	}

	return &model.Professor{
		Email:      profEmail,
		Name:       profName,
		University: profUni,
		College:    profCollege,
	}, nil
}

func (db *ProfessorDB) GetProfessorReviews(ctx context.Context, email string) (*[]v1.Review, error) {
	rows, err := db.db.Pool.Query(ctx, `
	SELECT
		review.sort_index,
		review.id,
		review.score,
		review.positive,
		review.content,
		review.uaeu_origin,
		review.created_at,
		review.like_count,
		review.dislike_count,
		review.language
	FROM professor.review
	JOIN review_attachment ON review.attachment = review_attachment.id
	WHERE review.professor_email = $1 AND review.visible AND review.deleted_at IS NULL
	ORDER BY review.sort_index, id DESC;`, email)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := make([]v1.Review, 0)

	for rows.Next() {
		var review v1.Review

		err := rows.Scan(
			&review.SortIndex,
			&review.ID,
			&review.Score,
			&review.Positive,
			&review.Text,
			&review.UaeuOrigin,
			&review.CreatedAt,
			&review.LikeCount,
			&review.DislikeCount,
			&review.Language,
		)

		if err != nil {
			return nil, err
		}

		reviews = append(reviews, review)

	}

	go func() {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		err := db.incrementProfessorViews(timeoutCtx, email)
		if err != nil {
			logging.FromContext(ctx).Errorw("failed to increment views", "email", email, "error", err)
		}
	}()

	return &reviews, nil
}

func (db *ProfessorDB) incrementProfessorViews(ctx context.Context, email string) error {
	_, err := db.db.Pool.Exec(ctx, `UPDATE professor.professor SET views = views + 1 WHERE email = $1`, email)
	return err
}
