package professor

import (
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/azure/blobstorage"
	"github.com/osamashannak/uaeu-space/services/pkg/azure/vision"
	"github.com/osamashannak/uaeu-space/services/pkg/cache"
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
	sesClient        *sesv2.Client
}

func NewServer(db *database.ProfessorDB,
	generator *snowflake.Generator,
	recaptcha *recaptcha.Recaptcha,
	perspective *perspective.Perspective,
	vision *vision.AzureVision,
	translate *translate.Translate,
	storage *blobstorage.BlobStorage,
	sesClient *sesv2.Client) (*Server, error) {
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
		sesClient:        sesClient,
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /professor", middleware.Gateway(s.Get(), *s.db.Db, *s.generator))
	mux.Handle("GET /professor/all", s.GetAll())

	mux.Handle("POST /comment", middleware.Gateway(s.PostReview(), *s.db.Db, *s.generator))
	mux.Handle("DELETE /comment", middleware.Gateway(s.DeleteReview(), *s.db.Db, *s.generator))
	mux.Handle("GET /comment/translate", s.TranslateReview())
	mux.Handle("POST /comment/report", middleware.Gateway(s.ReportReview(), *s.db.Db, *s.generator))
	mux.Handle("POST /comment/attachment", s.UploadReviewAttachment())
	mux.Handle("POST /comment/rating", middleware.Gateway(s.AddReviewRating(), *s.db.Db, *s.generator))
	mux.Handle("DELETE /comment/rating", middleware.Gateway(s.DeleteReviewRating(), *s.db.Db, *s.generator))

	mux.Handle("GET /comment/reply", middleware.Gateway(s.GetReplies(), *s.db.Db, *s.generator))
	mux.Handle("GET /comment/reply/name", middleware.Gateway(s.GetReplyName(), *s.db.Db, *s.generator))
	mux.Handle("POST /comment/reply", middleware.Gateway(s.PostReply(), *s.db.Db, *s.generator))
	mux.Handle("DELETE /comment/reply", middleware.Gateway(s.DeleteReply(), *s.db.Db, *s.generator))
	mux.Handle("POST /comment/reply/like", middleware.Gateway(s.LikeReply(), *s.db.Db, *s.generator))
	mux.Handle("DELETE /comment/reply/like", middleware.Gateway(s.UnlikeReply(), *s.db.Db, *s.generator))

	mux.Handle("GET /feedback/new", middleware.Gateway(s.NewFeedback(), *s.db.Db, *s.generator))
	mux.Handle("POST /feedback", s.Feedback())

	mux.Handle("POST /verify/request", s.RequestEmailVerification())
	mux.Handle("POST /verify/token", s.VerifyToken())

	return middleware.CORS(mux)
}
