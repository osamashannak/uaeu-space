package professor

import (
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	model2 "github.com/osamashannak/uaeu-space/services/internal/authentication/model"
	"github.com/osamashannak/uaeu-space/services/internal/professor/model"
	"github.com/osamashannak/uaeu-space/services/pkg/jsonutil"
	"net/http"
	"strconv"
	"time"
)

func (s *Server) PostReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		session, ok := ctx.Value("session").(*model2.Session)

		if !ok {
			http.Error(w, "missing session", http.StatusUnauthorized)
			return
		}

		var request v1.ReviewPostBody
		code, err := jsonutil.Unmarshal(w, r, &request)

		if err != nil {
			http.Error(w, err.Error(), code)
			return
		}

		assessment := s.recaptcha.Verify(ctx, request.RecaptchaToken, r.RemoteAddr, r.UserAgent())

		if !assessment {
			http.Error(w, "recaptcha failed", http.StatusBadRequest)
			return
		}

		professor, err := s.db.GetProfessor(ctx, request.ProfessorEmail)

		if err != nil || professor == nil {
			http.Error(w, "professor not found", http.StatusBadRequest)
			return
		}

		review := model.Review{
			Id:             s.generator.Next(),
			Score:          request.Score,
			Positive:       request.Positive,
			Content:        request.Comment,
			ProfessorEmail: request.ProfessorEmail,
			Attachment:     request.Attachment,
			CreatedAt:      time.Now(),
			IpAddress:      r.RemoteAddr,
			SessionId:      &session.Id,
		}

		err = s.db.InsertReview(ctx, &review)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var response = v1.ReviewPostResponse{
			Comment:    review.Content,
			Score:      review.Score,
			Positive:   review.Positive,
			Attachment: review.Attachment,
			Id:         review.Id,
			CreatedAt:  review.CreatedAt,
		}

		jsonutil.MarshalResponse(w, http.StatusCreated, response)

	})
}

func (s *Server) DeleteReview() http.Handler {
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

		// todo check if the user is the owner of the review

		err = s.db.DeleteReview(ctx, reviewId)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

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

		id, err := strconv.ParseUint(reviewId, 10, 64)

		if err != nil {
			http.Error(w, "invalid reviewId parameter", http.StatusBadRequest)
			return
		}

		review, err := s.db.GetReview(ctx, id)

		if err != nil || review == nil {
			http.Error(w, "review not found", http.StatusBadRequest)
			return
		}

	})
}

func (s *Server) UploadReviewAttachment() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

	})
}

func (s *Server) AddReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}

func (s *Server) DeleteReviewRating() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}
