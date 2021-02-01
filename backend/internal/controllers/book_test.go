package controllers_test

import (
	"encoding/json"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
	"github.com/stretchr/testify/require"
	"net/http/httptest"
	"net/http"
	"os"
	"io/ioutil"
	"testing"
)

var conn = database.GetConnection()
var r = controllers.GetRouter()

// Set up database
func TestMain(m *testing.M) {
	database.Migrate("../../migrations")

	_, _ = conn.Exec("TRUNCATE books")

	os.Exit(m.Run())
}

// Test for the book list function
func TestGetBooks(t *testing.T) {
    // Populate database
    conn.Exec("INSERT INTO books (title, author) values ('c','c1');")
    conn.Exec("INSERT INTO books (title, author) values ('a','a1');")
    conn.Exec("INSERT INTO books (title, author) values ('b','b1');")

    // Open server
	ts := httptest.NewServer(r)
	defer ts.Close()

    // Send http request
	req, err := http.NewRequest("GET", ts.URL + "/books", nil)
	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	var response []models.Book
	defer res.Body.Close()

    // Parse response
	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

	err = json.Unmarshal(body, &response)
	require.NoError(t, err)

    // Check for correct number of elements, and sort alphabetically
    require.Len(t, response, 3)
    require.Equal(t, response[0].Title, "a")
    require.Equal(t, response[1].Title, "b")
    require.Equal(t, response[2].Title, "c")
}

// Test for the book details function
func TestGetBookDetailsByID(t *testing.T) {
    // Populate database
    conn.Exec("INSERT INTO books (id, title, author)" +
              "VALUES ('catcher', 'catcher in the rye', 'a');")

    // Open server
	ts := httptest.NewServer(r)
	defer ts.Close()

    // Send http request
	req, err := http.NewRequest("GET", ts.URL + "/books/catcher", nil)
	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

    // Parse response
	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

    var response models.BookDetails
	err = json.Unmarshal(body, &response)
	require.NoError(t, err)

    // Check title
    require.Equal(t, response.Title, "catcher in the rye")
}
