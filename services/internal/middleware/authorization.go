package middleware

import "net/http"

func Authorization(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// get the token from the request cookie
		token, err := r.Cookie("gid")

		if err != nil {
			http.Error(w, "You are not authorized.", http.StatusUnauthorized)
			return
		}

		// make a get request to the auth service to validate the token

		// validate the token

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
