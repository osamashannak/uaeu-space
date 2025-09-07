package course

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"net/http"
)

func (s *Server) Get() http.Handler {
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

		logger := logging.FromContext(ctx)

		logger.Debugf("received request to get courses list")

		if cached, ok := s.cache.Get("courses"); ok {
			logger.Debugf("returning cached courses list")
			jsonutil.MarshalResponse(w, http.StatusOK, cached)
			return
		}

		logger.Debugf("caching courses list")

		courses, err := s.db.GetCourses(ctx)

		if err != nil {
			logger.Errorf("failed to get courses list")
			errorResponse := v1.ErrorResponse{
				Message: "failed to get professors",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		jsonutil.MarshalResponse(w, http.StatusOK, courses)

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
