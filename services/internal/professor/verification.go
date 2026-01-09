package professor

import (
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"net/http"
)

func (s *Server) RequestEmailVerification() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		_ = logging.FromContext(ctx)

	})
}

func (s *Server) VerifyToken() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		_ = logging.FromContext(ctx)

	})
}
