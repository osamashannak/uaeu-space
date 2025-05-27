package middleware

import (
	"context"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/authentication/model"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"net/http"
	"strconv"
)

func Authorization(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("gid")

		if err != nil || cookie.Value == "" {
			errorResponse := v1.ErrorResponse{
				Message: "invalid session",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		id, err := strconv.ParseInt(cookie.Value, 10, 64)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "invalid session",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		ctx := context.WithValue(r.Context(), "session", model.Session{Id: id})

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
