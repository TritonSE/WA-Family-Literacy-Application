package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type BookController struct {
	Books  database.BookDatabase
	Admins database.AdminDatabase
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

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, canUploadBooks, _, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canUploadBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var reqBook models.APICreateBook
	err = json.NewDecoder(req.Body).Decode(&reqBook)
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

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, canUploadBooks, _, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canUploadBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var reqBookDetail models.APICreateBookContents

	var bookID string = chi.URLParam(req, "id")

	err = json.NewDecoder(req.Body).Decode(&reqBookDetail)

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

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, _, canDeleteBooks, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canDeleteBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

	book, _, _ := c.Books.FetchBookDetails(req.Context(), bookID, lang)

	if book == nil {
		writeResponse(rw, http.StatusNotFound, "Book with requested ID or Language was not found")
		return
	}

	err = c.Books.DeleteBookContent(req.Context(), bookID, lang)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)

}

// deletes a book from the books table (/books/{id})
func (c *BookController) DeleteBook(rw http.ResponseWriter, req *http.Request) {

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, _, canDeleteBooks, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canDeleteBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var bookID string = chi.URLParam(req, "id")

	book, _ := c.Books.FetchBook(req.Context(), bookID)

	if book == nil {
		writeResponse(rw, http.StatusNotFound, "Book with requested id was not found")
		return
	}

	err = c.Books.DeleteBook(req.Context(), bookID)

	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)
}

// updates the book from the books table (/books/{id})
func (c *BookController) UpdateBook(rw http.ResponseWriter, req *http.Request) {

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, canUploadBooks, _, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canUploadBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var bookID string = chi.URLParam(req, "id")
	var reqBook models.APIUpdateBook
	err = json.NewDecoder(req.Body).Decode(&reqBook)

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

	// Check auth token
	uid, ok := req.Context().Value("user").(string)
	if !ok {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println("unable to get user from request context")
		return
	}

	// Check admin permissions
	isAdmin, _, canUploadBooks, _, err := c.Admins.FetchAdminPermissions(req.Context(), uid)
	if err != nil {
		writeResponse(rw, http.StatusInternalServerError, "error")
		fmt.Println(err)
		return
	}
	if !isAdmin || !canUploadBooks {
		writeResponse(rw, http.StatusForbidden, "do not have permission")
		return
	}

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")
	var reqBookDetails models.APIUpdateBookDetails
	err = json.NewDecoder(req.Body).Decode(&reqBookDetails)

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
