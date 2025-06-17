package middleware

import (
	"context"
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
			http.Error(w, "Invalid or missing session ID", http.StatusUnauthorized)
			return
		}

		userId, err := strconv.ParseInt(r.Header.Get("X-User-ID"), 10, 64)

		if err != nil {
			http.Error(w, "Invalid or missing user ID", http.StatusUnauthorized)
			return
		}

		profile := &Profile{
			UserId:    userId,
			SessionId: sessionId,
			Role:      r.Header.Get("X-Role"),
		}

		if profile.UserId == 0 && profile.SessionId == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(ctx, "profile", profile)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)

	})
}
