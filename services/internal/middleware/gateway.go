package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"net/http"
)

type Profile struct {
	SessionId int64
}

const (
	cookieName   = "gid"
	cookieDomain = "spaceread.net"
)

func Gateway(next http.Handler, database database.DB, generator snowflake.Generator) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqLogger := logging.FromContext(r.Context())

		ctx := r.Context()

		var id *int64

		cookie, err := r.Cookie(cookieName)

		if err != nil || cookie == nil {
			id, err = createSession(ctx, w, database, generator, r.RemoteAddr, r.UserAgent())
			if err != nil {
				reqLogger.Errorf("Failed to create session: %v", err)
				errorResponse := v1.ErrorResponse{
					Message: "Failed to create session",
					Error:   http.StatusInternalServerError,
				}
				jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
				return
			}
		} else {
			id, err = database.GetSessionID(ctx, cookie.Value)
		}

		if id == nil {
			id, err = createSession(ctx, w, database, generator, r.RemoteAddr, r.UserAgent())
			if err != nil {
				reqLogger.Errorf("Failed to create session: %v", err)
				errorResponse := v1.ErrorResponse{
					Message: "Failed to create session",
					Error:   http.StatusInternalServerError,
				}
				jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
				return
			}
		}

		profile := &Profile{
			SessionId: *id,
		}

		reqLogger = reqLogger.With(
			"method", r.Method,
			"path", r.URL.Path,
			"remote_ip", r.RemoteAddr,
			"id", profile.SessionId,
		)

		ctx = logging.WithLogger(ctx, reqLogger)

		reqLogger.Debugf("Session ID: %d", profile.SessionId)

		ctx = context.WithValue(ctx, "profile", profile)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)

	})
}

func createSession(ctx context.Context, w http.ResponseWriter, database database.DB, generator snowflake.Generator, ipAddress, userAgent string) (*int64, error) {
	sessionId := int64(generator.Next())
	token, err := randomHex(32)

	if err != nil {
		return nil, err
	}

	err = database.CreateSession(ctx, sessionId, token, userAgent, ipAddress)

	if err != nil {
		return nil, err
	}

	cookie := &http.Cookie{
		Name:     cookieName,
		Value:    token,
		Domain:   cookieDomain,
		MaxAge:   365 * 1000 * 60 * 60 * 24,
		Secure:   true,
		HttpOnly: true,
	}

	http.SetCookie(w, cookie)

	return &sessionId, nil

}

func randomHex(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
