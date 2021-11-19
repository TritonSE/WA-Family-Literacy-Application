package controllers_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

// Test for the book list function
func TestGetBooks(t *testing.T) {
	fmt.Print("\n================ START BOOK TESTS ================\n")

	fmt.Print("\n---------------- GET BOOK TESTS ----------------\n")
	var response []models.Book
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books", "", 200, &response)

	// Check for correct number of elements, and sort alphabetically
	require.Len(t, response, 5)
	require.Equal(t, "a", response[0].Title)
	require.Equal(t, "b", response[1].Title)
	require.Equal(t, "c", response[2].Title)

}

// Test for popular books list
func TestGetPopularBooks(t *testing.T) {
	var response []models.Book
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/popular", "", 200, &response)

	// Check for correct number of elements and sorting by popularity
	require.Len(t, response, 5)
	require.Equal(t, "a", response[0].Title)
	require.Equal(t, "c", response[1].Title)
	require.Equal(t, "catcher in the rye", response[2].Title)
}

func TestGetBook(t *testing.T) {
	var response models.Book
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/catcher", "", 200, &response)

	require.Equal(t, "catcher in the rye", response.Title)
}

func TestGetBookDoesNotExist(t *testing.T) {
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/does_not_exist", "", 404, nil)
}

// Test for the book details function
func TestGetBookDetails(t *testing.T) {
	var response models.BookDetails
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/catcher/en", "", 200, &response)

	// Check title and content
	require.Equal(t, "catcher in the rye", response.Title)
	require.Equal(t, "catcher_rb", response.Read.Body)
}

// Test for non-existent language
func TestGetBookNullLang(t *testing.T) {
	var response string
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/catcher/fr", "", 404, &response)

	require.Equal(t, "book does not exist in specified language", response)
}

// Test for non-existent book
func TestGetNullBook(t *testing.T) {
	var response string
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/nonexistent/en", "", 404, &response)

	require.Equal(t, "book not found", response)
}

// Test auth for create
func TestCreateBookUnAuth(t *testing.T) {
	fmt.Print("\n---------------- CREATE BOOK TESTS ----------------\n")
	body := `{"title": "Lonely Book", "author":"Lonely Man", "image":null}`
	var response string

	testutils.MakeHttpRequest(t, "POST", ts.URL+"/books", body, http.StatusUnauthorized,
		&response)
	require.Equal(t, "User needs to be authenticated", response)

	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books", body, http.StatusForbidden,
		&response, "test-token-user1")
	require.Equal(t, "do not have permission", response)

	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books", body, http.StatusForbidden,
		&response, "test-token-intern1")
	require.Equal(t, "do not have permission", response)
}

// Test to just create the book
func TestJustCreateBook(t *testing.T) {
	body := `{"title": "Lonely Book", "author":"Lonely Man", "image":null}`
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books", body, http.StatusCreated,
		nil, "test-token-primary")

	var response []models.Book

	// get req should not cause an error if book exists without any languages
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books", "", 200, &response)

	require.Len(t, response, 6)
}

// Test creating a book and its contents together
func TestCreateBookandBookDetails(t *testing.T) {
	body := `{"title": "Harry Potter", "author": "JK Rowling", "image":null}`
	var createdBook models.Book
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books", body, http.StatusCreated,
		&createdBook, "test-token-primary")

	require.Equal(t, "Harry Potter", createdBook.Title)
	require.Equal(t, "JK Rowling", createdBook.Author)
	require.Equal(t, []string{}, createdBook.Languages)

	body = `{"lang": "en", 
	"read": {"video": null, "body":"hp_rb"}, 
	"explore": {"video": null, "body":"hp_eb"},  
	"learn": {"video": null, "body":"hp_lb"}}`
	var createdBookDetails models.BookDetails
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books/"+createdBook.ID, body, http.StatusCreated,
		&createdBookDetails, "test-token-primary")

	require.Equal(t, "hp_rb", createdBookDetails.Read.Body)
	require.Equal(t, "hp_eb", createdBookDetails.Explore.Body)
}

// Make sure foreign key constraint is working
func TestBookDetailsForeignKey(t *testing.T) {
	body := `{"lang": "en", 
	"read": {"video": null, "body":"bad_rb"}, 
	"explore": {"video": null, "body":"bad_eb"},  
	"learn": {"video": null, "body":"bad_lb"}}`

	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books/nonexistant", body, http.StatusInternalServerError,
		nil, "test-token-primary")
}

func TestDuplicateBookDetails(t *testing.T) {
	body := `{"title": "Duplicate", "author": "OneOfAKind", "image":null}`
	var createdBook models.Book
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books", body, http.StatusCreated,
		&createdBook, "test-token-primary")

	body = `{"lang": "en", 
		"read": {"video": null, "body":"rbody"}, 
		"explore": {"video": null, "body":"ebody"},  
		"learn": {"video": null, "body":"lbody"}}`
	var createdBookDetails models.BookDetails
	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books/"+createdBook.ID, body, http.StatusCreated,
		&createdBookDetails, "test-token-primary")

	testutils.MakeAuthenticatedRequest(t, "POST", ts.URL+"/books/"+createdBook.ID, body, http.StatusConflict,
		nil, "test-token-primary")
}

// Test auth for delete
func TestDeleteBookUnAuth(t *testing.T) {
	fmt.Print("\n---------------- DELETE BOOK TESTS ----------------\n")
	var response string

	testutils.MakeHttpRequest(t, "DELETE", ts.URL+"/books/c_id/en", "", http.StatusUnauthorized,
		&response)
	require.Equal(t, "User needs to be authenticated", response)

	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/c_id/en", "", http.StatusForbidden,
		&response, "test-token-user1")
	require.Equal(t, "do not have permission", response)

	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/c_id/en", "", http.StatusForbidden,
		&response, "test-token-intern")
	require.Equal(t, "do not have permission", response)
}

// Test deleting from book contents
func TestDeleteBookDetails(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/c_id/en", "", http.StatusNoContent,
		nil, "test-token-primary")

	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/c_id/en", "", http.StatusNotFound, nil)

}

// Test deleting book from books
func TestDeleteBook(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/a_id", "", http.StatusNoContent,
		nil, "test-token-primary")

	// make sure delete cascades
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/a_id/en", "", http.StatusNotFound, nil)

	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/a_id/es", "", http.StatusNotFound, nil)

}

// Make sure cannot delete book on id that does not exist
func TestDeleteBookOnInvalidId(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/nonexistant", "", http.StatusNotFound,
		nil, "test-token-primary")
}

// Make sure cannot delete book contents on id that does not exist
func TestDeleteBookDetOnInvalidId(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/nonexistant/en", "", http.StatusNotFound,
		nil, "test-token-primary")
}

// Make sure cannot delete book contents on language that does not exist
func TestDeleteBookDetOnInvalidLang(t *testing.T) {
	testutils.MakeAuthenticatedRequest(t, "DELETE", ts.URL+"/books/catcher/ge", "", http.StatusNotFound,
		nil, "test-token-primary")
}

// Test auth for delete
func TestUpdateBookUnAuth(t *testing.T) {
	fmt.Print("\n---------------- UPDATE BOOK TESTS ----------------\n")
	body := `{"title": "updated_title", "author":"updated_author", "image":null}`
	var response string

	testutils.MakeHttpRequest(t, "PATCH", ts.URL+"/books/update", body, http.StatusUnauthorized,
		&response)
	require.Equal(t, "User needs to be authenticated", response)

	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/books/update", body, http.StatusForbidden,
		&response, "test-token-user1")
	require.Equal(t, "do not have permission", response)

	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/books/update", body, http.StatusForbidden,
		&response, "test-token-intern1")
	require.Equal(t, "do not have permission", response)
}

// Test updating entry in books
func TestUpdateBook(t *testing.T) {
	var updatedBook models.Book
	body := `{"title": "updated_title", "author":"updated_author", "image":null}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/books/update", body, http.StatusOK,
		&updatedBook, "test-token-primary")

	require.Equal(t, "updated_title", updatedBook.Title)
	require.Equal(t, "updated_author", updatedBook.Author)

}

// Test updating entry in book details
func TestUpdateBookDetails(t *testing.T) {
	var updatedBook models.BookDetails
	body := `{
	"read": {"video": null, "body":"updated_r"}, 
	"explore": {"video": null, "body":"updated_e"},  
	"learn": {"video": null, "body":"updated_l"}
	}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/books/update/en", body, http.StatusOK,
		&updatedBook, "test-token-primary")

	require.Equal(t, "updated_r", updatedBook.Read.Body)
	require.Equal(t, "updated_e", updatedBook.Explore.Body)
	require.Equal(t, "updated_l", updatedBook.Learn.Body)

	testutils.MakeHttpRequest(t, "GET", ts.URL+"/books/update/en", body, http.StatusOK,
		&updatedBook)

	require.Equal(t, "updated_r", updatedBook.Read.Body)
	require.Equal(t, "updated_e", updatedBook.Explore.Body)
	require.Equal(t, "updated_l", updatedBook.Learn.Body)
}

// Test updating entry with invalid id in books
func TestUpdateBookOnInvalidID(t *testing.T) {
	body := `{"title": "updated_title", "author":"updated_author", "image":null}`
	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/books/nonexistant", body,
		http.StatusNotFound, nil, "test-token-primary")

}

// Test updating entry with invalid id in book contents
func TestUpdateBookDetailsOnInvalidID(t *testing.T) {
	body := `{
		"read": {"video": null, "body":"updated_r"}, 
		"explore": {"video": null, "body":"updated_e"},  
		"learn": {"video": null, "body":"updated_l"}
		}`

	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/nonexistant/en", body,
		http.StatusNotFound, nil, "test-token-primary")
}

// Test updating entry with invalid lang in book contents
func TestUpdateBookDetailsOnInvalidLang(t *testing.T) {
	body := `{
		"read": {"video": null, "body":"updated_r"}, 
		"explore": {"video": null, "body":"updated_e"},  
		"learn": {"video": null, "body":"updated_l"}
		}`

	testutils.MakeAuthenticatedRequest(t, "PATCH", ts.URL+"/update/es", body,
		http.StatusNotFound, nil, "test-token-primary")
}

// Test incrementing the book clicks count
func TestUpdateAnalytics(t *testing.T) {
	fmt.Print("\n---------------- UPDATE BOOK ANALYTIC TESTS ----------------\n")
	var response []int
	testutils.MakeHttpRequest(t, "PUT", ts.URL+"/analytics/b_id/inc", "", 200, nil)

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/b_id?range=1", "",
		http.StatusOK, &response, "test-token-primary")

	require.Equal(t, 1, response[0])

	testutils.MakeHttpRequest(t, "PUT", ts.URL+"/analytics/b_id/inc", "", 200, nil)
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/b_id?range=1", "",
		http.StatusOK, &response, "test-token-primary")

	require.Equal(t, 2, response[0])

}

// Test incrementing the book clicks count for book on new day
func TestUpdateResetAnalytics(t *testing.T) {
	var response []int

	// check current day is pre-populated with value 10
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/c_id?range=1", "",
		http.StatusOK, &response, "test-token-primary")
	require.Equal(t, 10, response[0])

	testutils.MakeHttpRequest(t, "PUT", ts.URL+"/analytics/c_id/inc", "", 200, nil)
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/c_id?range=1", "",
		http.StatusOK, &response, "test-token-primary")

	// last_updated is initialized to a different day, so count should reset to 1
	require.Equal(t, 1, response[0])
}

// Test incrementing the book clicks count for nonexistent book
func TestUpdateNullAnalytics(t *testing.T) {
	testutils.MakeHttpRequest(t, "PUT", ts.URL+"/analytics/nonexistent/inc", "",
		http.StatusNotFound, nil)
}

// Test getting analytics for nonexistent book
func TestGetNullAnalytics(t *testing.T) {
	fmt.Print("\n---------------- GET BOOK ANALYTIC TESTS ----------------\n")
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/nonexistent?range=1", "",
		http.StatusNotFound, nil, "test-token-primary")
}

// Test getting analytics with invalid range query
func TestGetAnalyticsNullRange(t *testing.T) {
	// missing range query param
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher", "",
		http.StatusBadRequest, nil, "test-token-primary")

	// not a number
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher?range=a", "",
		http.StatusBadRequest, nil, "test-token-primary")

	// invalid number – not [1, 366]
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher?range=0", "",
		http.StatusBadRequest, nil, "test-token-primary")
}

// Test auth for getting analytics
func TestGetAnalyticsUnAuth(t *testing.T) {
	var response string

	// unauthorized user
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/analytics/catcher?range=1", "",
		http.StatusUnauthorized, &response)
	require.Equal(t, "User needs to be authenticated", response)

	// missing analytics permission
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher?range=1", "",
		http.StatusForbidden, &response, "test-token-admin")
	require.Equal(t, "do not have permission", response)
}

// Test getting analytics array
func TestGetAnalytics(t *testing.T) {
	var response []int

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher?range=1", "",
		http.StatusOK, &response, "test-token-primary")

	require.Len(t, response, 1)
	require.Equal(t, response[0], 1)

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/catcher?range=10", "",
		http.StatusOK, &response, "test-token-primary")

	require.Len(t, response, 10)
	require.Equal(t, response[0], 1)
}

// Test getting analytics for all books
func TestGetAllAnalytics(t *testing.T) {
	var response map[string][]int

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=1", "",
		http.StatusOK, &response, "test-token-primary")

	require.Len(t, response, 7)
	require.Len(t, response["c_id"], 1)
	require.Equal(t, response["catcher"][0], 1)

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=10", "",
		http.StatusOK, &response, "test-token-primary")

	require.Len(t, response, 7)
	require.Len(t, response["c_id"], 10)
}

// Test auth for getting all books
func TestGetAllAnalyticsUnAuth(t *testing.T) {
	var response string

	// unauthorized user
	testutils.MakeHttpRequest(t, "GET", ts.URL+"/analytics?range=1", "",
		http.StatusUnauthorized, &response)
	require.Equal(t, "User needs to be authenticated", response)

	// missing analytics permission
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=1", "",
		http.StatusForbidden, &response, "test-token-admin")
	require.Equal(t, "do not have permission", response)
}

// Test getting analytics for all books using invalid range
func TestGetAllAnalyticsNullRange(t *testing.T) {
	// no range provided
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics/", "",
		http.StatusBadRequest, nil, "test-token-primary")

	// range not a valid number
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=test", "",
		http.StatusBadRequest, nil, "test-token-primary")

	// range is out of bounds
	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=0", "",
		http.StatusBadRequest, nil, "test-token-primary")

	testutils.MakeAuthenticatedRequest(t, "GET", ts.URL+"/analytics?range=377", "",
		http.StatusBadRequest, nil, "test-token-primary")
}
