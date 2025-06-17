package database

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
	"github.com/osamashannak/uaeu-space/services/pkg/google/perspective"
)

func (db *ProfessorDB) GetReview(ctx context.Context, id string) (*model.Review, error) {
	var review model.Review

	err := db.db.Pool.QueryRow(ctx,
		`SELECT id, score, positive, content, attachment, professor_email, ip_address, session_id, user_id
		 FROM professor.review WHERE id = $1`, id).Scan(
		&review.ID,
		&review.Score,
		&review.Positive,
		&review.Content,
		&review.Attachment,
		&review.ProfessorEmail,
		&review.IpAddress,
		&review.SessionId,
		&review.UserId)

	if err != nil {
		return nil, err
	}

	return &review, nil
}

func (db *ProfessorDB) InsertReview(ctx context.Context, review *model.Review) error {
	_, err := db.db.Pool.Exec(ctx,
		`INSERT INTO professor.review (id, score, positive, content, attachment, professor_email, ip_address, session_id, user_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		review.ID, review.Score, review.Positive, review.Content, review.Attachment, review.ProfessorEmail, review.IpAddress, review.SessionId, review.UserId)
	return err
}

func (db *ProfessorDB) SoftDeleteReview(ctx context.Context, id string) error {
	_, err := db.db.Pool.Exec(ctx,
		`UPDATE professor.review SET deleted_at = now() WHERE id = $1`, id)
	return err
}

func (db *ProfessorDB) InsertReviewFlags(ctx context.Context, id uint64, result *perspective.AnalysisResult) error {
	type flagEntry struct {
		Attribute string
		Score     float64
	}

	var flags []flagEntry

	if result.Toxicity != nil {
		flags = append(flags, flagEntry{"TOXICITY", *result.Toxicity})
	}
	if result.SevereToxicity != nil {
		flags = append(flags, flagEntry{"SEVERE_TOXICITY", *result.SevereToxicity})
	}
	if result.IdentityAttack != nil {
		flags = append(flags, flagEntry{"IDENTITY_ATTACK", *result.IdentityAttack})
	}
	if result.Insult != nil {
		flags = append(flags, flagEntry{"INSULT", *result.Insult})
	}
	if result.Profanity != nil {
		flags = append(flags, flagEntry{"PROFANITY", *result.Profanity})
	}
	if result.Threat != nil {
		flags = append(flags, flagEntry{"THREAT", *result.Threat})
	}

	query := `INSERT INTO professor.review_flag (review_id, attribute, score, engine) VALUES ($1, $2, $3, $4)`

	for _, flag := range flags {
		_, err := db.db.Pool.Exec(ctx, query, id, flag.Attribute, flag.Score, "perspective")
		if err != nil {
			return err
		}
	}

	return nil
}

func (db *ProfessorDB) GetTranslatedReview(ctx context.Context, id string) (*model.ReviewTranslation, error) {
	var translation model.ReviewTranslation

	err := db.db.Pool.QueryRow(ctx,
		`SELECT review_id, target, translated_text, created_at
		 FROM professor.review_translation WHERE review_id = $1`, id).Scan(
		&translation.ReviewId,
		&translation.TranslatedText,
		&translation.Target,
		&translation.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &translation, nil
}

func (db *ProfessorDB) InsertReviewTranslation(ctx context.Context, translation *model.ReviewTranslation) error {
	_, err := db.db.Pool.Exec(ctx,
		`INSERT INTO professor.review_translation (review_id, target, translated_text)
			VALUES ($1, $2, $3)`,
		translation.ReviewId, translation.Target, translation.TranslatedText)
	return err
}
