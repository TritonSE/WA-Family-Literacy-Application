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

	// Check Permission
	manageUser, ok := req.Context().Value("permission").(bool)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if !manageUser {
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

	// Check for conflicting fields
	// Do not allow edit/delete book to be set without permission to upload books
	if !cadmin.CanUploadBooks && (cadmin.CanEditBooks || cadmin.CanDeleteBooks) {
		writeResponse(rw, http.StatusBadRequest, "must be able to upload to edit/delete books")
		return
	}

	// Generate ID for new admin account
	cuid, err := c.Auth.CreateUser(req.Context(), cadmin.Email, cadmin.Password)
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
	admin.CanEditBooks = cadmin.CanEditBooks
	admin.CanDeleteBooks = cadmin.CanDeleteBooks

	// Create new admin in database
	err = c.Admins.CreateAdmin(req.Context(), admin)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}

	writeResponse(rw, http.StatusOK, admin)
}

// Get list of admins
func (c *AdminController) GetAdminList(rw http.ResponseWriter, req *http.Request) {
	// Check admin permissions
	manageUser, ok := req.Context().Value("permission").(bool)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if !manageUser {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	// Get list of admins from database
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

	// Check Permission
	manageUser, ok := req.Context().Value("permission").(bool)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if !manageUser {
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

	// Check Permission
	manageUser, ok := req.Context().Value("permission").(bool)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if !manageUser {
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

	// Check for conflicting fields
	var cub, ceb, cdb bool
	if uadmin.CanUploadBooks != nil {
		cub = *(uadmin.CanUploadBooks)
	} else {
		cub = admin.CanUploadBooks
	}
	if uadmin.CanEditBooks != nil {
		ceb = *(uadmin.CanEditBooks)
	} else {
		ceb = admin.CanEditBooks
	}
	if uadmin.CanDeleteBooks != nil {
		cdb = *(uadmin.CanDeleteBooks)
	} else {
		cdb = admin.CanDeleteBooks
	}

	if !cub && (ceb || cdb) {
		writeResponse(rw, http.StatusBadRequest, "must be able to upload to edit/delete books")
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

	// Check Permission
	manageUser, ok := req.Context().Value("permission").(bool)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if !manageUser {
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

	writeResponse(rw, http.StatusNoContent, "")
}
