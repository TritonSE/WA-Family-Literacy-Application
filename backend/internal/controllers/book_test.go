package controllers_test

import (
	"encoding/json"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
	"github.com/stretchr/testify/require"
	"net/http/httptest"
	"os"
	//"strings"
	"testing"
    "fmt"
)

var conn = database.GetConnection()
var c = controllers.BookController{
	Books: database.BookDatabase{
		Conn: conn,
	},
}

func TestMain(m *testing.M) {
	database.Migrate("../../migrations")

	_, _ = c.Books.Conn.Exec("TRUNCATE books")

	os.Exit(m.Run())
}


func TestGetBooks(t *testing.T) {
	req := httptest.NewRequest("GET", "/books", nil)
	rr := httptest.NewRecorder()

    conn.Exec("INSERT INTO books (id, title, author, image, created_at) values ('a','b','c','d','e');")

	c.GetBookList(rr, req)
	require.Equal(t, 200, rr.Code)

	var response []models.Book
	err := json.Unmarshal(rr.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Len(t, response, 1)
    for _, book := range response {
        fmt.Printf("Title: %s\n", book.Title)
    }
}

// Expected to fail for now
func TestGetBookByID(t *testing.T) {
    req := httptest.NewRequest("GET", "/books/catcher", nil)
	rr := httptest.NewRecorder()

    conn.Exec("INSERT INTO books (id, title, author, image, created_at) VALUES ('catcher', 'catcher in the rye', 'a', 'i', '2000');")

    c.GetBookByID(rr, req)
	require.Equal(t, 200, rr.Code)

    var response models.Book
	err := json.Unmarshal(rr.Body.Bytes(), &response)
	require.NoError(t, err)
}
