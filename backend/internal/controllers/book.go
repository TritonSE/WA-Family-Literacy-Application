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

func (c *BookController) GetBookByID (rw http.ResponseWriter, req *http.Request) {

    var bookID string = chi.URLParam(req, "id")

    book, err := c.Books.FetchBookByID(req.Context(), bookID)
    if err != nil {
		rw.WriteHeader(500)
		rw.Write([]byte("error"))
		return
    }

    json.NewEncoder(rw).Encode(book)
}
