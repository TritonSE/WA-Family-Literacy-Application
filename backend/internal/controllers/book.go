package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
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

// Fetches contents of a book for reading (/book/{id}/{lang})
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

func (c *BookController) CreateBook(rw http.ResponseWriter, req *http.Request) {
	var newBook database.APICreateBook
	var createdBook models.Book
	err := json.NewDecoder(req.Body).Decode(&newBook)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	createdBook, err = c.Books.InsertBook(req.Context(), newBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, createdBook)
}

func (c *BookController) CreateBookDetail(rw http.ResponseWriter, req *http.Request) {
	var newBookDetail database.APICreateBookContents
	var createdBookDetail models.BookDetails

	var bookID string = chi.URLParam(req, "id")

	err := json.NewDecoder(req.Body).Decode(&newBookDetail)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	createdBookDetail, err = c.Books.InsertBookDetails(req.Context(), bookID, newBookDetail)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, createdBookDetail)
}

func (c *BookController) DeleteBookDetail(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

	err := c.Books.DeleteBookContent(req.Context(), bookID, lang)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)

}
func (c *BookController) DeleteBook(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")

	err := c.Books.DeleteBookWithID(req.Context(), bookID)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)
}

func (c *BookController) UpdateBook(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var reqBook database.APIUpdateBook
	var resBook models.Book
	err := json.NewDecoder(req.Body).Decode(&reqBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	resBook, err = c.Books.UpdateBookWithID(req.Context(), bookID, reqBook)

	writeResponse(rw, http.StatusOK, resBook)

}

func (c *BookController) UpdateBookDetails(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")
	var reqBookDetails database.APIUpdateBookDetails
	err := json.NewDecoder(req.Body).Decode(&reqBookDetails)
}
