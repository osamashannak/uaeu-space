package ses

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

type Client struct {
	sesClient *sesv2.Client
	fromEmail string
}

func NewClient(ctx context.Context, region, fromEmail string) (*Client, error) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config: %w", err)
	}

	return &Client{
		sesClient: sesv2.NewFromConfig(cfg),
		fromEmail: fromEmail,
	}, nil
}

func (c *Client) GenerateSecureToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (c *Client) SendVerificationEmail(ctx context.Context, toEmail, link string) error {
	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(c.fromEmail),
		Destination: &types.Destination{
			ToAddresses: []string{toEmail},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String("Verify your SpaceRead Account"),
				},
				Body: &types.Body{
					Html: &types.Content{
						// todo email template
						Data: aws.String(fmt.Sprintf(`%s`, link)),
					},
				},
			},
		},
	}

	_, err := c.sesClient.SendEmail(ctx, input)
	return err
}
