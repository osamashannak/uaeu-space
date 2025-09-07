package course

import (
	"github.com/osamashannak/uaeu-space/services/pkg/azure/blobstorage"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
	"github.com/osamashannak/uaeu-space/services/pkg/virustotal"
)

type Config struct {
	Port       string `env:"PORT"`
	Database   database.Config
	Azure      blobstorage.Config
	VirusTotal virustotal.Config
}
