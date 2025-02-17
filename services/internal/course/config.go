package course

import (
	"services/pkg/azure"
	"services/pkg/database"
)

type Config struct {
	Port       string `env:"PORT"`
	Database   database.Config
	Azure      azure.Config
	VirusTotal virustotal.Config
}
