package controllers

import (
	"encoding/json"
	"net/http"
	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	//"github.com/TritonSE/words-alive/internal/models"
)

type BookController struct {
	Books database.BookDatabase
}

// Fetches a list of all books sorted by title for the main page (/books)
func (c *BookController) GetBookList (rw http.ResponseWriter, req *http.Request) {
    books, err := c.Books.FetchBookList(req.Context())
	if err != nil {
		rw.WriteHeader(500)
		rw.Write([]byte("error"))
		return
	}

	json.NewEncoder(rw).Encode(books)
}

// Fetches all contents of a book for reading (/book/{id})
func (c *BookController) GetBookDetailsByID (rw http.ResponseWriter, req *http.Request) {

    var bookID string = chi.URLParam(req, "id")

    book_details, err := c.Books.FetchBookDetailsByID(req.Context(), bookID)
    if err != nil {
		rw.WriteHeader(500)
		rw.Write([]byte("error"))
		return
    }

    json.NewEncoder(rw).Encode(book_details)
}
