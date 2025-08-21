package recaptcha

import (
	recaptcha "cloud.google.com/go/recaptchaenterprise/v2/apiv1"
	recaptchapb "cloud.google.com/go/recaptchaenterprise/v2/apiv1/recaptchaenterprisepb"
	"context"
	"fmt"
)

type Recaptcha struct {
	client *recaptcha.Client
	cfg    *Config
}

func New(client *recaptcha.Client, config *Config) *Recaptcha {
	return &Recaptcha{
		client: client,
		cfg:    config,
	}
}

func (r *Recaptcha) Verify(ctx context.Context, token, ip, userAgent string) (bool, error) {
	event := &recaptchapb.Event{
		Token:         token,
		SiteKey:       r.cfg.SiteKey,
		UserAgent:     userAgent,
		UserIpAddress: ip,
	}

	assessment := &recaptchapb.Assessment{
		Event: event,
	}

	request := &recaptchapb.CreateAssessmentRequest{
		Assessment: assessment,
		Parent:     fmt.Sprintf("projects/%s", r.cfg.ProjectID),
	}

	response, err := r.client.CreateAssessment(ctx, request)

	if err != nil {
		return false, err
	}

	if response.TokenProperties.Valid == false {
		return false, nil
	}

	if response.TokenProperties.Action != r.cfg.ExpectedAction {
		return false, nil
	}

	return response.RiskAnalysis.Score > r.cfg.Threshold, nil

}
