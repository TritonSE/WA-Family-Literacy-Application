package controllers_test

import (
	"encoding/json"
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
	_, _ = conn.Exec("TRUNCATE book_contents")

	// Populate database
	conn.Exec("INSERT INTO books (id, title, author) values ('c_id', 'c','c1');")
	conn.Exec("INSERT INTO books (id, title, author) values ('a_id', 'a','a1');")
	conn.Exec("INSERT INTO books (id, title, author) values ('b_id', 'b','b1');")
	conn.Exec("INSERT INTO books (id, title, author) VALUES ('catcher'," +
		"'catcher in the rye', 'a');")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('a_id', 'en', 'a_en_rv', 'a_en_rb', 'a_en_ev', 'a_en_eb', " +
		"'a_en_lv', 'a_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('b_id', 'en', 'b_en_rv', 'b_en_rb', 'b_en_ev', 'b_en_eb', " +
		"'b_en_lv', 'b_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('c_id', 'en', 'c_en_rv', 'c_en_rb', 'c_en_ev', 'c_en_eb', " +
		"'c_en_lv', 'c_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('a_id', 'es', 'a_es_rv', 'a_es_rb', 'a_es_ev', 'a_es_eb', " +
		"'a_es_lv', 'a_es_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('catcher', 'en', 'catcher_rv', 'catcher_rb', 'catcher_ev', " +
		" 'catcher_eb', 'catcher_lv', 'catcher_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('catcher', 'es', 'catcher_es_rv', 'catcher_es_rb', 'catcher_es_ev', " +
		" 'catcher_es_eb', 'catcher_es_lv', 'catcher_es_lb')")
	// Close the server
	defer ts.Close()
	os.Exit(m.Run())
}

// Test for the book list function
func TestGetBooks(t *testing.T) {

	var response []models.Book
	testutils.MakeHttpRequest("GET", ts.URL+"/books", nil, &response, t)

	// Check for correct number of elements, and sort alphabetically
	require.Len(t, response, 4)
	require.Equal(t, "a", response[0].Title)
	require.Equal(t, "b", response[1].Title)
	require.Equal(t, "c", response[2].Title)
}

// Test for the book details function
func TestGetBookDetails(t *testing.T) {

	var response models.BookDetails
	testutils.MakeHttpRequest("GET", ts.URL+"/books/catcher/en", nil, &response, t)

	// Check title and content
	require.Equal(t, "catcher in the rye", response.Title)
	require.Equal(t, "catcher_rb", response.Read.Body)
}

// Test for non-existent language
func TestGetBookNullLang(t *testing.T) {

	var response string
	testutils.MakeHttpRequest("GET", ts.URL+"/books/catcher/fr", nil, &response, t)

	require.Equal(t, "book does not exist in specified language", response)
}

// Test for non-existent book
func TestGetNullBook(t *testing.T) {

	var response string
	testutils.MakeHttpRequest("GET", ts.URL+"/books/nonexistent/en", nil, &response, t)

	require.Equal(t, "book not found", response)
}

func TestCreateBookandBookDetails(t *testing.T) {
	var book = database.APICreateBook{
		Title:  "Harry Potter",
		Author: "JK Rowling",
		Image:  nil,
	}

	var bookDetails = database.APICreateBookContents{
		Language: "en",
		Read: models.TabContent{
			Video: nil,
			Body:  "read_body",
		},
		Explore: models.TabContent{
			Video: nil,
			Body:  "explore_body",
		},
		Learn: models.TabContent{
			Video: nil,
			Body:  "learn_body",
		},
	}

	var response models.Book
	var response2 models.BookDetails
	reqJSON, err := json.Marshal(book)
	require.NoError(t, err)
	var jsonString = []byte(reqJSON)

	testutils.MakeHttpRequest("POST", ts.URL+"/books", jsonString, &response, t)

	require.Equal(t, "Harry Potter", response.Title)
	require.Equal(t, "JK Rowling", response.Author)
	require.Equal(t, []string{}, response.Languages)

	reqJSON, err = json.Marshal(bookDetails)
	require.NoError(t, err)
	jsonString = []byte(reqJSON)

	testutils.MakeHttpRequest("POST",
		ts.URL+"/books/"+response.ID, jsonString, &response2, t)

}
