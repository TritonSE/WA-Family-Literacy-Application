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
	//"strings"
	"testing"
    "fmt"
)

var conn = database.GetConnection()
/* var c = controllers.BookController{
	Books: database.BookDatabase{
		Conn: conn,
	},
}
*/
var r = controllers.GetRouter()

func TestMain(m *testing.M) {
	database.Migrate("../../migrations")

	_, _ = conn.Exec("TRUNCATE books")

	os.Exit(m.Run())
}


func TestGetBooks(t *testing.T) {
    conn.Exec("INSERT INTO books (id, title, author, image, created_at) values ('a','third','c','d','e');")
    conn.Exec("INSERT INTO books (id, title, author, image, created_at) values ('a1','first','c1','d1','e1');")
    conn.Exec("INSERT INTO books (id, title, author, image, created_at) values ('a2','second','c2','d2','e2');")

	ts := httptest.NewServer(r)
	defer ts.Close()

	req, err := http.NewRequest("GET", ts.URL + "/books", nil)
	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	var response []models.Book
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

	err = json.Unmarshal(body, &response)
	require.NoError(t, err)
	require.Len(t, response, 3)
    for _, book := range response {
        fmt.Printf("Title: %s\n", book.Title)
    }
}

func TestGetBookByID(t *testing.T) {
    conn.Exec("INSERT INTO books (id, title, author, image, created_at) " +
              "VALUES ('catcher', 'catcher in the rye', 'a', 'i', '2000');")

	ts := httptest.NewServer(r)
	defer ts.Close()

	req, err := http.NewRequest("GET", ts.URL + "/books/catcher", nil)
	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	body, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)

    var response models.Book
	err = json.Unmarshal(body, &response)
	require.NoError(t, err)
    fmt.Printf("Title: %s\n", response.Title)
}
