package vision

type Config struct {
	SubscriptionKey string `env:"VISION_SUBSCRIPTION_KEY"`
	Endpoint        string `env:"VISION_ENDPOINT" default:"https://eastus.api.cognitive.microsoft.com/vision/v3.2"`
}
