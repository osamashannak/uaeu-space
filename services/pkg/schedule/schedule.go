package schedule

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/professor/database"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/schedule/banner"
	"log"
	"strings"
	"time"
)

type Schedule struct {
	banner *banner.Banner
	profDB database.ProfessorDB
}

// New initializes the scheduler.
// ctx should be a long-lived context (like context.Background() or a signal context),
// NOT a request context that times out quickly.
func New(ctx context.Context, banner *banner.Banner, profDB database.ProfessorDB) *Schedule {
	s := &Schedule{
		banner: banner,
		profDB: profDB,
	}

	// Start the background worker with the passed context
	go s.runBackgroundUpdater(ctx)

	return s
}

func (s *Schedule) runBackgroundUpdater(ctx context.Context) {
	logger := logging.FromContext(ctx)
	logger.Info("Starting Schedule Background Worker")

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	s.refresh(ctx)

	for {
		select {
		case <-ctx.Done():
			logger.Info("Stopping Schedule Worker: Context Cancelled")
			return

		case <-ticker.C:
			s.refresh(ctx)
		}
	}
}

func (s *Schedule) refresh(ctx context.Context) {
	logger := logging.FromContext(ctx)

	sections, err := s.banner.FetchAllCourses("202620")
	if err != nil {
		logger.Error("Error fetching courses", err)
		return
	}

	profList, err := s.profDB.GetProfessors(ctx, "United Arab Emirates University")

	if err != nil {
		logger.Error("Error fetching professors", err)
	}

	registeredEmails := make(map[string]bool)
	for _, p := range profList {
		normalized := strings.ToLower(strings.TrimSpace(p.Email))
		registeredEmails[normalized] = true
	}

	for i := range sections {
		for j := range sections[i].Faculty {
			email := strings.ToLower(strings.TrimSpace(sections[i].Faculty[j].Email))

			if registeredEmails[email] {
				sections[i].Faculty[j].SpaceReadID = &sections[i].Faculty[j].Email
			}
		}
	}

	GlobalCache.AtomicUpdate(sections)
	log.Printf("Cache updated: %d sections", len(sections))
}
