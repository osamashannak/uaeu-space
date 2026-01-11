package professor

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/azure/blobstorage"
	"github.com/osamashannak/uaeu-space/services/pkg/azure/vision"
	"github.com/osamashannak/uaeu-space/services/pkg/cache"
	"github.com/osamashannak/uaeu-space/services/pkg/gateway"
	"github.com/osamashannak/uaeu-space/services/pkg/google/perspective"
	"github.com/osamashannak/uaeu-space/services/pkg/google/recaptcha"
	"github.com/osamashannak/uaeu-space/services/pkg/google/translate"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
	"time"
)

type Server struct {
	db               *database.ProfessorDB
	generator        *snowflake.Generator
	recaptcha        *recaptcha.Recaptcha
	perspective      *perspective.Perspective
	vision           *vision.AzureVision
	translate        *translate.Translate
	cache            *cache.Cache[[]v1.ProfessorInList]
	similarProfCache *cache.Cache[[]v1.SimilarProfessor]
	courseCache      *cache.Cache[[]string]
	storage          *blobstorage.BlobStorage
	gateway          *gateway.Gateway
}

func NewServer(db *database.ProfessorDB,
	generator *snowflake.Generator,
	recaptcha *recaptcha.Recaptcha,
	perspective *perspective.Perspective,
	vision *vision.AzureVision,
	translate *translate.Translate,
	storage *blobstorage.BlobStorage,
	gateway *gateway.Gateway) (*Server, error) {
	return &Server{
		db:               db,
		generator:        generator,
		recaptcha:        recaptcha,
		perspective:      perspective,
		vision:           vision,
		translate:        translate,
		cache:            cache.New[[]v1.ProfessorInList](12 * time.Hour),
		similarProfCache: cache.New[[]v1.SimilarProfessor](7 * 24 * time.Hour),
		courseCache:      cache.New[[]string](7 * 24 * time.Hour),
		storage:          storage,
		gateway:          gateway,
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /professor", s.gateway.Middleware(s.Get()))
	mux.Handle("GET /professor/all", s.GetAll())

	mux.Handle("POST /comment", s.gateway.Middleware(s.PostReview()))
	mux.Handle("DELETE /comment", s.gateway.Middleware(s.DeleteReview()))
	mux.Handle("GET /comment/translate", s.TranslateReview())
	mux.Handle("POST /comment/report", s.gateway.Middleware(s.ReportReview()))
	mux.Handle("POST /comment/attachment", s.UploadReviewAttachment())
	mux.Handle("POST /comment/rating", s.gateway.Middleware(s.AddReviewRating()))
	mux.Handle("DELETE /comment/rating", s.gateway.Middleware(s.DeleteReviewRating()))

	mux.Handle("GET /comment/reply", s.gateway.Middleware(s.GetReplies()))
	mux.Handle("GET /comment/reply/name", s.gateway.Middleware(s.GetReplyName()))
	mux.Handle("POST /comment/reply", s.gateway.Middleware(s.PostReply()))
	mux.Handle("DELETE /comment/reply", s.gateway.Middleware(s.DeleteReply()))
	mux.Handle("POST /comment/reply/like", s.gateway.Middleware(s.LikeReply()))
	mux.Handle("DELETE /comment/reply/like", s.gateway.Middleware(s.UnlikeReply()))

	mux.Handle("GET /feedback/new", s.gateway.Middleware(s.NewFeedback()))
	mux.Handle("POST /feedback", s.Feedback())

	return middleware.CORS(mux)
}
