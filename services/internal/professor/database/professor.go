package database

import (
	"context"
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
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

func (db *ProfessorDB) GetProfessor(ctx context.Context, email string) (*v1.ProfessorResponse, error) {
	rows, err := db.db.Pool.Query(ctx, `WITH filtered_reviews AS (
    SELECT *
    FROM professor.review
    WHERE visible = TRUE
      AND soft_deleted = FALSE
)
SELECT
    p.email,
    p.name,
    p.university,
    p.college,
    r.id AS review_id,
    r.score,
    r.positive,
    r.content,
    r.attachment,
	r.uaeu_origin,
    r.created_at,
    r.like_count,
    r.dislike_count,
	r.language
FROM professor.professor p
         LEFT JOIN filtered_reviews r ON p.email = r.professor_email
WHERE p.email = $1
ORDER BY r.created_at DESC;`, email)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var professor v1.ProfessorResponse

	professor.Reviews = make([]v1.Review, 0)
	firstRow := true

	var (
		profEmail   string
		profName    string
		profUni     string
		profCollege string
	)

	for rows.Next() {
		var review v1.Review

		err := rows.Scan(
			&profEmail, &profName, &profUni, &profCollege,
			&review.ID,
			&review.Score,
			&review.Positive,
			&review.Text,
			&review.CreatedAt,
			&review.Attachment,
			&review.LikeCount,
			&review.DislikeCount,
			&review.UaeuOrigin,
			&review.Language,
		)
		if err != nil {
			return nil, err
		}

		if firstRow {
			professor = v1.ProfessorResponse{
				Email:      profEmail,
				Name:       profName,
				University: profUni,
				College:    profCollege,
				Reviews:    []v1.Review{},
			}
			firstRow = false
		}

		professor.Reviews = append(professor.Reviews, review)

	}

	go func() {
		timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		defer cancel()

		err := db.incrementProfessorViews(timeoutCtx, email)
		if err != nil {
			logging.FromContext(ctx).Errorw("failed to increment views", "email", email, "error", err)
		}
	}()

	if firstRow {
		return nil, fmt.Errorf("professor not found")
	}

	return &professor, nil
}

func (db *ProfessorDB) incrementProfessorViews(ctx context.Context, email string) error {
	_, err := db.db.Pool.Exec(ctx, `UPDATE professor.professor SET views = views + 1 WHERE email = $1`, email)
	return err
}
