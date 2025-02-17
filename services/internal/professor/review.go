package professor

import "net/http"

func (s *Server) PostReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		reviewId := s.generator.Next()
	})
}

func (s *Server) DeleteReview() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
	})
}

func (s *Server) UploadReviewAttachment() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		reviewId := s.generator.Next()
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
