package azure

type Config struct {
	StorageAccountName string `env:"AZURE_STORAGE_ACCOUNT"`
	StorageAccessKey   string `env:"AZURE_STORAGE_ACCESS_KEY"`

	MaterialsContainer string `env:"MATERIALS_CONTAINER"`
}
