package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type AdminController struct {
    Admins database.AdminDatabase
}

// Create admin account, if request is from another admin account
func (c *AdminController) CreateAdmin(rw http.ResponseWriter, req *http.Request) {
    var admin models.Admin

    // Pull admin fields from request body
	if err := json.NewDecoder(req.Body).Decode(&admin); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		return
    }

    // Check auth token
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
    err = c.Admins.CreateAdmin(req.Context(), admin)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }

    writeResponse(rw, http.StatusOK, "created")
}

// Get list of admins - anyone can request
func (c *AdminController) GetAdminList(rw http.ResponseWriter, req *http.Request) {
	admins, err := c.Admins.FetchAdmins(req.Context())
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, admins)
}

// Get info for one specific admin by ID
func (c * AdminController) GetAdminByID(rw http.ResponseWriter, req *http.Request) {
    var adminID string = chi.URLParam(req, "id")

    // Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

    // Check if admin
    isAdmin, _, _, _, err :=
        c.Admins.FetchAdminPermissions(req.Context(), uid)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if !isAdmin {
        writeResponse(rw, http.StatusForbidden, "do not have permission")
        return
    }

    // Fetch admin
    admin, err := c.Admins.FetchAdminByID(req.Context(), adminID);
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if admin == nil {
        writeResponse(rw, http.StatusNotFound, "admin not found")
        return
    }

	writeResponse(rw, http.StatusOK, admin)
}

func (c *AdminController) UpdateAdmin(rw http.ResponseWriter, req *http.Request) {
    var adminID string = chi.URLParam(req, "id")
    var uadmin models.UpdateAdmin

    // Pull admin fields from request body
	if err := json.NewDecoder(req.Body).Decode(&uadmin); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		return
    }

    // Check auth token
    uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

    // Check if admin
    isAdmin, _, _, _, err :=
        c.Admins.FetchAdminPermissions(req.Context(), uid)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if !isAdmin {
        writeResponse(rw, http.StatusForbidden, "do not have permission")
        return
    }

    // Check if admin to update exists, and if it is the primary admin
    admin, err := c.Admins.FetchAdminByID(req.Context(), adminID);
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if admin == nil {
        writeResponse(rw, http.StatusNotFound, "admin not found")
        return
    }
    if admin.IsPrimaryAdmin {
        writeResponse(rw, http.StatusForbidden, "cannot update primary admin")
        return
    }

    // Carry out update
    err = c.Admins.UpdateAdmin(req.Context(), adminID, uadmin)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
            fmt.Println(err)
            return
    }

    writeResponse(rw, http.StatusOK, "updated")
}

// Delete and admin by ID, if request is from admin
func (c *AdminController) DeleteAdmin(rw http.ResponseWriter, req *http.Request) {
	var adminID string = chi.URLParam(req, "id")

    // Check auth token
    uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

    // Check if admin
    isAdmin, _, _, _, err :=
        c.Admins.FetchAdminPermissions(req.Context(), uid)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if !isAdmin {
        writeResponse(rw, http.StatusForbidden, "do not have permission")
        return
    }

    // Check if admin to delete exists, and if it is the primary admin
    admin, err := c.Admins.FetchAdminByID(req.Context(), adminID);
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
        return
    }
    if admin == nil {
        writeResponse(rw, http.StatusNotFound, "admin not found")
        return
    }
    if admin.IsPrimaryAdmin {
        writeResponse(rw, http.StatusForbidden, "cannot delete primary admin")
        return
    }

    // Delete the admin
    if err = c.Admins.RemoveAdmin(req.Context(), adminID); err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        fmt.Println(err)
    }

    writeResponse(rw, http.StatusOK, "deleted")
}
