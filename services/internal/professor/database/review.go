package database

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
)

func (db *ProfessorDB) GetReviews(ctx context.Context, email string) ([]model.Review, error) {
	var reviews []model.Review

	rows, err := db.db.Pool.Query(ctx,
		`SELECT id, score, positive, content, attachment, professor_email, ip_address, soft_deleted, created_at, visible, reviewed, session_id, user_id
			FROM professor.review WHERE professor_email = $1 AND visible AND not soft_deleted AND created_at > now() - interval '1 year' ORDER BY created_at DESC`, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var review model.Review
		err := rows.Scan(&review.Id, &review.Score, &review.Positive, &review.Content, &review.Attachment, &review.ProfessorEmail, &review.IpAddress, &review.SoftDeleted, &review.CreatedAt, &review.Visible, &review.Reviewed, &review.SessionId, &review.UserId)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}

func (db *ProfessorDB) InsertReview(ctx context.Context, review *model.Review) error {
	_, err := db.db.Pool.Exec(ctx,
		`INSERT INTO professor.review (id, score, positive, content, attachment, professor_email, ip_address, session_id, user_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		review.Id, review.Score, review.Positive, review.Content, review.Attachment, review.ProfessorEmail, review.IpAddress, review.SessionId, review.UserId)
	return err
}

func (db *ProfessorDB) GetReview(ctx context.Context, id uint64) (*model.Review, error) {
	var review model.Review

	err := db.db.Pool.QueryRow(ctx,
		`SELECT id, score, positive, content, attachment, professor_email, ip_address, session_id, user_id
			FROM professor.review WHERE id = $1 AND visible AND not soft_deleted`, id).Scan(&review.Id, &review.Score, &review.Positive, &review.Content, &review.Attachment, &review.ProfessorEmail, &review.IpAddress, &review.SessionId, &review.UserId)
	if err != nil {
		return nil, err
	}

	return &review, nil
}

func (db *ProfessorDB) SoftDeleteReview(ctx context.Context, id uint64) error {
	_, err := db.db.Pool.Exec(ctx,
		`UPDATE professor.review SET soft_deleted = true WHERE id = $1`, id)
	return err
}
