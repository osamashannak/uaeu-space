package course

import "net/http"

func (s *Server) GetCourse() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		ctx := r.Context()

		tag := r.URL.Query().Get("tag")

		if tag == "" {
			http.Error(w, "missing tag parameter", http.StatusBadRequest)
			return
		}
	})
}

func (s *Server) GetCourseList() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}

func (s *Server) UploadCourseFile() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}

func (s *Server) DownloadCourseFile() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}
