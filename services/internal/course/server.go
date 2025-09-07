package course

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/course/database"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/pkg/cache"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
	"time"
)

type Server struct {
	config    *Config
	db        *database.CourseDB
	generator *snowflake.Generator
	cache     *cache.Cache[[]v1.CourseInList]
}

func NewServer(config *Config, db *database.CourseDB, generator *snowflake.Generator) (*Server, error) {
	return &Server{
		config:    config,
		db:        db,
		generator: generator,
		cache:     cache.New[[]v1.CourseInList](24 * 7 * 24 * time.Hour),
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /course", s.Get())
	mux.Handle("GET /course/list", s.GetCourseList())
	mux.Handle("POST /course/upload", middleware.Gateway(s.UploadCourseFile(), *s.db.Db, *s.generator))
	mux.Handle("GET /course/download", s.DownloadCourseFile())

	return mux
}
