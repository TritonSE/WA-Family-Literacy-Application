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

// Creates a book and inserts it into the book database (/books)
func (c *BookController) CreateBook(rw http.ResponseWriter, req *http.Request) {
	var reqBook database.APICreateBook
	var resBook models.Book
	err := json.NewDecoder(req.Body).Decode(&reqBook)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	resBook, err = c.Books.InsertBook(req.Context(), reqBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBook)
}

// Creates an entry in the book_contents table (/books/{id})
func (c *BookController) CreateBookDetail(rw http.ResponseWriter, req *http.Request) {
	var reqBookDetail database.APICreateBookContents
	var resBookDetail models.BookDetails

	var bookID string = chi.URLParam(req, "id")

	err := json.NewDecoder(req.Body).Decode(&reqBookDetail)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	resBookDetail, err = c.Books.InsertBookDetails(req.Context(), bookID, reqBookDetail)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBookDetail)
}

// deletes an entry from the book_contents entry (/books/{id}/{lang})
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

// deletes a book from the books table (/books/{id})
func (c *BookController) DeleteBook(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")

	err := c.Books.DeleteBook(req.Context(), bookID)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)
}

// updates the book from the books table (/books{id})
func (c *BookController) UpdateBook(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var reqBook database.APIUpdateBook
	var resBook models.Book
	err := json.NewDecoder(req.Body).Decode(&reqBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	resBook, err = c.Books.UpdateBook(req.Context(), bookID, reqBook)

	writeResponse(rw, http.StatusOK, resBook)

}

// updates a book in the book_contents table (/books{id}/{lang})
func (c *BookController) UpdateBookDetails(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")
	var reqBookDetails database.APIUpdateBookDetails
	var resBookDetails models.BookDetails
	err := json.NewDecoder(req.Body).Decode(&reqBookDetails)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	resBookDetails, err = c.Books.UpdateBookDetails(req.Context(), bookID, lang, reqBookDetails)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBookDetails)

}
