package course

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/pkg/azure/blobstorage"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/gateway"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/virustotal"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	Port       string `env:"PORT"`
	Database   database.Config
	Azure      blobstorage.Config
	VirusTotal virustotal.Config
	Gateway    gateway.Config
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
