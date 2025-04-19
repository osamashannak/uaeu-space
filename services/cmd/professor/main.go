package professor

import (
	googleRecaptcha "cloud.google.com/go/recaptchaenterprise/v2/apiv1"
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor"
	profDB "github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/google/recaptcha"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/server"
	"github.com/osamashannak/uaeu-space/services/pkg/snowflake"

	"fmt"
	"os/signal"
	"syscall"
)

func main() {
	ctx, done := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	logger := logging.NewLoggerFromEnv()

	ctx = logging.WithLogger(ctx, logger)

	defer func() {
		done()
		if r := recover(); r != nil {
			logger.Fatalw("application panic", "panic", r)
		}
	}()

	err := realMain(ctx)
	done()

	if err != nil {
		logger.Fatal(err)
	}
	logger.Info("successful shutdown")
}

func realMain(ctx context.Context) error {
	logger := logging.FromContext(ctx)

	var cfg *professor.Config
	cfg, err := professor.Setup(ctx)
	if err != nil {
		return fmt.Errorf("setup.Setup: %w", err)
	}

	logger.Info("configuring database")

	db, err := database.NewDB(ctx, &cfg.Database)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %w", err)
	}
	defer db.Close(ctx)

	professorDb := profDB.New(db)

	sfGenerator := snowflake.New(1)

	client, _ := googleRecaptcha.NewClient(ctx)
	defer client.Close()

	recaptchaClient := recaptcha.New(client, &cfg.Recaptcha)

	professorServer, err := professor.NewServer(professorDb, sfGenerator, recaptchaClient)
	if err != nil {
		return fmt.Errorf("publish.NewServer: %w", err)
	}

	srv, err := server.New(cfg.Port)
	if err != nil {
		return fmt.Errorf("server.New: %w", err)
	}

	logger.Infow("server listening", "port", cfg.Port)

	return srv.ServeHTTP(ctx, professorServer.Routes(ctx))
}
