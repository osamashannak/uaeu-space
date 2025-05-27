package translate

import (
	"cloud.google.com/go/translate"
	"context"
	"fmt"
	"golang.org/x/text/language"
)

type Translate struct {
	client *translate.Client
}

func New(client *translate.Client) *Translate {
	return &Translate{
		client: client,
	}
}

func (c *Translate) TranslateToEnglish(ctx context.Context, text string) (string, error) {
	lang := language.AmericanEnglish

	resp, err := c.client.Translate(ctx, []string{text}, lang, nil)

	if err != nil {
		return "", fmt.Errorf("failed to translate text: %w", err)
	}

	if len(resp) == 0 {
		return "", fmt.Errorf("no translation found")
	}

	translatedText := resp[0].Text

	return translatedText, nil
}
