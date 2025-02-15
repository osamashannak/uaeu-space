package utils

import "fmt"

func FormatBlobURL(containerName, blobName, sasQuery string) string {
	return fmt.Sprintf("https://%s.blob.core.windows.net/%s?%s", containerName, blobName, sasQuery)
}
