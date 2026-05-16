package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/sethvargo/go-envconfig"
)

type config struct {
	Database       database.Config
	DatabaseURL    string `env:"DATABASE_URL"`
	MigrationsPath string `env:"MIGRATIONS_PATH, default=migrations"`
}

func main() {
	_ = godotenv.Load()

	if err := run(context.Background(), os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(ctx context.Context, args []string) error {
	fs := flag.NewFlagSet("migrate", flag.ContinueOnError)
	fs.SetOutput(os.Stderr)

	migrationsPath := fs.String("path", "", "path to migration files")
	databaseURL := fs.String("database-url", "", "Postgres connection URL")
	fs.Usage = func() {
		fmt.Fprintln(fs.Output(), "usage: go run ./cmd/migrate [flags] <command> [args]")
		fmt.Fprintln(fs.Output(), "")
		fmt.Fprintln(fs.Output(), "commands:")
		fmt.Fprintln(fs.Output(), "  create <name>   create the next up/down migration pair")
		fmt.Fprintln(fs.Output(), "  up [n]          apply all pending migrations, or n migrations")
		fmt.Fprintln(fs.Output(), "  down <n>        roll back n migrations")
		fmt.Fprintln(fs.Output(), "  steps <n>       move n migrations; use a negative number to roll back")
		fmt.Fprintln(fs.Output(), "  force <version> set the migration version without running SQL")
		fmt.Fprintln(fs.Output(), "  version         print the current migration version")
		fmt.Fprintln(fs.Output(), "")
		fs.PrintDefaults()
	}

	if err := fs.Parse(args); err != nil {
		return err
	}
	if fs.NArg() == 0 {
		fs.Usage()
		return errors.New("missing migration command")
	}

	cfg, err := loadConfig(ctx)
	if err != nil {
		return err
	}
	if *migrationsPath != "" {
		cfg.MigrationsPath = *migrationsPath
	}
	if *databaseURL != "" {
		cfg.DatabaseURL = *databaseURL
	}

	commandArgs := fs.Args()
	if commandArgs[0] == "create" {
		return createMigration(cfg.MigrationsPath, commandArgs[1:])
	}

	migrator, err := newMigrator(cfg)
	if err != nil {
		return err
	}

	commandErr := applyCommand(migrator, commandArgs)
	sourceErr, databaseErr := migrator.Close()
	if commandErr != nil {
		return commandErr
	}
	if sourceErr != nil {
		return sourceErr
	}
	return databaseErr
}

func loadConfig(ctx context.Context) (*config, error) {
	var cfg config
	if err := envconfig.Process(ctx, &cfg); err != nil {
		return nil, fmt.Errorf("load migration config: %w", err)
	}
	return &cfg, nil
}

func newMigrator(cfg *config) (*migrate.Migrate, error) {
	databaseURL := cfg.DatabaseURL
	if databaseURL == "" {
		if cfg.Database.Name == "" {
			return nil, errors.New("set DATABASE_URL or DB_NAME before running migrations")
		}
		databaseURL = cfg.Database.ConnectionURL()
	}

	sourceURL, err := migrationsSourceURL(cfg.MigrationsPath)
	if err != nil {
		return nil, err
	}

	migrator, err := migrate.New(sourceURL, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("create migrator: %w", err)
	}
	return migrator, nil
}

func migrationsSourceURL(path string) (string, error) {
	if path == "" {
		return "", errors.New("migration path cannot be empty")
	}

	abs, err := filepath.Abs(path)
	if err != nil {
		return "", fmt.Errorf("resolve migration path: %w", err)
	}

	return "file://" + filepath.ToSlash(abs), nil
}

func applyCommand(migrator *migrate.Migrate, args []string) error {
	switch args[0] {
	case "up":
		if len(args) > 2 {
			return errors.New("up accepts at most one migration count")
		}
		if len(args) == 1 {
			return ignoreNoChange(migrator.Up())
		}
		steps, err := parseSteps(args[1])
		if err != nil {
			return err
		}
		if steps < 1 {
			return errors.New("up count must be greater than zero")
		}
		return ignoreNoChange(migrator.Steps(steps))
	case "down":
		if len(args) != 2 {
			return errors.New("down requires the number of migrations to roll back")
		}
		steps, err := parseSteps(args[1])
		if err != nil {
			return err
		}
		if steps < 1 {
			return errors.New("down count must be greater than zero")
		}
		return ignoreNoChange(migrator.Steps(-steps))
	case "steps":
		if len(args) != 2 {
			return errors.New("steps requires a signed migration count")
		}
		steps, err := parseSteps(args[1])
		if err != nil {
			return err
		}
		if steps == 0 {
			return errors.New("steps count cannot be zero")
		}
		return ignoreNoChange(migrator.Steps(steps))
	case "force":
		if len(args) != 2 {
			return errors.New("force requires a migration version")
		}
		version, err := parseVersion(args[1])
		if err != nil {
			return err
		}
		return migrator.Force(version)
	case "version":
		if len(args) != 1 {
			return errors.New("version does not accept arguments")
		}
		version, dirty, err := migrator.Version()
		if errors.Is(err, migrate.ErrNilVersion) {
			fmt.Println("version: none dirty: false")
			return nil
		}
		if err != nil {
			return err
		}
		fmt.Printf("version: %d dirty: %t\n", version, dirty)
		return nil
	default:
		return fmt.Errorf("unknown migration command %q", args[0])
	}
}

func ignoreNoChange(err error) error {
	if errors.Is(err, migrate.ErrNoChange) {
		fmt.Println("no migrations to apply")
		return nil
	}
	return err
}

func parseSteps(value string) (int, error) {
	steps, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("invalid migration count %q: %w", value, err)
	}
	return steps, nil
}

func parseVersion(value string) (int, error) {
	version, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("invalid migration version %q: %w", value, err)
	}
	if version < 0 {
		return 0, errors.New("migration version cannot be negative")
	}
	return version, nil
}

func createMigration(path string, args []string) error {
	if len(args) != 1 {
		return errors.New("create requires a migration name")
	}

	name := normalizeMigrationName(args[0])
	if name == "" {
		return errors.New("migration name must contain at least one letter or number")
	}

	if err := os.MkdirAll(path, 0755); err != nil {
		return fmt.Errorf("create migration directory: %w", err)
	}

	version, err := nextMigrationVersion(path)
	if err != nil {
		return err
	}

	for _, direction := range []string{"up", "down"} {
		filename := filepath.Join(path, fmt.Sprintf("%06d_%s.%s.sql", version, name, direction))
		if err := os.WriteFile(filename, []byte("-- Add migration SQL here.\n"), 0644); err != nil {
			return fmt.Errorf("create %s migration: %w", direction, err)
		}
		fmt.Println(filename)
	}

	return nil
}

var nonNameCharacter = regexp.MustCompile(`[^a-z0-9]+`)

func normalizeMigrationName(name string) string {
	name = strings.ToLower(strings.TrimSpace(name))
	name = nonNameCharacter.ReplaceAllString(name, "_")
	return strings.Trim(name, "_")
}

func nextMigrationVersion(path string) (int, error) {
	files, err := filepath.Glob(filepath.Join(path, "*.sql"))
	if err != nil {
		return 0, fmt.Errorf("list migrations: %w", err)
	}

	maxVersion := 0
	for _, file := range files {
		base := filepath.Base(file)
		if len(base) < 6 {
			continue
		}
		version, err := strconv.Atoi(base[:6])
		if err != nil {
			continue
		}
		if version > maxVersion {
			maxVersion = version
		}
	}

	return maxVersion + 1, nil
}
