package main

import (
	"context"
	"github.com/joho/godotenv"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"os/signal"
	"syscall"
)

func main() {
	_ = godotenv.Load()

	ctx, done := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	logger := logging.DefaultLogger()

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

}
