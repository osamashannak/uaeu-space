package ses

import (
	"bytes"
	"context"
	"crypto/rand"
	"embed"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	"html/template"
	"math/big"
)

//go:embed templates/*.html
var templateFS embed.FS

type Client struct {
	sesClient *sesv2.Client
	fromEmail string
	tmpl      *template.Template
}

func New(ctx context.Context, cfg *aws.Config, fromEmail string) (*Client, error) {
	awsCfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(cfg.Region))
	if err != nil {
		return nil, err
	}

	t, err := template.ParseFS(templateFS, "templates/verification.html")
	if err != nil {
		return nil, fmt.Errorf("failed to parse email template: %w", err)
	}

	return &Client{
		sesClient: sesv2.NewFromConfig(awsCfg),
		fromEmail: fromEmail,
		tmpl:      t,
	}, nil
}

func (c *Client) GenerateOTP() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%04d", n), nil
}

func (c *Client) SendVerificationEmail(ctx context.Context, toEmail, otp string) error {
	data := struct {
		OTP string
	}{
		OTP: otp,
	}

	var body bytes.Buffer
	if err := c.tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(c.fromEmail),
		Destination: &types.Destination{
			ToAddresses: []string{toEmail},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String(fmt.Sprintf("%s is your SpaceRead verification code", otp)),
				},
				Body: &types.Body{
					Html: &types.Content{
						Data: aws.String(body.String()),
					},
				},
			},
		},
	}

	_, err := c.sesClient.SendEmail(ctx, input)
	return err
}
