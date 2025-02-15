package course

import (
	"context"
	"fmt"
	"net/http"
)

type Server struct {
	config *Config
	env    *serverenv.ServerEnv
}

func NewServer(config *Config, env *serverenv.ServerEnv) (*Server, error) {
	if env.Database() == nil {
		return nil, fmt.Errorf("missing Database in server env")
	}

	return &Server{
		config: config,
		env:    env,
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
