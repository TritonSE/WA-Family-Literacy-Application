package controllers_test

import (
	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
	"github.com/stretchr/testify/require"
	"net/http"
	"testing"
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

func TestUpdateUser(t *testing.T) {
	// valid token test
	body := `{"id": "user1", "name": "roberto", "email": "test5@test.com", "in_san_diego": false}`
	var response1 string
    var response2 models.User
	testutils.MakeAuthenticatedRequest("PUT", ts.URL+"/users/user1", body, http.StatusOK, &response1, "test-token-user1", t)
	// assertions with response here
    require.Equal(t, response1, "updated")
	testutils.MakeAuthenticatedRequest("GET", ts.URL+"/users/user1", "", http.StatusOK, &response2, "test-token-user1", t)
	require.Equal(t, response2.ID, "user1")
	require.Equal(t, response2.Name, "roberto")
	require.Equal(t, response2.Email, "test5@test.com")
	require.Equal(t, response2.InSanDiego, false)
}
