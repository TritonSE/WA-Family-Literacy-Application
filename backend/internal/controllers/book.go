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

func (c *BookController) GetBookList (rw http.ResponseWriter, req *http.Request) {
    books, err := c.Books.FetchBookList(req.Context())
	if err != nil {
		rw.WriteHeader(500)
		rw.Write([]byte("error"))
		return
	}

	json.NewEncoder(rw).Encode(books)
}

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
