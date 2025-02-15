package course

import (
	"context"
	"course/internal/repository"
	"net/http"
)

type Server struct {
	config     Config
	repository repository.CourseDB
}

func NewServer(config Config, repository repository.CourseDB) (*Server, error) {
	return &Server{
		config:     config,
		repository: repository,
	}, nil
}

func (s *Server) Routes(ctx context.Context) http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /course", s.GetCourse())
	mux.Handle("GET /course/list", s.GetCourseList())
	mux.Handle("POST /course/upload", s.UploadCourseFile())
	mux.Handle("GET /course/download", s.DownloadCourseFile())

	return mux
}
