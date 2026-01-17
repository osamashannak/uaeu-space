package professor

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"net/http"
)

func (s *Server) RequestEmailVerification() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		var request v1.StudentVerifyRequest
		code, err := jsonutil.Unmarshal(w, r, &request)

		if err != nil {
			logger.Debugf("failed to unmarshal request: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: err.Error(),
				Error:   code,
			}
			jsonutil.MarshalResponse(w, code, errorResponse)
			return
		}

		otp, err := s.sesClient.GenerateOTP()
		if err != nil {
			logger.Error("failed to generate otp", "error", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to generate otp",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		err = s.sesClient.SendVerificationEmail(ctx, request.Email, otp)

		if err != nil {
			logger.Error("failed to send verification email", "error", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to send verification email",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		response := v1.SuccessResponse{
			Success: true,
			Message: "sent verification email",
		}

		jsonutil.MarshalResponse(w, http.StatusOK, response)

	})
}

func (s *Server) VerifyOTP() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		var request v1.StudentConfirmRequest
		code, err := jsonutil.Unmarshal(w, r, &request)

		if err != nil {
			logger.Debugf("failed to unmarshal request: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: err.Error(),
				Error:   code,
			}
			jsonutil.MarshalResponse(w, code, errorResponse)
			return
		}

	})
}
