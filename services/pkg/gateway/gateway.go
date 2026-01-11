package gateway

import (
	"context"
	"github.com/golang-jwt/jwt/v5"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"
	"github.com/osamashannak/uaeu-space/services/pkg/utils"
	"net/http"
	"strings"
	"time"
)

type Gateway struct {
	database          database.DB
	gen               snowflake.Generator
	config            Config
	profileContextKey contextKey
}

func New(db database.DB, gen snowflake.Generator, cfg Config) *Gateway {
	return &Gateway{
		database:          db,
		gen:               gen,
		config:            cfg,
		profileContextKey: "profile",
	}
}

func (g *Gateway) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqLogger := logging.FromContext(r.Context())
		ctx := r.Context()

		var sessionId int64
		cookie, err := r.Cookie(g.config.SessionCookieName)

		if err == nil && cookie != nil {
			tokenStr := cookie.Value

			if strings.Contains(tokenStr, ".") {
				claims, err := g.verifyJWT(tokenStr)
				if err == nil {
					sessionId = claims.SessionId
				}
			} else {
				idPtr, err := g.database.GetSessionID(ctx, tokenStr)
				if err == nil && idPtr != nil {
					sessionId = *idPtr

					g.upgradeToJWT(w, sessionId)
					reqLogger.Debugf("Upgraded user %d from opaque token to JWT", sessionId)
				}
			}
		}

		if sessionId == 0 && !isBot(r.UserAgent()) {
			idPtr, _ := g.createSession(w, utils.GetClientIP(r), r.UserAgent())
			if idPtr != nil {
				sessionId = *idPtr
			}
		}

		profile := &Profile{
			SessionId: sessionId,
		}

		reqLogger = reqLogger.With(
			"method", r.Method,
			"path", r.URL.Path,
			"remote_ip", utils.GetClientIP(r),
			"id", profile.SessionId,
		)

		ctx = logging.WithLogger(ctx, reqLogger)
		ctx = context.WithValue(ctx, g.profileContextKey, profile)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func (g *Gateway) GetProfile(ctx context.Context) (*Profile, bool) {
	p, ok := ctx.Value(g.profileContextKey).(*Profile)
	return p, ok
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

func (g *Gateway) generateJWT(sessionId int64) (string, error) {
	claims := SessionClaims{
		SessionId: sessionId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().AddDate(10, 0, 0)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(g.config.JWTSecret))
}

func (g *Gateway) verifyJWT(tokenString string) (*SessionClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &SessionClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(g.config.JWTSecret), nil
	})

	if claims, ok := token.Claims.(*SessionClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, err
}

func (g *Gateway) createSession(w http.ResponseWriter, ip, userAgent string) (*int64, error) {
	sessionId := int64(g.gen.Next())

	tokenString, err := g.generateJWT(sessionId)
	if err != nil {
		return nil, err
	}

	go func() {
		err := g.database.CreateSession(context.Background(), sessionId, tokenString, userAgent, ip)
		if err != nil {
			return
		}
	}()

	const tenYears = 10 * 365 * 24 * 60 * 60

	http.SetCookie(w, &http.Cookie{
		Name:     g.config.SessionCookieName,
		Value:    tokenString,
		Domain:   g.config.CookieDomain,
		MaxAge:   tenYears,
		Secure:   true,
		HttpOnly: true,
		Path:     "/",
	})

	return &sessionId, nil
}

func (g *Gateway) upgradeToJWT(w http.ResponseWriter, sid int64) {
	tokenString, _ := g.generateJWT(sid)

	const tenYears = 10 * 365 * 24 * 60 * 60

	http.SetCookie(w, &http.Cookie{
		Name:     g.config.SessionCookieName,
		Value:    tokenString,
		Domain:   g.config.CookieDomain,
		MaxAge:   tenYears,
		Secure:   true,
		HttpOnly: true,
		Path:     "/",
	})

	err := g.database.UpdateSessionToken(context.Background(), sid, tokenString)

	if err != nil {
		logging.DefaultLogger().Errorf("failed to update session token for session %d: %v", sid, err)
		return
	}
}
