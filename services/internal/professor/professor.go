package professor

import (
	"github.com/osamashannak/uaeu-space/services/internal/jsonutil"
	"net/http"
)

func (s *Server) GetAll() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		professors, err := s.db.GetProfessors(ctx)
		if err != nil {
			http.Error(w, "failed to get professors", http.StatusInternalServerError)
			return
		}

		jsonutil.MarshalResponse(w, http.StatusOK, professors)
	})
}

func (s *Server) Get() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}
