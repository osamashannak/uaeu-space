package main

import (
	"context"
	"course/internal/course"
	"course/internal/repository"
	"course/pkg/database"
	"course/pkg/logging"
	"course/pkg/server"

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

	var cfg course.Config
	cfg, err := setup(ctx)
	if err != nil {
		return fmt.Errorf("setup.Setup: %w", err)
	}

	logger.Info("configuring database")

	db, err := database.NewDB(ctx, &cfg.Database)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %w", err)
	}
	defer db.Close(ctx)

	repo := repository.NewCourseDB(db)

	courseServer, err := course.NewServer(cfg, *repo)
	if err != nil {
		return fmt.Errorf("publish.NewServer: %w", err)
	}

	srv, err := server.New(cfg.Port)
	if err != nil {
		return fmt.Errorf("server.New: %w", err)
	}

	logger.Infow("server listening", "port", cfg.Port)

	return srv.ServeHTTP(ctx, courseServer.Routes(ctx))
}

func setup(ctx context.Context) (course.Config, error) {
	cfg, err := course.LoadConfig()
	if err != nil {
		return course.Config{}, fmt.Errorf("course.LoadConfig: %w", err)
	}

	return cfg, nil
}
