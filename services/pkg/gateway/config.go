package gateway

type Config struct {
	SessionCookieName string `env:"SESSION_COOKIE_NAME"`
	CookieDomain      string `env:"COOKIE_DOMAIN"`
	JWTSecret         string `env:"JWT_SECRET"`
}
