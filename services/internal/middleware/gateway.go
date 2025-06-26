package middleware

import (
	"context"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"net/http"
	"strconv"
)

type Profile struct {
	UserId    int64
	SessionId int64
	Role      string
}

func Gateway(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		sessionId, err := strconv.ParseInt(r.Header.Get("X-Session-ID"), 10, 64)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "Invalid or missing session ID",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		userId, err := strconv.ParseInt(r.Header.Get("X-User-ID"), 10, 64)

		profile := &Profile{
			UserId:    userId,
			SessionId: sessionId,
			Role:      r.Header.Get("X-Role"),
		}

		if profile.UserId == 0 && profile.SessionId == 0 {
			errorResponse := v1.ErrorResponse{
				Message: "Unauthorized",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(ctx, "profile", profile)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)

	})
}
