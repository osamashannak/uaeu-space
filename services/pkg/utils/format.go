package utils

import "fmt"

func FormatBlobURL(accountClient, containerName, blobName, sasQuery string) string {
	return fmt.Sprintf("%s/%s/%s?%s", accountClient, containerName, blobName, sasQuery)
}
