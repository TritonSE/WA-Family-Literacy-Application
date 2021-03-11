package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

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
