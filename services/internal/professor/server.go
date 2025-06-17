package professor

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/cache"
	"github.com/osamashannak/uaeu-space/services/pkg/google/perspective"
	"github.com/osamashannak/uaeu-space/services/pkg/google/recaptcha"
	"github.com/osamashannak/uaeu-space/services/pkg/google/translate"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
	"time"
)

type Server struct {
	db          *database.ProfessorDB
	generator   *snowflake.Generator
	recaptcha   *recaptcha.Recaptcha
	perspective *perspective.Perspective
	translate   *translate.Translate
	cache       *cache.Cache[[]v1.ProfessorInList]
}

func NewServer(db *database.ProfessorDB,
	generator *snowflake.Generator,
	recaptcha *recaptcha.Recaptcha,
	perspective *perspective.Perspective,
	translate *translate.Translate) (*Server, error) {
	return &Server{
		db:          db,
		generator:   generator,
		recaptcha:   recaptcha,
		perspective: perspective,
		translate:   translate,
		cache:       cache.New[[]v1.ProfessorInList](24 * time.Hour),
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /", s.Get())
	mux.Handle("GET /all", s.GetAll())

	mux.Handle("POST /comment", middleware.Gateway(s.PostReview()))
	mux.Handle("DELETE /comment", s.DeleteReview())
	mux.Handle("GET /comment/translate", s.TranslateReview())
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
