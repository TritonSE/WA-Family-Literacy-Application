package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/TritonSE/words-alive/internal/auth"
)

// HTTP middleware that validates the Authorization header against the provided authenticator
func RequireAuth(authenticator auth.Authenticator) func(http.Handler) http.Handler {

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
			// verify the token of the user
			authHeader := req.Header.Get("Authorization")
			if authHeader == "" {
				writeResponse(rw, http.StatusUnauthorized, "User needs to be authenticated")
				return
			}

			if !strings.HasPrefix(authHeader, "Bearer ") {
				writeResponse(rw, http.StatusUnauthorized, "User needs to provide Bearer token")
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			uid, ok := authenticator.VerifyToken(req.Context(), tokenString)
			if !ok {
				writeResponse(rw, http.StatusForbidden, "Token was invalid")
				return
			}
			ctx := context.WithValue(req.Context(), "user", uid)
			next.ServeHTTP(rw, req.WithContext(ctx))
		})
	}
}
