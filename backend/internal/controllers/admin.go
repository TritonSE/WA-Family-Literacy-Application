package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type AdminController struct {
	Admins database.AdminDatabase
	Auth   auth.Authenticator
}

// Create admin account, if request is from another admin account
// Will write the admin id as a response
func (c *AdminController) CreateAdmin(rw http.ResponseWriter, req *http.Request) {
	var cadmin models.CreateAdmin
	var admin models.Admin

	// Pull CreateAdmin fields from request body
	if err := json.NewDecoder(req.Body).Decode(&cadmin); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		fmt.Println(err)
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

	// Check for duplicate admin email
	dupAdmin, err := c.Admins.FetchAdminByEmail(req.Context(), cadmin.Email)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if dupAdmin != nil {
		writeResponse(rw, http.StatusBadRequest, "duplicate email")
		return
	}

	// Generate ID for new admin account
	cuid, err := c.Auth.GenerateToken(req.Context(), cadmin.Email, cadmin.Password)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "could not generate token")
		fmt.Println(err)
		return
	}

	// Populate fields of admin account
	admin.ID = cuid
	admin.Name = cadmin.Name
	admin.Email = cadmin.Email
	admin.CanManageUsers = cadmin.CanManageUsers
	admin.CanUploadBooks = cadmin.CanUploadBooks
	admin.CanDeleteBooks = cadmin.CanDeleteBooks

	// Create new admin in database
	err = c.Admins.CreateAdmin(req.Context(), admin)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}

	writeResponse(rw, http.StatusOK, cuid)
}

// Get list of admins
func (c *AdminController) GetAdminList(rw http.ResponseWriter, req *http.Request) {
	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
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

	admins, err := c.Admins.FetchAdmins(req.Context())
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, admins)
}

// Get info for one specific admin by ID
func (c *AdminController) GetAdminByID(rw http.ResponseWriter, req *http.Request) {
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
	admin, err := c.Admins.FetchAdminByID(req.Context(), adminID)
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

// Update admin name/permissions
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
	admin, err := c.Admins.FetchAdminByID(req.Context(), adminID)
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
	admin, err := c.Admins.FetchAdminByID(req.Context(), adminID)
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
