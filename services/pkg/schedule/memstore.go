package schedule

import (
	"github.com/osamashannak/uaeu-space/services/pkg/schedule/models"
	"sync"
	"time"
)

type Store struct {
	sync.RWMutex
	Sections  map[string]models.Section // Key: CRN
	UpdatedAt time.Time
}

var GlobalCache = &Store{
	Sections: make(map[string]models.Section),
}

func (s *Store) AtomicUpdate(newSections []models.Section) {
	newMap := make(map[string]models.Section)
	for _, sec := range newSections {
		newMap[sec.CRN] = sec
	}

	s.Lock()
	s.Sections = newMap
	s.UpdatedAt = time.Now()
	s.Unlock()
}

func (s *Store) GetSection(crn string) (models.Section, bool) {
	s.RLock()
	defer s.RUnlock()
	val, ok := s.Sections[crn]
	return val, ok
}
