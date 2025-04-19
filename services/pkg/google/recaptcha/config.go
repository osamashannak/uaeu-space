package recaptcha

type Config struct {
	SiteKey        string  `env:"RECAPTCHA_SITE_KEY"`
	ProjectID      string  `env:"RECAPTCHA_PROJECT_ID"`
	ExpectedAction string  `env:"RECAPTCHA_EXPECTED_ACTION"`
	Threshold      float32 `env:"RECAPTCHA_THRESHOLD"`
}
