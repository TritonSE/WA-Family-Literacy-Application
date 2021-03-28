package controllers_test

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

func TestNoToken(t *testing.T) {
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	// not passing token
	testutils.MakeAuthenticatedRequest("POST", ts.URL+"/users", body, http.StatusUnauthorized, nil, "", t)
}

func TestInvalidToken(t *testing.T) {
	// passing invalid token
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	testutils.MakeAuthenticatedRequest("POST", ts.URL+"/users", body, http.StatusForbidden, nil, "invalid-test-token", t)
}

func TestCreateUser(t *testing.T) {
	// valid token test
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	var response models.User
	testutils.MakeAuthenticatedRequest("POST", ts.URL+"/users", body, http.StatusCreated, &response, "test-token-user1", t)
	// assertions with response here
	require.Equal(t, response.ID, "user1")
	require.Equal(t, response.Name, "robert")
	require.Equal(t, response.Email, "test4@test.com")
	require.Equal(t, response.InSanDiego, true)
}

func TestCreateDuplicateUser(t *testing.T) {
	// same information as above, should fail
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	var response string
	testutils.MakeAuthenticatedRequest("POST", ts.URL+"/users", body, http.StatusBadRequest, &response, "test-token-user1", t)
	require.Equal(t, response, "user with email already exists")
}

func TestGetUser(t *testing.T) {
	var response models.User
	testutils.MakeAuthenticatedRequest("GET", ts.URL+"/users/user1", "", http.StatusOK, &response, "test-token-user1", t)
	// assertions with response here
	require.Equal(t, response.ID, "user1")
	require.Equal(t, response.Name, "robert")
	require.Equal(t, response.Email, "test4@test.com")
	require.Equal(t, response.InSanDiego, true)
}

func TestGetUserNotFound(t *testing.T) {
	var response string
	testutils.MakeAuthenticatedRequest("GET", ts.URL+"/users/user2", "", http.StatusNotFound, &response, "test-token-user2", t)
	require.Equal(t, response, "user does not exist")
}

func TestGetUserUnAuth(t *testing.T) {
	var response string
	testutils.MakeAuthenticatedRequest("GET", ts.URL+"/users/user1", "", http.StatusForbidden, &response, "test-token-user2", t)
}

func TestUpdateUser(t *testing.T) {
	// valid token test
	body := `{"id": "user1", "name": "roberto", "email": "test4@test.com", "in_san_diego": false}`
	var response1 string
	var response2 models.User
	testutils.MakeAuthenticatedRequest("PATCH", ts.URL+"/users/user1", body, http.StatusOK, &response1, "test-token-user1", t)
	// assertions with response here
	require.Equal(t, response1, "updated")
	testutils.MakeAuthenticatedRequest("GET", ts.URL+"/users/user1", "", http.StatusOK, &response2, "test-token-user1", t)
	require.Equal(t, response2.ID, "user1")
	require.Equal(t, response2.Name, "roberto")
	require.Equal(t, response2.Email, "test4@test.com")
	require.Equal(t, response2.InSanDiego, false)
}

func TestUpdateUserNotFound(t *testing.T) {
	body := `{"id": "user2", "name": "robert", "email": "test4@test.com", "in_san_diego": false}`
	var response string
	testutils.MakeAuthenticatedRequest("PATCH", ts.URL+"/users/user2", body, http.StatusNotFound, &response, "test-token-user2", t)
	require.Equal(t, response, "user not found")
}

func TestUpdateUserEmail(t *testing.T) {
	body := `{"id": "user1", "name": "robert", "email": "test5@test.com", "in_san_diego": false}`
	var response string
	testutils.MakeAuthenticatedRequest("PATCH", ts.URL+"/users/user1", body, http.StatusBadRequest, &response, "test-token-user1", t)
	require.Equal(t, response, "cannot change email")
}
