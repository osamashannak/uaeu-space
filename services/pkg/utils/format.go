package utils

import "fmt"

func FormatBlobURL(containerName, blobName, sasQuery string) string {
	return fmt.Sprintf("https://uaeuresources.blob.core.windows.net/%s/%s?%s", containerName, blobName, sasQuery)
}
