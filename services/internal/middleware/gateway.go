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
	"github.com/osamashannak/uaeu-space/services/pkg/utils"
	"net/http"
	"strings"
)

type Profile struct {
	SessionId int64
}

const (
	cookieName   = "gid"
	cookieDomain = ".spaceread.net"
)

type contextKey string

const profileContextKey contextKey = "profile"

func Gateway(next http.Handler, database database.DB, generator snowflake.Generator) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqLogger := logging.FromContext(r.Context())

		ctx := r.Context()
		userAgent := r.UserAgent()

		if isBot(userAgent) {
			reqLogger.Debugf("Bot detected, skipping session creation")
			profile := &Profile{SessionId: 0}

			ctx = context.WithValue(ctx, profileContextKey, profile)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)
			return
		}

		ipAddress := utils.GetClientIP(r)

		var id *int64
		isNewSession := false
		cookie, err := r.Cookie(cookieName)

		if err == nil || cookie != nil {
			id, err = database.GetSessionID(ctx, cookie.Value)
			if err != nil {
				reqLogger.Warnf("Cookie present but failed to get session from DB (validity check or db error): %v", err)
			}
		}

		if id == nil {
			isNewSession = true
			id, err = createSession(ctx, w, database, generator, ipAddress, r.UserAgent())
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
			"remote_ip", ipAddress,
			"id", profile.SessionId,
			"new", isNewSession,
		)

		ctx = logging.WithLogger(ctx, reqLogger)

		reqLogger.Debugf("Session ID: %d", profile.SessionId)

		ctx = context.WithValue(ctx, profileContextKey, profile)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)

	})
}

func isBot(ua string) bool {
	ua = strings.ToLower(ua)
	return strings.Contains(ua, "googlebot") ||
		strings.Contains(ua, "bingbot") ||
		strings.Contains(ua, "yandex") ||
		strings.Contains(ua, "baiduspider") ||
		strings.Contains(ua, "twitterbot") ||
		strings.Contains(ua, "facebookexternalhit") ||
		strings.Contains(ua, "rogerbot") ||
		strings.Contains(ua, "linkedinbot") ||
		strings.Contains(ua, "embedly") ||
		strings.Contains(ua, "quora link preview") ||
		strings.Contains(ua, "showyoubot") ||
		strings.Contains(ua, "outbrain") ||
		strings.Contains(ua, "pinterest/0.") ||
		strings.Contains(ua, "slackbot") ||
		strings.Contains(ua, "vkshare") ||
		strings.Contains(ua, "w3c_validator")
}

func GetProfile(ctx context.Context) (*Profile, bool) {
	p, ok := ctx.Value(profileContextKey).(*Profile)
	return p, ok
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
		MaxAge:   365 * 60 * 60 * 24,
		Secure:   true,
		HttpOnly: true,
		Path:     "/",
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
