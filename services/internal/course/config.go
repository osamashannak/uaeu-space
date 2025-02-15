package course

import (
	"course/pkg/azure"
	"course/pkg/database"
	"course/pkg/virustotal"
)

type Config struct {
	Port       string `env:"PORT"`
	Database   database.Config
	Azure      azure.Config
	VirusTotal virustotal.Config
}
