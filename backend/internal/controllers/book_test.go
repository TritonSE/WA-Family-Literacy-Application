package controllers_test

import (
	"net/http/httptest"
	"os"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
	"github.com/TritonSE/words-alive/internal/testutils"
)

var conn = database.GetConnection()
var r = controllers.GetRouter()
var ts = httptest.NewServer(r)

// Set up database
func TestMain(m *testing.M) {
	database.Migrate("../../migrations")

	_, _ = conn.Exec("TRUNCATE books")

	// Populate database
	conn.Exec("INSERT INTO books (title, author) values ('c','c1');")
	conn.Exec("INSERT INTO books (title, author) values ('a','a1');")
	conn.Exec("INSERT INTO books (title, author) values ('b','b1');")
	conn.Exec("INSERT INTO books (id, title, author, read_body, " +
		"explore_body, learn_body) VALUES ('catcher'," +
		"'catcher in the rye', 'a', 'r', 'e', 'l');")

	// Close the server
	defer ts.Close()
	os.Exit(m.Run())
}

// Test for the book list function
func TestGetBooks(t *testing.T) {

	var response []models.Book
	testutils.MakeHttpRequest("GET", ts.URL+"/books", &response, t)

	// Check for correct number of elements, and sort alphabetically
	require.Len(t, response, 4)
	require.Equal(t, "a", response[0].Title)
	require.Equal(t, "b", response[1].Title)
	require.Equal(t, "c", response[2].Title)
}

// Test for the book details function
func TestGetBookDetailsByID(t *testing.T) {

	var response models.BookDetails
	testutils.MakeHttpRequest("GET", ts.URL+"/books/catcher", &response, t)

	// Check title
	require.Equal(t, "catcher in the rye", response.Title)
}
