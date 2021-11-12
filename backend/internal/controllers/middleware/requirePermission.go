package middleware

import (
	"log"
	"net/http"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

// HTTP middleware that validates the Authorization header against the provided authenticator
func RequirePermission(adminDB database.AdminDatabase, p models.Permission) func(http.Handler) http.Handler {

	// Check if permission enum is valid
	switch p {
	case models.CanManageUsers, models.CanUploadBooks, models.CanEditBooks,
		models.CanDeleteBooks, models.CanAccessAnalytics, models.CanChat:
	default:
		panic("Invalid permission enum")
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {

			// Get UID from context
			uid, ok := req.Context().Value("user").(string)
			if !ok {
				writeResponse(rw, http.StatusInternalServerError, "error")
				log.Println("unable to get user from request context")
				return
			}

			// Query database for permissions
			perms, err := adminDB.FetchAdminPermissions(req.Context(), uid)
			if err != nil {
				writeResponse(rw, http.StatusInternalServerError, "error")
				log.Println(err)
				return
			}

			var permitted bool = false

			switch p {
			case models.CanManageUsers:
				permitted = perms.CanManageUsers
			case models.CanUploadBooks:
				permitted = perms.CanUploadBooks
			case models.CanEditBooks:
				permitted = perms.CanEditBooks
			case models.CanDeleteBooks:
				permitted = perms.CanDeleteBooks
			case models.CanAccessAnalytics:
				permitted = perms.CanAccessAnalytics
			case models.CanChat:
				permitted = perms.CanChat
			}

			// Check selected permission
			if !permitted {
				writeResponse(rw, http.StatusForbidden, "do not have permission")
				return
			}

			next.ServeHTTP(rw, req)
		})
	}
}
