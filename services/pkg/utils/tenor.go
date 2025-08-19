package utils

import "strings"

func IsValidTenorURL(url string) bool {
	if url == "" {
		return false
	}

	if len(url) < 5 || len(url) > 2048 {
		return false
	}

	return strings.HasPrefix(url, "https://media.tenor.com/")
}
