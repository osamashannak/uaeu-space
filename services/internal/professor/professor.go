package professor

import (
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"net/http"
)

func (s *Server) GetAll() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		university := r.URL.Query().Get("university")

		if university == "" {
			university = "United Arab Emirates University"
		}

		if cached, ok := s.cache.Get(university); ok {
			jsonutil.MarshalResponse(w, http.StatusOK, cached)
			return
		}

		professors, err := s.db.GetProfessors(ctx, university)
		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "failed to get professors",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		s.cache.Set(university, professors)
		jsonutil.MarshalResponse(w, http.StatusOK, professors)
	})
}

func (s *Server) Get() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		email := r.URL.Query().Get("email")

		if email == "" {
			errorResponse := v1.ErrorResponse{
				Message: "missing email parameter",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		professor, err := s.db.GetProfessor(ctx, email)

		if err != nil {
			fmt.Println(err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to get professor",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if professor == nil {
			errorResponse := v1.ErrorResponse{
				Message: "professor not found",
				Error:   http.StatusNotFound,
			}
			jsonutil.MarshalResponse(w, http.StatusNotFound, errorResponse)
			return
		}

		reviews, err := s.db.GetProfessorReviews(ctx, email)

		if err != nil {
			fmt.Println("failed to get professor reviews:", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to get professor reviews",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		response := v1.ProfessorResponse{
			Email:      professor.Email,
			Name:       professor.Name,
			University: professor.University,
			College:    professor.College,
			Reviews:    *reviews,
		}

		jsonutil.MarshalResponse(w, http.StatusOK, response)
	})
}
