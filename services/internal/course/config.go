package course

import (
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/virustotal"
)

type Config struct {
	Port       string `env:"PORT"`
	Database   database.Config
	Azure      azure.Config
	VirusTotal virustotal.Config
}
