package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

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

	var reqBook models.APICreateBook
	err := json.NewDecoder(req.Body).Decode(&reqBook)
	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "Invalid request schema")
		return
	}

	resBook, err := c.Books.InsertBook(req.Context(), reqBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusCreated, resBook)
}

// Creates an entry in the book_contents table (/books/{id})
func (c *BookController) CreateBookDetail(rw http.ResponseWriter, req *http.Request) {

	var reqBookDetail models.APICreateBookContents

	var bookID string = chi.URLParam(req, "id")

	err := json.NewDecoder(req.Body).Decode(&reqBookDetail)

	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "Invalid request schema")
		return
	}

	bookDetail, _, err := c.Books.FetchBookDetails(req.Context(), bookID, reqBookDetail.Language)

	// test for duplicate (id, lang)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if bookDetail != nil {
		writeResponse(rw, http.StatusConflict, "Book with associated language already exists")
		return
	}

	resBookDetail, err := c.Books.InsertBookDetails(req.Context(), bookID, reqBookDetail)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusCreated, resBookDetail)
}

// deletes an entry from the book_contents table (/books/{id}/{lang})
func (c *BookController) DeleteBookDetail(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

	book, _, _ := c.Books.FetchBookDetails(req.Context(), bookID, lang)

	if book == nil {
		writeResponse(rw, http.StatusNotFound, "Book with requested ID or Language was not found")
		return
	}

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

	book, _ := c.Books.FetchBook(req.Context(), bookID)

	if book == nil {
		writeResponse(rw, http.StatusNotFound, "Book with requested id was not found")
		return
	}

	err := c.Books.DeleteBook(req.Context(), bookID)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)
}

// updates the book from the books table (/books/{id})
func (c *BookController) UpdateBook(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var reqBook models.APIUpdateBook
	err := json.NewDecoder(req.Body).Decode(&reqBook)

	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "Invalid request schema")
		return
	}

	book, _ := c.Books.FetchBook(req.Context(), bookID)

	if book == nil {
		writeResponse(rw, http.StatusNotFound, "Book with ID requested not found")
		return
	}

	resBook, err := c.Books.UpdateBook(req.Context(), bookID, reqBook)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBook)

}

// updates a book in the book_contents table (/books/{id}/{lang})
func (c *BookController) UpdateBookDetails(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")
	var reqBookDetails models.APIUpdateBookDetails
	err := json.NewDecoder(req.Body).Decode(&reqBookDetails)

	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "Invalid request schema")
		return
	}

	bookDetails, _, _ := c.Books.FetchBookDetails(req.Context(), bookID, lang)

	if bookDetails == nil {
		writeResponse(rw, http.StatusNotFound, "Book not found with requested id and language")
		return
	}

	resBookDetails, err := c.Books.UpdateBookDetails(req.Context(), bookID, lang, reqBookDetails)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBookDetails)

}

// increments a book's click count for the current day (/analytics/{id}/inc)
func (c *BookController) UpdateBookClicks(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")

	analytics, _ := c.Books.FetchBookAnalytics(req.Context(), bookID, 1)

	if analytics == nil {
		writeResponse(rw, http.StatusNotFound, "Book analytics not found for requested id")
		return
	}

	err := c.Books.UpdateBookAnalytics(req.Context(), bookID)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)

}

// fetches daily book clicks in a given range (/analytics/{id}?range=<days>)
func (c *BookController) GetBookClicks(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var dayRange string = req.URL.Query().Get("range")
	var dRange int

	if dayRange == "" {
		writeResponse(rw, http.StatusBadRequest, "range missing")
		return
	}

	if numDays, err := strconv.Atoi(dayRange); err != nil {
		writeResponse(rw, http.StatusBadRequest, "could not parse range")
		return
	} else if numDays < 1 || numDays > 366 {
		writeResponse(rw, http.StatusBadRequest, "Range out of bounds")
		return
	} else {
		dRange = numDays
	}

	bookAnalytics, err := c.Books.FetchBookAnalytics(req.Context(), bookID, dRange)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if bookAnalytics == nil {
		writeResponse(rw, http.StatusNotFound, "book analytics not found")
		return
	}

	writeResponse(rw, http.StatusOK, bookAnalytics)

}
