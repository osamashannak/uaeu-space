package professor

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/pkg/azure"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	Port     string `env:"PORT"`
	Database database.Config
	Azure    azure.Config
}

func Setup(ctx context.Context) (*Config, error) {
	logger := logging.FromContext(ctx)

	var cfg Config
	err := envconfig.Process(ctx, &cfg)

	if err != nil {
		return nil, err
	}

	logger.Infow("config", "config", cfg)

	return &cfg, nil
}
