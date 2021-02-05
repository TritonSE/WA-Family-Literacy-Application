package controllers

import (
	"github.com/go-chi/chi"
	"net/http"

	"github.com/TritonSE/words-alive/internal/database"
)

type BookController struct {
	Books database.BookDatabase
}

// Fetches a list of all books sorted by title for the main page (/books)
func (c *BookController) GetBookList(rw http.ResponseWriter, req *http.Request) {
	books, err := c.Books.FetchBookList(req.Context())
	if err != nil {
		WriteResponse(rw, http.StatusInternalServerError, books)
		return
	}

	WriteResponse(rw, http.StatusOK, books)
}

// Fetches all contents of a book for reading (/book/{id})
func (c *BookController) GetBookDetailsByID(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")

	bookDetails, err := c.Books.FetchBookDetailsByID(req.Context(), bookID)
	if err != nil {
		WriteResponse(rw, http.StatusInternalServerError, bookDetails)
		return
	}

	WriteResponse(rw, http.StatusOK, bookDetails)
}
