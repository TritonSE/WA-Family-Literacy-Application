package controllers_test

import (
	"net/http"
	"testing"
    "fmt"

	//"github.com/stretchr/testify/require"

	//"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

func TestUserToken(t *testing.T) {
    fmt.Print("\n================ START ADMIN TESTS ================\n")
    fmt.Print("\n---------------- POST ADMIN TESTS ----------------\n")

	body := `{"id": "admin1", "email": "admin1@test.com", "name": "adam", 
    "can_manage_users": true, "can_upload_books": true, "can_delete_books" : true}`
	// not passing token
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/admins", body,
            http.StatusForbidden, nil, "test-token-user1")
}

func TestPostAdmin(t *testing.T) {

	body := `{"id": "admin1", "email": "admin1@test.com", "name": "adam", 
    "can_manage_users": true, "can_upload_books": true, "can_delete_books" : true}`
	// not passing token
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/admins", body,
            http.StatusOK, nil, "test-token-primary")
}
