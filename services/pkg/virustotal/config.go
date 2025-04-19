package virustotal

type Config struct {
	APIKey      string
	EndPoint    string
	MinuteLimit int `env:"MINUTE_LIMIT"`
	DailyLimit  int
}
