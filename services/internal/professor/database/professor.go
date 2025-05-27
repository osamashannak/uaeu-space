package database

import (
	"context"
	"database/sql"
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"time"
)

func (db *ProfessorDB) GetProfessors(ctx context.Context, university string) ([]v1.ProfessorInList, error) {
	var professors []v1.ProfessorInList = make([]v1.ProfessorInList, 0)

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
    r.like_count AS likes,
    r.dislike_count AS dislikes
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

	for rows.Next() {
		var (
			profEmail, profName, profUni, profCollege string
			reviewID                                  sql.NullInt64
			score                                     sql.NullInt32
			positive                                  sql.NullBool
			content                                   sql.NullString
			createdAt                                 sql.NullTime
			likes, dislikes                           sql.NullInt32
			attachment                                sql.NullString
			uaeuOrigin                                sql.NullBool
		)

		err := rows.Scan(
			&profEmail, &profName, &profUni, &profCollege,
			&reviewID, &score, &positive, &content, &createdAt, &attachment,
			&likes, &dislikes, &uaeuOrigin,
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

		if reviewID.Valid {
			review := v1.Review{
				ID:         reviewID.Int64,
				Score:      int(score.Int32),
				Positive:   positive.Bool,
				Content:    content.String,
				CreatedAt:  createdAt.Time,
				Attachment: attachment.String,
				Likes:      int(likes.Int32),
				Dislikes:   int(dislikes.Int32),
				UaeuOrigin: uaeuOrigin.Bool,
			}
			professor.Reviews = append(professor.Reviews, review)
		}

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
