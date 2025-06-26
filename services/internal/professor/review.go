package professor

import (
	"context"
	"errors"
	"fmt"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/middleware"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
	"github.com/osamashannak/uaeu-space/services/pkg/google/perspective"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"github.com/osamashannak/uaeu-space/services/pkg/subnetchecker"
	"github.com/osamashannak/uaeu-space/services/pkg/utils"
	"io"
	"net/http"
)

func (s *Server) PostReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		profile, ok := ctx.Value("profile").(*middleware.Profile)

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

		/*assessment := s.recaptcha.Verify(ctx, request.RecaptchaToken, r.RemoteAddr, r.UserAgent())

		if !assessment {
			errorResponse := v1.ErrorResponse{
				Message: "recaptcha verification failed",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}*/

		professor, err := s.db.GetProfessor(ctx, request.ProfessorEmail)

		if err != nil {
			fmt.Printf("failed to get professor: %v\n", err)
		}

		if professor == nil {
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

		if len(request.Text) > 350 {
			request.Text = request.Text[:350]
		}

		request.Text = utils.ReviewTextCleaner(request.Text)

		var attachmentInfo *v1.ReviewAttachment

		if request.Attachment != "" {
			attachment, err := s.db.GetReviewAttachment(ctx, request.Attachment)

			if err == nil {
				attachmentInfo = &v1.ReviewAttachment{
					ID:     attachment.ID,
					Height: attachment.Height,
					Width:  attachment.Width,
					URL:    attachment.URL,
				}
			}
		}

		if request.Text == "" && attachmentInfo == nil {
			errorResponse := v1.ErrorResponse{
				Message: "review cannot be empty",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		flags := s.perspective.Analyze(request.Text)

		review := model.Review{
			ID:             s.generator.Next(),
			Score:          request.Score,
			Positive:       request.Positive,
			Content:        request.Text,
			ProfessorEmail: request.ProfessorEmail,
			Attachment:     request.Attachment,
			UaeuOrigin:     subnetchecker.CheckIP(r.RemoteAddr),
			Visible:        !flags.Flagged(),
			Language:       flags.Language,
			IpAddress:      "192.168.1.1", // todo r.RemoteAddr
			SessionId:      &profile.SessionId,
		}

		err = s.db.InsertReview(ctx, &review)

		if err != nil {
			fmt.Printf("failed to insert review: %v\n", err)
			http.Error(w, "an error has occurred from our end. please try again later.", http.StatusInternalServerError)
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
			Attachment: attachmentInfo,
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

		profile, ok := ctx.Value("profile").(*middleware.Profile)

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

		if review.SessionId == nil || *review.SessionId != profile.SessionId {
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
		const maxUploadSize = 32 << 20 // 32 megabytes

		r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
		ctx := r.Context()

		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			var maxBytesErr *http.MaxBytesError
			if errors.As(err, &maxBytesErr) {
				errorResponse := v1.ErrorResponse{
					Message: fmt.Sprintf("file size cannot exceed %d MB", maxUploadSize>>20),
					Error:   http.StatusRequestEntityTooLarge,
				}
				jsonutil.MarshalResponse(w, http.StatusRequestEntityTooLarge, errorResponse)
			} else {
				errorResponse := v1.ErrorResponse{
					Message: "failed to parse multipart form",
					Error:   http.StatusBadRequest,
				}
				jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			}
			return
		}

		file, _, err := r.FormFile("file")
		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "failed to get 'file' from form",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}
		defer file.Close()

		fileBytes, err := io.ReadAll(file)
		if err != nil {
			fmt.Printf("failed to read file content: %v\n", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		contentType := http.DetectContentType(fileBytes)
		extension, ok := utils.GetValidExtension(contentType)

		if !ok {
			errorResponse := v1.ErrorResponse{
				Message: fmt.Sprintf("invalid file type '%s'. only jpeg, png, and gif are allowed", contentType),
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		fileBytes, contentType, imageBounds, err := utils.ProcessImageFile(fileBytes, contentType)
		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "an error occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}
		attachmentId := s.generator.Next()
		finalBlobName := fmt.Sprintf("%d%s", attachmentId, extension)

		err = s.storage.CreateObject(ctx, finalBlobName, contentType, "public, max-age=604800", fileBytes)
		if err != nil {
			fmt.Printf("failed to save file to storage: %v\n", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		safety, err := s.vision.AnalyzeImageSafety(utils.FormatBlobURL("attachments", finalBlobName, ""))

		attachment := model.ReviewAttachment{
			ID:       attachmentId,
			MimeType: contentType,
			Size:     len(fileBytes),
			Width:    imageBounds.Width,
			Height:   imageBounds.Height,
			Visible:  err == nil && safety.IsSafe(),
			URL:      utils.FormatBlobURL("attachments", finalBlobName, ""),
		}

		err = s.db.InsertReviewAttachment(ctx, &attachment)

		if err != nil {
			fmt.Printf("failed to insert review attachment: %v\n", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		response := v1.ReviewAttachmentResponse{
			ID: attachmentId,
		}

		jsonutil.MarshalResponse(w, http.StatusCreated, response)

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
