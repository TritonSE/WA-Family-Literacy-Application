package controllers

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
)

type BookController struct {
	Books database.BookDatabase
}

// Fetches a list of all books sorted by title for the main page (/books)
func (c *BookController) GetBookList(rw http.ResponseWriter, req *http.Request) {
	books, err := c.Books.FetchBookList(req.Context())
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, books)
}

// Fetches all contents of a book for reading (/book/{id})
func (c *BookController) GetBookDetails(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

	bookDetails, wrongLang, err := c.Books.FetchBookDetails(req.Context(), bookID, lang)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if bookDetails == nil {
		if wrongLang {
			writeResponse(rw, http.StatusNotFound, "book does not exist in specified language")
		} else {
			writeResponse(rw, http.StatusNotFound, "book not found")
		}
		return
	}

	writeResponse(rw, http.StatusOK, bookDetails)
}
