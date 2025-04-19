package professor

import (
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
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

		email := r.URL.Query().Get("email")

		if email == "" {
			http.Error(w, "missing email parameter", http.StatusBadRequest)
			return
		}

		professor, err := s.db.GetProfessor(ctx, email)

		if err != nil {
			http.Error(w, "failed to get professor", http.StatusInternalServerError)
			return
		}

		if professor == nil {
			http.Error(w, "professor not found", http.StatusNotFound)
			return
		}

		jsonutil.MarshalResponse(w, http.StatusOK, professor)
	})
}
