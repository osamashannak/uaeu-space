package course

import (
	"github.com/osamashannak/uaeu-space/services/internal/course/database"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
)

type Server struct {
	config    *Config
	db        *database.CourseDB
	generator *snowflake.Generator
}

func NewServer(config *Config, db *database.CourseDB, generator *snowflake.Generator) (*Server, error) {
	return &Server{
		config:    config,
		db:        db,
		generator: generator,
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /course", s.GetCourse())
	mux.Handle("GET /course/list", s.GetCourseList())
	mux.Handle("POST /course/upload", middleware.Gateway(s.UploadCourseFile(), *s.db.Db, *s.generator))
	mux.Handle("GET /course/download", s.DownloadCourseFile())

	return mux
}
