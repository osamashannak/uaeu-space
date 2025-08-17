package utils

import (
	"math/rand"
	"strconv"
	"strings"
)

var adjectives = []string{
	"good",
	"new",
	"first",
	"last",
	"great",
	"right",
	"high",
	"different",
	"small",
	"large",
	"early",
	"young",
	"few",
	"able",
	"free",
	"whole",
	"short",
	"easy",
	"strong",
	"special",
	"clear",
	"recent",
	"late",
	"medical",
	"central",
	"common",
	"poor",
	"major",
	"happy",
	"serious",
	"ready",
	"environmental",
	"financial",
	"blue",
	"necessary",
	"original",
	"successful",
	"electrical",
	"expensive",
	"academic",
	"aware",
	"additional",
	"available",
	"comfortable",
	"traditional",
	"primary",
	"professional",
	"useful",
	"historical",
	"effective",
	"similar",
	"reasonable",
	"accurate",
	"difficult",
	"critical",
	"unable",
	"efficient",
	"interesting",
	"civil",
	"detailed",
	"valuable",
	"popular",
	"technical",
	"typical",
	"private",
	"essential",
	"physical",
	"reliable",
}

var nouns = []string{
	"time",
	"year",
	"way",
	"day",
	"life",
	"world",
	"school",
	"family",
	"problem",
	"hand",
	"part",
	"place",
	"week",
	"company",
	"system",
	"program",
	"question",
	"work",
	"number",
	"point",
	"home",
	"water",
	"room",
	"area",
	"money",
	"story",
	"fact",
	"month",
	"study",
	"book",
	"eye",
	"job",
	"word",
	"business",
	"issue",
	"side",
	"kind",
	"house",
	"service",
	"power",
	"hour",
	"game",
	"line",
	"end",
	"member",
	"law",
	"car",
	"city",
	"community",
	"team",
	"minute",
	"idea",
	"information",
	"level",
	"office",
	"door",
	"health",
	"art",
	"history",
	"party",
	"result",
	"change",
	"morning",
	"reason",
	"research",
	"moment",
	"air",
}

func GenerateAuthorName() string {
	adjective := adjectives[rand.Intn(len(adjectives))]
	noun := nouns[rand.Intn(len(nouns))]
	return capitalize(adjective) + capitalize(noun)
}

func capitalize(word string) string {
	if len(word) == 0 {
		return word
	}
	return strings.ToUpper(word[:1]) + strings.ToLower(word[1:])
}

func ParseInt64List(s string) ([]int64, error) {
	if s == "" {
		return []int64{}, nil
	}

	parts := strings.Split(s, ",")
	result := make([]int64, 0, len(parts))

	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		n, err := strconv.ParseInt(p, 10, 64)
		if err != nil {
			return nil, err
		}
		result = append(result, n)
	}

	return result, nil
}
