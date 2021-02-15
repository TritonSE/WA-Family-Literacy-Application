package controllers

import (
	"github.com/go-chi/chi"
	"net/http"
    "fmt"

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
func (c *BookController) GetBookDetailsByID(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

    fmt.Printf("Id: %s, lang: %s\n", bookID, lang)
    valid, err := c.Books.CheckBookID(req.Context(), bookID, lang)
    if err != nil {
        writeResponse(rw, http.StatusInternalServerError, "error")
        return
    }

    if !valid {
        writeResponse(rw, http.StatusNotFound, "error")
        return
    }

	bookDetails, err := c.Books.FetchBookDetailsByID(req.Context(), bookID, lang)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, bookDetails)
}
