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

func SanitizeFileName(original string) string {
	ext := filepath.Ext(original)
	base := strings.TrimSuffix(original, ext)

	re := regexp.MustCompile(`[^a-zA-Z0-9 _.-]+`)
	base = re.ReplaceAllString(base, "_")

	base = strings.Join(strings.Fields(base), " ")

	base = strings.TrimSpace(base)

	if base == "" {
		base = "file"
	}

	ext = strings.ToLower(ext)
	reExt := regexp.MustCompile(`[^a-z0-9]+`)
	ext = reExt.ReplaceAllString(ext, "")

	if ext != "" {
		return base + "." + ext
	}
	return base
}
