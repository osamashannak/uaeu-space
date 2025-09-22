package utils

import (
	"path/filepath"
	"regexp"
	"strings"
)

func ReviewTextCleaner(text string) string {
	runes := []rune(text)
	if len(runes) > 350 {
		text = string(runes[:350])
	}

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

func SanitizeFileName(original string, id string) string {
	ext := strings.ToLower(filepath.Ext(original))

	safeExt := regexp.MustCompile(`^[a-z0-9]+$`)
	if len(ext) > 1 {
		cleanExt := strings.TrimPrefix(ext, ".")
		if safeExt.MatchString(cleanExt) {
			return id + "." + cleanExt
		}
	}

	return id
}
