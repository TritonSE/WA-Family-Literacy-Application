package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

//	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type AdminController struct {
    Admins database.AdminDatabase
}

func (c *AdminController) CreateAdmin(rw http.ResponseWriter, req *http.Request) {
    var admin models.Admin

    // Pull admin fields from request body
	if err := json.NewDecoder(req.Body).Decode(&admin); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		return
    }

    // Check firebase token
    uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

    // Check if admin - only admins can create admin accounts
    isAdmin, _, _, _, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if !isAdmin {
        writeResponse(rw, http.StatusForbidden, "do not have permission")
        return
    }

    // Check for duplicate admin id/email
    dupAdmin, err := c.Admins.FetchAdminByID(req.Context(), admin.ID);
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if dupAdmin != nil {
        writeResponse(rw, http.StatusBadRequest, "duplicate id")
        return
    }

    // Check for duplicate admin id/email
    dupAdmin, err = c.Admins.FetchAdminByEmail(req.Context(), admin.Email);
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if dupAdmin != nil {
        writeResponse(rw, http.StatusBadRequest, "duplicate email")
        return
    }

    // Create new admin in database
    c.Admins.CreateAdmin(req.Context(), admin)
}

func (c *AdminController) GetAdmin(rw http.ResponseWriter, req *http.Request) {


}
