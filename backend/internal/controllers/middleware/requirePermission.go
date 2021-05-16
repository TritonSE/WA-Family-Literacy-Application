package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

// HTTP middleware that validates the Authorization header against the provided authenticator
func RequirePermission(adminDB database.AdminDatabase, p models.Permission) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {

			// Get UID from context
			uid, ok := req.Context().Value("user").(string)
			if !ok {
				writeResponse(rw, http.StatusInternalServerError, "error")
				fmt.Println("unable to get user from request context")
				return
			}

			// Query database for permissions
			perms, err := adminDB.FetchAdminPermissions(req.Context(), uid)
			if err != nil {
				writeResponse(rw, http.StatusInternalServerError, "error")
				fmt.Println(err)
				return
			}

			var ctx context.Context

			switch p {
			case models.CanManageUsers:
				ctx = context.WithValue(req.Context(), "permission", perms.CanManageUsers)
			case models.CanUploadBooks:
				ctx = context.WithValue(req.Context(), "permission", perms.CanUploadBooks)
			case models.CanEditBooks:
				ctx = context.WithValue(req.Context(), "permission", perms.CanEditBooks)
			case models.CanDeleteBooks:
				ctx = context.WithValue(req.Context(), "permission", perms.CanDeleteBooks)
			default:
				writeResponse(rw, http.StatusInternalServerError, "invalid permission")
			}

			next.ServeHTTP(rw, req.WithContext(ctx))
		})
	}
}
