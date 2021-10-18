package controllers_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

func TestNoToken(t *testing.T) {
	fmt.Print("\n================ START USER TESTS ================\n")
	fmt.Print("\n---------------- AUTH USER TESTS ----------------\n")
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	// not passing token
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/users", body, http.StatusUnauthorized, nil, "")
}

func TestInvalidToken(t *testing.T) {
	// passing invalid token
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/users", body, http.StatusForbidden, nil, "invalid-test-token")
}

func TestCreateUser(t *testing.T) {
	fmt.Print("\n---------------- CREATE USER TESTS ----------------\n")
	// valid token test
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	var response models.User
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/users", body, http.StatusCreated, &response, "test-token-user1")
	// assertions with response here
	require.Equal(t, response.ID, "user1")
	require.Equal(t, response.Name, "robert")
	require.Equal(t, response.Email, "test4@test.com")
	require.Equal(t, response.InSanDiego, true)
}

func TestCreateDuplicateUser(t *testing.T) {
	// same information as TestCreateUser, should fail
	body := `{"id": "user1", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	var response string
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/users", body, http.StatusBadRequest, &response, "test-token-user1")
	require.Equal(t, response, "user with ID already exists")
}

func TestCreateDuplicateEmailUser(t *testing.T) {
	// same email as TestCreateUser, should fail
	body := `{"id": "user2", "name": "robert", "email": "test4@test.com", "in_san_diego": true}`
	var response string
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/users", body, http.StatusBadRequest, &response, "test-token-user2")
	require.Equal(t, response, "user with email already exists")
}

func TestGetUser(t *testing.T) {
	fmt.Print("\n---------------- GET USER TESTS ----------------\n")
	var response models.User
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user1", "", http.StatusOK, &response, "test-token-user1")
	// assertions with response here
	require.Equal(t, response.ID, "user1")
	require.Equal(t, response.Name, "robert")
	require.Equal(t, response.Email, "test4@test.com")
	require.Equal(t, response.InSanDiego, true)
}

func TestGetUserNotFound(t *testing.T) {
	var response string
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user2", "", http.StatusNotFound, &response, "test-token-user2")
	require.Equal(t, response, "user does not exist")
}

func TestGetUserUnAuth(t *testing.T) {
	var response string
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user1", "", http.StatusForbidden, &response, "test-token-user2")
}

func TestUpdateUser(t *testing.T) {
	fmt.Print("\n---------------- UPDATE USER TESTS ----------------\n")
	// valid token test
	body := `{"name": "roberto", "in_san_diego": false}`
	var response1 string
	var response2 models.User
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/users/user1", body, http.StatusOK, &response1, "test-token-user1")
	// assertions with response here
	require.Equal(t, response1, "updated")
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user1", "", http.StatusOK, &response2, "test-token-user1")
	require.Equal(t, response2.ID, "user1")
	require.Equal(t, response2.Name, "roberto")
	require.Equal(t, response2.Email, "test4@test.com")
	require.Equal(t, response2.InSanDiego, false)
}

func TestUpdateUserNotFound(t *testing.T) {
	body := `{"name": "robert", "in_san_diego": false}`
	var response string
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/users/user2", body, http.StatusNotFound, &response, "test-token-user2")
	require.Equal(t, response, "user not found")
}

func TestUpdateUserPartialName(t *testing.T) {
	// valid token test
	body := `{"name": "new name"}`
	var response1 string
	var response2 models.User
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/users/user1", body, http.StatusOK, &response1, "test-token-user1")
	// assertions with response here
	require.Equal(t, response1, "updated")
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user1", "", http.StatusOK, &response2, "test-token-user1")
	require.Equal(t, response2.ID, "user1")
	require.Equal(t, response2.Name, "new name")
	require.Equal(t, response2.Email, "test4@test.com")
	require.Equal(t, response2.InSanDiego, false)
}

func TestUpdateUserPartialLocation(t *testing.T) {
	// valid token test
	body := `{"in_san_diego": true}`
	var response1 string
	var response2 models.User
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/users/user1", body, http.StatusOK, &response1, "test-token-user1")
	// assertions with response here
	require.Equal(t, response1, "updated")
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/users/user1", "", http.StatusOK, &response2, "test-token-user1")
	require.Equal(t, response2.ID, "user1")
	require.Equal(t, response2.Name, "new name")
	require.Equal(t, response2.Email, "test4@test.com")
	require.Equal(t, response2.InSanDiego, true)

	fmt.Print("\n================ END USER TESTS ================\n\n")
}
