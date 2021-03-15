package controllers_test

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

// Test for the book list function
func TestGetBooks(t *testing.T) {

	var response []models.Book
	testutils.MakeHttpRequest("GET", ts.URL+"/books", "", 200, &response, t)

	// Check for correct number of elements, and sort alphabetically
	require.Len(t, response, 5)
	require.Equal(t, "a", response[0].Title)
	require.Equal(t, "b", response[1].Title)
	require.Equal(t, "c", response[2].Title)

}

// Test for the book details function
func TestGetBookDetails(t *testing.T) {

	var response models.BookDetails
	testutils.MakeHttpRequest("GET", ts.URL+"/books/catcher/en", "", 200, &response, t)

	// Check title and content
	require.Equal(t, "catcher in the rye", response.Title)
	require.Equal(t, "catcher_rb", response.Read.Body)
}

// Test for non-existent language
func TestGetBookNullLang(t *testing.T) {

	var response string
	testutils.MakeHttpRequest("GET", ts.URL+"/books/catcher/fr", "", 404, &response, t)

	require.Equal(t, "book does not exist in specified language", response)
}

// Test for non-existent book
func TestGetNullBook(t *testing.T) {

	var response string
	testutils.MakeHttpRequest("GET", ts.URL+"/books/nonexistent/en", "", 404, &response, t)

	require.Equal(t, "book not found", response)
}

// Test to just create the book
func TestJustCreateBook(t *testing.T) {
	body := `{"title": "Lonely Book", "author":"Lonely Man", "image":null}`
	testutils.MakeHttpRequest("POST", ts.URL+"/books", body, http.StatusCreated,
		nil, t)

	var response []models.Book

	// get req should not cause an error if book exists without any languages
	testutils.MakeHttpRequest("GET", ts.URL+"/books", "", 200, &response, t)

	require.Len(t, response, 6)
}

// Test creating a book and its contents together
func TestCreateBookandBookDetails(t *testing.T) {
	body := `{"title": "Harry Potter", "author":"JK Rowling", "image":null}`
	var createdBook models.Book
	testutils.MakeHttpRequest("POST", ts.URL+"/books", body, http.StatusCreated,
		&createdBook, t)

	require.Equal(t, "Harry Potter", createdBook.Title)
	require.Equal(t, "JK Rowling", createdBook.Author)
	require.Equal(t, []string{}, createdBook.Languages)

	body = `{"language": "en", 
	"Read": {"video": null, "body":"hp_rb"}, 
	"Explore": {"video": null, "body":"hp_eb"},  
	"Learn": {"video": null, "body":"hp_lb"}}`
	var createdBookDetails models.BookDetails
	testutils.MakeHttpRequest("POST", ts.URL+"/books/"+createdBook.ID, body, http.StatusCreated,
		&createdBookDetails, t)

	require.Equal(t, "hp_rb", createdBookDetails.Read.Body)
	require.Equal(t, "hp_eb", createdBookDetails.Explore.Body)
}

// Make sure foreign key constraint is working
func TestBookDetailsForeignKey(t *testing.T) {
	body := `{"language": "en", 
	"Read": {"video": null, "body":"bad_rb"}, 
	"Explore": {"video": null, "body":"bad_eb"},  
	"Learn": {"video": null, "body":"bad_lb"}}`

	testutils.MakeHttpRequest("POST", ts.URL+"/books/nonexistant", body, http.StatusInternalServerError,
		nil, t)

}

// Test deleting from book contents
func TestDeleteBookDetails(t *testing.T) {
	testutils.MakeHttpRequest("DELETE", ts.URL+"/books/c_id/en", "", http.StatusNoContent,
		nil, t)

	testutils.MakeHttpRequest("GET", ts.URL+"/books/c_id/en", "", http.StatusNotFound,
		nil, t)

}

// Test deleting book from books
func TestDeleteBook(t *testing.T) {
	testutils.MakeHttpRequest("DELETE", ts.URL+"/books/a_id", "", http.StatusNoContent,
		nil, t)

	// make sure delete cascades
	testutils.MakeHttpRequest("GET", ts.URL+"/books/a_id/en", "", http.StatusNotFound,
		nil, t)

	testutils.MakeHttpRequest("GET", ts.URL+"/books/a_id/es", "", http.StatusNotFound,
		nil, t)

}

// Make sure cannot delete book on id that does not exist
func TestDeleteBookOnInvalidId(t *testing.T) {
	testutils.MakeHttpRequest("DELETE", ts.URL+"/books/nonexistant", "", http.StatusInternalServerError,
		nil, t)
}

// Make sure cannot delete book contents on id that does not exist
func TestDeleteBookDetOnInvalidId(t *testing.T) {
	testutils.MakeHttpRequest("DELETE", ts.URL+"/books/nonexistant/en", "", http.StatusInternalServerError,
		nil, t)
}

// Make sure cannot delete book contents on language that does not exist
func TestDeleteBookDetOnInvalidLang(t *testing.T) {
	testutils.MakeHttpRequest("DELETE", ts.URL+"/books/catcher/ge", "", http.StatusInternalServerError,
		nil, t)
}

// Test updating entry in books
func TestUpdateBook(t *testing.T) {
	var updatedBook models.Book
	body := `{"title": "updated_title", "author":"updated_author", "image":null}`
	testutils.MakeHttpRequest("PATCH", ts.URL+"/books/update", body, http.StatusOK, &updatedBook, t)

	require.Equal(t, "updated_title", updatedBook.Title)
	require.Equal(t, "updated_author", updatedBook.Author)

}

// Test updating entry in book details
func TestUpdateBookDetails(t *testing.T) {
	var updatedBook models.BookDetails
	body := `{
	"Read": {"video": null, "body":"updated_r"}, 
	"Explore": {"video": null, "body":"updated_e"},  
	"Learn": {"video": null, "body":"updated_l"}
	}`
	testutils.MakeHttpRequest("PATCH", ts.URL+"/books/update/en", body, http.StatusOK, &updatedBook, t)

	require.Equal(t, "updated_r", updatedBook.Read.Body)
	require.Equal(t, "updated_e", updatedBook.Explore.Body)
	require.Equal(t, "updated_l", updatedBook.Learn.Body)

	testutils.MakeHttpRequest("GET", ts.URL+"/books/update/en", body, http.StatusOK, &updatedBook, t)

	require.Equal(t, "updated_r", updatedBook.Read.Body)
	require.Equal(t, "updated_e", updatedBook.Explore.Body)
	require.Equal(t, "updated_l", updatedBook.Learn.Body)
}

// Test updating entry with invalid id in books
func TestUpdateBookOnInvalidID(t *testing.T) {
	body := `{"title": "updated_title", "author":"updated_author", "image":null}`
	testutils.MakeHttpRequest("PATCH", ts.URL+"/books/nonexistant", body, http.StatusInternalServerError, nil, t)

}

// Test updating entry with invalid id in book contents
func TestUpdateBookDetailsOnInvalidID(t *testing.T) {
	body := `{
		"Read": {"video": null, "body":"updated_r"}, 
		"Explore": {"video": null, "body":"updated_e"},  
		"Learn": {"video": null, "body":"updated_l"}
		}`

	testutils.MakeHttpRequest("PATCH", ts.URL+"/nonexistant/en", body, http.StatusNotFound, nil, t)
}

// Test updating entry with invalid lang in book contents
func TestUpdateBookDetailsOnInvalidLang(t *testing.T) {
	body := `{
		"Read": {"video": null, "body":"updated_r"}, 
		"Explore": {"video": null, "body":"updated_e"},  
		"Learn": {"video": null, "body":"updated_l"}
		}`

	testutils.MakeHttpRequest("PATCH", ts.URL+"/update/es", body, http.StatusNotFound, nil, t)
}
