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
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"github.com/osamashannak/uaeu-space/services/pkg/subnetchecker"
	"github.com/osamashannak/uaeu-space/services/pkg/utils"
	"io"
	"net/http"
	"strconv"
)

func (s *Server) PostReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		logger.Debugf("received request to post review")

		profile, ok := ctx.Value("profile").(*middleware.Profile)

		if !ok {
			logger.Debugf("profile not found in context, session missing")
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
			logger.Debugf("failed to unmarshal request: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: err.Error(),
				Error:   code,
			}
			jsonutil.MarshalResponse(w, code, errorResponse)
			return
		}

		assessment := s.recaptcha.Verify(ctx, *request.RecaptchaToken, r.RemoteAddr, r.UserAgent())

		if !assessment {
			logger.Errorf("recaptcha verification failed: %v", assessment)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred. please try again later.",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		professor, err := s.db.GetProfessor(ctx, *request.ProfessorEmail)

		if err != nil {
			logger.Errorf("failed to get professor: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if professor == nil {
			logger.Debugf("professor not found: %s", *request.ProfessorEmail)
			errorResponse := v1.ErrorResponse{
				Message: "professor not found",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		existingReview, err := s.db.ExistsReviewSession(ctx, *request.ProfessorEmail, profile.SessionId)

		if err != nil {
			logger.Errorf("failed to check existing review: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if existingReview {
			logger.Debugf("user has already reviewed this professor: %s", *request.ProfessorEmail)
			errorResponse := v1.ErrorResponse{
				Message: "you have already reviewed this professor",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		if *request.Score < 1 || *request.Score > 5 {
			logger.Debugf("invalid score: %d", request.Score)
			errorResponse := v1.ErrorResponse{
				Message: "score must be between 1 and 5",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		request.Text = utils.ReviewTextCleaner(request.Text)

		var attachmentInfo *v1.ReviewAttachment

		if request.Attachment != nil {
			attachment, err := s.db.GetReviewAttachment(ctx, *request.Attachment)

			if err != nil || attachment == nil {
				logger.Debugf("failed to get review attachment: %v", err)
			} else {
				logger.Debugf("review attachment: %v", attachment)
				attachmentInfo = &v1.ReviewAttachment{
					ID:     attachment.ID,
					Height: attachment.Height,
					Width:  attachment.Width,
					URL:    attachment.URL,
				}
			}
		}

		if request.Text == "" && attachmentInfo == nil {
			logger.Debugf("review text is empty")
			errorResponse := v1.ErrorResponse{
				Message: "review cannot be empty",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		flags := s.perspective.Analyze(request.Text)

		logger.Debugf("perspective analysis result: %+v", flags)

		review := model.Review{
			ID:             int64(s.generator.Next()),
			Score:          *request.Score,
			Positive:       *request.Positive,
			Content:        request.Text,
			ProfessorEmail: *request.ProfessorEmail,
			UaeuOrigin:     subnetchecker.CheckIP(r.RemoteAddr),
			Visible:        !flags.Flagged(),
			Language:       flags.Language,
			IpAddress:      r.RemoteAddr,
			SessionId:      &profile.SessionId,
		}

		if attachmentInfo != nil {
			review.Attachment = &attachmentInfo.ID
		} else {
			review.Attachment = nil
		}

		err = s.db.InsertReview(ctx, &review)

		if err != nil {
			logger.Errorf("failed to insert review: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		go func(reviewId int64, result *perspective.AnalysisResult) {
			bgCtx := context.Background()

			if err := s.db.InsertReviewFlags(bgCtx, reviewId, result); err != nil {
				logger.Errorf("failed to insert review flags: %v", err)
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
			Flagged:    flagged,
		}

		logger.Debugf("review posted successfully: %+v", response)

		jsonutil.MarshalResponse(w, http.StatusCreated, response)

	})
}

func (s *Server) DeleteReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		profile, ok := ctx.Value("profile").(*middleware.Profile)

		if !ok {
			errorResponse := v1.ErrorResponse{
				Message: "session missing",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		reviewIdStr := r.URL.Query().Get("reviewId")

		if reviewIdStr == "" {
			errorResponse := v1.ErrorResponse{
				Message: "missing reviewId parameter",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		reviewId, err := strconv.ParseInt(reviewIdStr, 10, 64)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "invalid reviewId format",
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
			logger.Errorf("failed to delete review: %v", err)
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

		logger := logging.FromContext(ctx)

		reviewIdStr := r.URL.Query().Get("reviewId")

		logger.Debugf("received request to translate review with ID: %s", reviewIdStr)

		if reviewIdStr == "" {
			logger.Debugf("missing reviewId parameter")
			errorResponse := v1.ErrorResponse{
				Message: "missing reviewId parameter",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		reviewId, err := strconv.ParseInt(reviewIdStr, 10, 64)

		if err != nil {
			errorResponse := v1.ErrorResponse{
				Message: "invalid reviewId format",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		review, err := s.db.GetReview(ctx, reviewId)

		if err != nil {
			logger.Errorf("failed to get review: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to get review",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if review == nil {
			logger.Debugf("review not found: %d", reviewId)
			errorResponse := v1.ErrorResponse{
				Message: "review not found",
				Error:   http.StatusNotFound,
			}
			jsonutil.MarshalResponse(w, http.StatusNotFound, errorResponse)
			return
		}

		translation, err := s.db.GetTranslatedReview(ctx, reviewId)

		if err != nil {
			logger.Errorf("failed to get translation: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if translation != nil {
			logger.Debugf("translation found for review ID: %d", reviewId)
			jsonutil.MarshalResponse(w, http.StatusOK, &v1.ReviewTranslationResponse{
				Content: translation.TranslatedText,
				Target:  translation.Target,
			})
			return
		}

		if review.Language == "en" {
			logger.Debugf("review is already in English, no translation needed")
			errorResponse := v1.ErrorResponse{
				Message: "review is already in English, no translation needed",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		translatedText, err := s.translate.TranslateToEnglish(ctx, review.Content)

		if err != nil {
			logger.Errorf("failed to translate review: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to translate review",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		err = s.db.InsertReviewTranslation(ctx, &model.ReviewTranslation{
			ReviewId:       review.ID,
			TranslatedText: translatedText,
			Target:         "en",
		})

		if err != nil {
			logger.Errorf("failed to insert translation: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "failed to insert translation",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		logger.Debugf("translation inserted successfully for review ID: %d", reviewId)

		jsonutil.MarshalResponse(w, http.StatusOK, &v1.ReviewTranslationResponse{
			Content: translatedText,
			Target:  "en",
		})

	})
}

func (s *Server) UploadReviewAttachment() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		const maxUploadSize = 32 << 20 // 32 megabytes

		r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
		ctx := r.Context()
		logger := logging.FromContext(ctx)

		logger.Debugf("received request to upload review attachment")

		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			var maxBytesErr *http.MaxBytesError
			if errors.As(err, &maxBytesErr) {
				logger.Debugf("file size exceeds limit: %v", err)
				errorResponse := v1.ErrorResponse{
					Message: fmt.Sprintf("file size cannot exceed %d MB", maxUploadSize>>20),
					Error:   http.StatusRequestEntityTooLarge,
				}
				jsonutil.MarshalResponse(w, http.StatusRequestEntityTooLarge, errorResponse)
			} else {
				logger.Errorf("failed to parse multipart form: %v", err)
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
			logger.Debugf("failed to get 'file' from form: %v", err)
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
			logger.Errorf("failed to read file content: %v", err)
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
			logger.Debugf("invalid file type: %s", contentType)
			errorResponse := v1.ErrorResponse{
				Message: fmt.Sprintf("invalid file type '%s'. only jpeg, png, and gif are allowed", contentType),
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		fileBytes, contentType, imageBounds, err := utils.ProcessImageFile(fileBytes, contentType)
		if err != nil {
			logger.Errorf("failed to process image file: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error occurred. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}
		attachmentId := int64(s.generator.Next())
		finalBlobName := fmt.Sprintf("%d%s", attachmentId, extension)

		err = s.storage.CreateObject(ctx, finalBlobName, contentType, "public, max-age=604800", fileBytes)
		if err != nil {
			logger.Errorf("failed to save file to storage: %v", err)
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
			logger.Errorf("failed to insert review attachment: %v", err)
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

		logger.Debugf("review attachment uploaded successfully: %+v", response)

		jsonutil.MarshalResponse(w, http.StatusCreated, response)

	})
}

func (s *Server) AddReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		logger.Debugf("received request to add review rating")

		profile, ok := ctx.Value("profile").(*middleware.Profile)

		if !ok {
			logger.Debugf("profile not found in context, session missing")
			errorResponse := v1.ErrorResponse{
				Message: "session missing",
				Error:   http.StatusUnauthorized,
			}
			jsonutil.MarshalResponse(w, http.StatusUnauthorized, errorResponse)
			return
		}

		var request v1.ReviewRatingBody
		code, err := jsonutil.Unmarshal(w, r, &request)

		if err != nil {
			logger.Errorf("failed to unmarshal request: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: err.Error(),
				Error:   code,
			}
			jsonutil.MarshalResponse(w, code, errorResponse)
			return
		}

		review, err := s.db.GetReview(ctx, request.ReviewID)

		if err != nil {
			logger.Errorf("failed to get review: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred from our end. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if review == nil {
			logger.Debugf("review not found: %d", request.ReviewID)
			errorResponse := v1.ErrorResponse{
				Message: "review not found",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		existingRating, err := s.db.ExistsReviewRatingFromSession(ctx, request.ReviewID, profile.SessionId)

		if err != nil {
			logger.Errorf("failed to check existing rating: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred from our end. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if *existingRating {
			logger.Debugf("user has already rated this review: %d", request.ReviewID)
			errorResponse := v1.ErrorResponse{
				Message: "you have already rated this review",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		var value *bool

		if request.Rating == "like" {
			val := true
			value = &val
		} else if request.Rating == "dislike" {
			val := false
			value = &val
		} else {
			logger.Debugf("invalid rating: %s", request.Rating)
			errorResponse := v1.ErrorResponse{
				Message: "invalid rating, must be 'like' or 'dislike'",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		rating := model.ReviewRating{
			ReviewId:  request.ReviewID,
			SessionId: profile.SessionId,
			Value:     *value,
			IpAddress: r.RemoteAddr,
		}

		err = s.db.InsertReviewRating(ctx, &rating)

		if err != nil {
			logger.Errorf("failed to insert review rating: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred from our end. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		logger.Debugf("review rating added successfully for review ID: %d", request.ReviewID)

		jsonutil.MarshalResponse(w, http.StatusCreated, v1.SuccessResponse{
			Success: ok,
			Message: fmt.Sprintf("review %d rated successfully", request.ReviewID),
		})

	})
}

func (s *Server) DeleteReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		logger := logging.FromContext(ctx)

		logger.Debugf("received request to delete review rating")

		profile, ok := ctx.Value("profile").(*middleware.Profile)

		if !ok {
			logger.Debugf("profile not found in context, session missing")
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

		reviewIdInt, err := strconv.ParseInt(reviewId, 10, 64)

		if err != nil {
			logger.Errorf("failed to parse reviewId: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "invalid reviewId format",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		existingRating, err := s.db.ExistsReviewRatingFromSession(ctx, reviewIdInt, profile.SessionId)

		if err != nil {
			logger.Errorf("failed to check existing rating: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred from our end. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		if !*existingRating {
			logger.Debugf("user has not rated this review: %s", reviewId)
			errorResponse := v1.ErrorResponse{
				Message: "you have not rated this review",
				Error:   http.StatusBadRequest,
			}
			jsonutil.MarshalResponse(w, http.StatusBadRequest, errorResponse)
			return
		}

		err = s.db.DeleteReviewRating(ctx, reviewIdInt, profile.SessionId)

		if err != nil {
			logger.Errorf("failed to delete review rating: %v", err)
			errorResponse := v1.ErrorResponse{
				Message: "an error has occurred from our end. please try again later.",
				Error:   http.StatusInternalServerError,
			}
			jsonutil.MarshalResponse(w, http.StatusInternalServerError, errorResponse)
			return
		}

		logger.Debugf("review rating deleted successfully for review ID: %s", reviewId)

		jsonutil.MarshalResponse(w, http.StatusOK, v1.SuccessResponse{
			Success: true,
			Message: fmt.Sprintf("review %s rating deleted successfully", reviewId),
		})
	})
}
