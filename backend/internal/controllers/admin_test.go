package controllers_test

import (
	"net/http"
	"testing"
    "fmt"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

// Test for status forbidden when not authenticated
func TestUserToken(t *testing.T) {
    fmt.Print("\n================ START ADMIN TESTS ================\n")
    fmt.Print("\n---------------- CREATE ADMIN TESTS ----------------\n")

	body := `{"email": "admin1@test.com", "name": "adam", 
    "can_manage_users": false, "can_upload_books": true, "can_delete_books" : true}`
	// not passing token
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/admins", body,
            http.StatusForbidden, nil, "test-token-user1")
}

// Test for successful creation of admin account
func TestPostAdmin(t *testing.T) {
    var response string

	body := `{"email": "admin1@test.com", "name": "adam", 
    "can_manage_users": false, "can_upload_books": true, "can_delete_books" : true}`
	// not passing token
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/admins", body,
            http.StatusOK, &response, "test-token-primary")

    require.Equal(t, "admin1", response)

	body = `{"email": "intern1@test.com", "name": "ian", 
    "can_manage_users": false, "can_upload_books": false, "can_delete_books" : false}`

	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/admins", body,
            http.StatusOK, &response, "test-token-primary")

    require.Equal(t, "intern1", response)
}

// Test list admins without auth
func TestListAdminsUnauthorized(t *testing.T) {
    fmt.Print("\n---------------- GET ADMIN TESTS ----------------\n")

	var response string
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins", "",
            http.StatusForbidden, &response, "test-token-user1")
}

// Test list admins with auth
func TestListAdmins(t *testing.T) {
	var response []models.Admin
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins", "",
            http.StatusOK, &response, "test-token-admin1")

    require.Equal(t, 3, len(response))
    require.Equal(t, "admin1", response[0].ID)
    require.Equal(t, "primary", response[1].ID)
    require.Equal(t, "intern1", response[2].ID)
}

// Test get admin by ID
func TestGetAdminByID(t *testing.T) {
    var response models.Admin
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins/primary", "",
            http.StatusOK, &response, "test-token-admin1")

    require.Equal(t, "primary", response.ID)

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins/primary", "",
            http.StatusOK, &response, "test-token-primary")

    require.Equal(t, "primary", response.ID)
}

// Test post request without auth
func TestUpdateAdminUnauthorized(t *testing.T) {
    fmt.Print("\n---------------- UPDATE ADMIN TESTS ----------------\n")
    var response string

	body := `{"name": "eve", "can_manage_users": true, 
    "can_upload_books": true, "can_delete_books" : true}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/admins/admin1", body,
            http.StatusForbidden, &response, "test-token-user1")

    require.Equal(t, "do not have permission", response)
}

// Test post request on primary admin
func TestUpdateAdminPrimary(t *testing.T) {
    var response string

	body := `{"name": "eve", "can_manage_users": true, 
    "can_upload_books": true, "can_delete_books" : true}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/admins/primary", body,
            http.StatusForbidden, &response, "test-token-admin1")

    require.Equal(t, "cannot update primary admin", response)
}

// Test post request
func TestUpdateAdmin(t *testing.T) {
    var response models.Admin
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins/admin1", "",
            http.StatusOK, &response, "test-token-admin1")

    require.Equal(t, false, response.CanManageUsers)

	body := `{"can_manage_users": true}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/admins/admin1", body,
            http.StatusOK, nil, "test-token-admin1")

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins/admin1", "",
            http.StatusOK, &response, "test-token-admin1")

    require.Equal(t, true, response.CanManageUsers)
}

// Test delete request unauthorized
func TestDeleteAdminUnauthorized(t *testing.T) {
    fmt.Print("\n---------------- DELETE ADMIN TESTS ----------------\n")

	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/admins/admin1", "",
            http.StatusForbidden, nil, "test-token-user1")
}

// Test delete request
func TestDeleteAdmin(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/admins/admin1", "",
            http.StatusOK, nil, "test-token-primary")

    var response string
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/admins/admin1", "",
            http.StatusNotFound, &response, "test-token-primary")
}
