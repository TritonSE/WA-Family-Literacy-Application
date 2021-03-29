package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type UserController struct {
	Users database.UserDatabase
}

/*
 * Handler parses body of request and ensures it is a valid request
 * Makes sure user id's match, user with this email doesn't already exist
 * creates the user in the backend
 */

func (c *UserController) CreateUser(rw http.ResponseWriter, req *http.Request) {
	var user models.User

	if err := json.NewDecoder(req.Body).Decode(&user); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		return
	}

	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}
	if uid != user.ID {
		writeResponse(rw, http.StatusForbidden, "Token does not match request body")
		return
	}

	duplicate, err := c.Users.FetchUserByEmail(req.Context(), user.Email)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}
	if duplicate != nil {
		// we have created a user with this email before
		writeResponse(rw, http.StatusBadRequest, "user with email already exists")
		return
	}

	id, err := c.Users.CreateUser(req.Context(), user)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}

	newUser, err := c.Users.FetchUserByID(req.Context(), id)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}

	writeResponse(rw, http.StatusCreated, newUser)
}

/*
 * Handles GET requests, requires {id}
 * Sends JSON object with all user data if request is authenticated
 */
func (c *UserController) GetUser(rw http.ResponseWriter, req *http.Request) {
	var userID string = chi.URLParam(req, "id")

	// Check for valid token
	uid, ok := req.Context().Value("user").(string)

	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	if uid != userID {
		writeResponse(rw, http.StatusForbidden, "Token does not match request")
		return
	}

	// Fetch user info
	user, err := c.Users.FetchUserByID(req.Context(), userID)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}

	// User not found
	if user == nil {
		writeResponse(rw, http.StatusNotFound, "user does not exist")
		return
	}

	writeResponse(rw, http.StatusOK, user)
}

/*
 * Handles PATCH request, requires {id}
 * Update fields of user info
 */
func (c *UserController) UpdateUser(rw http.ResponseWriter, req *http.Request) {
	var userID string = chi.URLParam(req, "id")

	var user models.UpdateUser

	// Read request body
	if err := json.NewDecoder(req.Body).Decode(&user); err != nil {
		writeResponse(rw, http.StatusBadRequest, "bad input!")
		return
	}

	// Pull user and validate token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	if uid != userID {
		writeResponse(rw, http.StatusForbidden, "Token does not match request body")
		return
	}

	// Check current user info
	currUser, err := c.Users.FetchUserByID(req.Context(), userID)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}
	if currUser == nil {
		writeResponse(rw, http.StatusNotFound, "user not found")
		return
	}
    /*
	// Illegal attempt to change email
	if user.Email != "" && user.Email != currUser.Email {
		writeResponse(rw, http.StatusBadRequest, "cannot change email")
		return
	}
    */

	// Carry out the update
	err = c.Users.UpdateUser(req.Context(), userID, user)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, "updated")
}
