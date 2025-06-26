package utils

import (
	"regexp"
	"strings"
)

func ReviewTextCleaner(text string) string {
	trimmed := strings.TrimSpace(text)

	if trimmed == "" {
		return ""
	}

	newlineRegex := regexp.MustCompile(`(\n[ \t]*){3,}`)
	normalizedNewlines := newlineRegex.ReplaceAllString(trimmed, "\n\n")

	spaceRegex := regexp.MustCompile(`[ \t]{2,}`)
	normalizedSpaces := spaceRegex.ReplaceAllString(normalizedNewlines, " ")

	return normalizedSpaces
}
