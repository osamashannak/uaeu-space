package professor

import (
	"context"
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	model2 "github.com/osamashannak/uaeu-space/services/internal/authentication/model"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
	"github.com/osamashannak/uaeu-space/services/pkg/google/perspective"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"github.com/osamashannak/uaeu-space/services/pkg/subnetchecker"
	"net/http"
	"time"
)

func (s *Server) PostReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		session, ok := ctx.Value("session").(*model2.Session)

		if !ok {
			errorResponse := v1.ErrorResponse{
				Message: "session missing",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		var request v1.ReviewPostBody
		code, err := jsonutil.Unmarshal(w, r, &request)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: err.Error(),
				Error:   code,
			}
			jsonutil.MarshalResponse(w, code, errorResponse)
			return
		}

		assessment := s.recaptcha.Verify(ctx, request.RecaptchaToken, r.RemoteAddr, r.UserAgent())

		if !assessment {
			errorResponse := v1.ErrorResponse{
				Message: "recaptcha verification failed",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		professor, err := s.db.GetProfessor(ctx, request.ProfessorEmail)

		if err != nil || professor == nil {
			errorResponse := v1.ErrorResponse{
				Message: "professor not found",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		if request.Score < 1 || request.Score > 5 {
			errorResponse := v1.ErrorResponse{
				Message: "score must be between 1 and 5",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		if len(request.Comment) > 350 {
			request.Comment = request.Comment[:350]
		}

		flags := s.perspective.Analyze(request.Comment)

		review := model.Review{
			ID:             s.generator.Next(),
			Score:          request.Score,
			Positive:       request.Positive,
			Content:        request.Comment,
			ProfessorEmail: request.ProfessorEmail,
			Attachment:     request.Attachment,
			UaeuOrigin:     subnetchecker.CheckIP(r.RemoteAddr),
			Visible:        flags.Flagged(),
			Language:       flags.Language,
			CreatedAt:      time.Now(),
			IpAddress:      r.RemoteAddr,
			SessionId:      &session.Id,
		}

		err = s.db.InsertReview(ctx, &review)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		go func(reviewId uint64, result *perspective.AnalysisResult) {
			bgCtx := context.Background()

			if err := s.db.InsertReviewFlags(bgCtx, reviewId, result); err != nil {
				fmt.Printf("failed to insert comment flags: %v\n", err)
			}
		}(review.ID, flags)

		var flagged *bool
		if !review.Visible {
			val := true
			flagged = &val
		}

		var response = v1.ReviewPostResponse{
			Comment:    review.Content,
			Score:      review.Score,
			Positive:   review.Positive,
			Attachment: review.Attachment,
			ID:         review.ID,
			CreatedAt:  review.CreatedAt,
			Flagged:    flagged,
		}

		jsonutil.MarshalResponse(w, http.StatusCreated, response)

	})
}

func (s *Server) DeleteReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		session, ok := ctx.Value("session").(*model2.Session)

		if !ok {
			errorResponse := v1.ErrorResponse{
				Message: "session missing",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		reviewId := r.URL.Query().Get("reviewId")

		if reviewId == "" {
			errorResponse := v1.ErrorResponse{
				Message: "missing reviewId parameter",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		review, err := s.db.GetReview(ctx, reviewId)

		if err != nil || review == nil {
			errorResponse := v1.ErrorResponse{
				Message: "review not found",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		if review.SessionId == nil || *review.SessionId != session.Id {
			errorResponse := v1.ErrorResponse{
				Message: "you are not allowed to delete this review",
				Error:   http.StatusForbidden,
			}
			jsonutil.MarshalResponse(w, http.StatusForbidden, errorResponse)
			return
		}

		err = s.db.SoftDeleteReview(ctx, reviewId)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "failed to delete review",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		jsonutil.MarshalResponse(w, http.StatusOK, v1.SuccessResponse{
			Message: "review deleted successfully",
			Success: true,
		})

	})
}

func (s *Server) TranslateReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		reviewId := r.URL.Query().Get("reviewId")

		if reviewId == "" {
			http.Error(w, "missing reviewId parameter", http.StatusBadRequest)
			return
		}

		review, err := s.db.GetReview(ctx, reviewId)

		if err != nil || review == nil {
			http.Error(w, "review not found", http.StatusBadRequest)
			return
		}

		translation, err := s.db.GetTranslatedReview(ctx, reviewId)

		if err != nil {
			http.Error(w, "failed to get translation", http.StatusInternalServerError)
			return
		}

		if translation != nil {
			jsonutil.MarshalResponse(w, http.StatusOK, &v1.ReviewTranslationResponse{
				Content: translation.TranslatedText,
				Target:  translation.Target,
			})
			return
		}

		if review.Language == "en" {
			jsonutil.MarshalResponse(w, http.StatusOK, &v1.ReviewTranslationResponse{
				Content: review.Content,
				Target:  review.Language,
			})
			return
		}

		translatedText, err := s.translate.TranslateToEnglish(ctx, review.Content)

		if err != nil {
			http.Error(w, "failed to translate review", http.StatusInternalServerError)
			return
		}

		err = s.db.InsertReviewTranslation(ctx, &model.ReviewTranslation{
			ReviewId:       review.ID,
			TranslatedText: translatedText,
			Target:         review.Language,
		})

		if err != nil {
			http.Error(w, "failed to insert translation", http.StatusInternalServerError)
			return
		}

		jsonutil.MarshalResponse(w, http.StatusOK, &v1.ReviewTranslationResponse{
			Content: translatedText,
			Target:  review.Language,
		})

	})
}

func (s *Server) UploadReviewAttachment() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
}

func (s *Server) AddReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	})
}

func (s *Server) DeleteReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	})
}
