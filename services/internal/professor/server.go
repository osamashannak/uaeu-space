package professor

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
)

type Server struct {
	db        *database.ProfessorDB
	generator *snowflake.Generator
}

func NewServer(db *database.ProfessorDB, generator *snowflake.Generator) (*Server, error) {
	return &Server{
		db:        db,
		generator: generator,
	}, nil
}

func (s *Server) Routes(ctx context.Context) http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /", s.Get())
	mux.Handle("GET /all", s.GetAll())

	mux.Handle("POST /comment", s.PostReview())
	mux.Handle("DELETE /comment", s.DeleteReview())
	mux.Handle("POST /comment/attachment", s.UploadReviewAttachment())
	mux.Handle("POST /comment/rating", s.AddReviewRating())
	mux.Handle("DELETE /comment/rating", s.DeleteReviewRating())

	mux.Handle("GET /comment/reply", s.GetReplies())
	mux.Handle("GET /comment/reply/name", s.GetReplyName())
	mux.Handle("POST /comment/reply", s.PostReply())
	mux.Handle("DELETE /comment/reply", s.DeleteReply())
	mux.Handle("POST /comment/reply/like", s.LikeReply())
	mux.Handle("DELETE /comment/reply/like", s.UnlikeReply())

	return mux
}
