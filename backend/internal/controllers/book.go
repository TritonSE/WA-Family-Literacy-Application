package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/models"
)

type BookController struct {
	Books database.BookDatabase
	Auth  auth.Authenticator
}

// Fetches a list of all books sorted by title for the main page (/books)
func (c *BookController) GetBookList(rw http.ResponseWriter, req *http.Request) {
	books, err := c.Books.FetchBookList(req.Context())
	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, books)
}

// GetBook fetches a single book from the database by its ID
func (c *BookController) GetBook(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")

	if bookID == "" {
		writeResponse(rw, http.StatusBadRequest, "invalid ID")
		return
	}

	book, err := c.Books.FetchBook(req.Context(), bookID)
	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}
	if book == nil {
		writeResponse(rw, http.StatusNotFound, "book not found")
		return
	}

	// if user is authenticated, check if the book is favorited
	authHeader := req.Header.Get("Authorization")
	if authHeader != "" {

		if !strings.HasPrefix(authHeader, "Bearer ") {
			writeResponse(rw, http.StatusBadRequest, "Unauthenticated requests should unset the header")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		userID, ok := c.Auth.VerifyToken(req.Context(), tokenString)
		if !ok {
			writeResponse(rw, http.StatusForbidden, "Token was invalid")
			return
		}

		// check if the book is favorited if userID not empty
		book.Favorite, err = c.Books.FetchFavoritedBook(req.Context(), userID, bookID)

		if err != nil {
			log.Println(err)
			writeResponse(rw, http.StatusInternalServerError, "error")
			return
		}
	}

	writeResponse(rw, http.StatusOK, book)
}

// Fetches contents of a book for reading (/book/{id}/{lang})
func (c *BookController) GetBookDetails(rw http.ResponseWriter, req *http.Request) {

	var bookID string = chi.URLParam(req, "id")
	var lang string = chi.URLParam(req, "lang")

	bookDetails, wrongLang, err := c.Books.FetchBookDetails(req.Context(), bookID, lang)
	if err != nil {
		log.Println(err)
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
		log.Println(err)
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
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if bookDetail != nil {
		writeResponse(rw, http.StatusConflict, "Book with associated language already exists")
		return
	}

	resBookDetail, err := c.Books.InsertBookDetails(req.Context(), bookID, reqBookDetail)
	if err != nil {
		log.Println(err)
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
		log.Println(err)
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
		log.Println(err)
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
		log.Println(err)
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
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, resBookDetails)

}

// increments a book's click count for the current day (/analytics/{id}/inc)
func (c *BookController) UpdateBookClicks(rw http.ResponseWriter, req *http.Request) {
	bookID := chi.URLParam(req, "id")

	analytics, _ := c.Books.FetchBookAnalytics(req.Context(), bookID, 1)

	if analytics == nil {
		writeResponse(rw, http.StatusNotFound, "Book analytics not found for requested id")
		return
	}

	err := c.Books.IncrementBookCounter(req.Context(), bookID)

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, nil)
}

// fetches daily book clicks in a given range (/analytics/{id}?range=<days>)
func (c *BookController) GetBookClicks(rw http.ResponseWriter, req *http.Request) {
	var bookID string = chi.URLParam(req, "id")
	var dayRange string = req.URL.Query().Get("range")

	if dayRange == "" {
		writeResponse(rw, http.StatusBadRequest, "range missing")
		return
	}

	numDays, err := strconv.Atoi(dayRange)

	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "could not parse range")
		return
	} else if numDays < 1 || numDays > 366 {
		writeResponse(rw, http.StatusBadRequest, "Range out of bounds")
		return
	}

	bookAnalytics, err := c.Books.FetchBookAnalytics(req.Context(), bookID, numDays)

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if bookAnalytics == nil {
		writeResponse(rw, http.StatusNotFound, "book analytics not found")
		return
	}

	writeResponse(rw, http.StatusOK, bookAnalytics)
}

// Fetches daily book clicks in a given range from today (/analytics?range=<days>)
func (c *BookController) GetAllBookClicks(rw http.ResponseWriter, req *http.Request) {
	var dayRange string = req.URL.Query().Get("range")

	if dayRange == "" {
		writeResponse(rw, http.StatusBadRequest, "range missing")
		return
	}

	numDays, err := strconv.Atoi(dayRange)

	if err != nil {
		writeResponse(rw, http.StatusBadRequest, "could not parse range")
		return
	} else if numDays < 1 || numDays > 366 {
		writeResponse(rw, http.StatusBadRequest, "Range out of bounds")
		return
	}

	bookAnalytics, err := c.Books.FetchAllBookAnalytics(req.Context(), numDays)
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

// Fetches 5 most popular books from the past month for the home screen (/books/popular)
func (c *BookController) GetPopularBooks(rw http.ResponseWriter, req *http.Request) {
	popularBooks, err := c.Books.FetchPopularBooks(req.Context())

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	if popularBooks == nil {
		writeResponse(rw, http.StatusNotFound, "most popular books could not be found")
		return
	}

	writeResponse(rw, http.StatusOK, popularBooks)
}

// fetches favorite books for the currently authenticated user (/books/favorite)
func (c *BookController) GetFavorites(rw http.ResponseWriter, req *http.Request) {
	userID, ok := req.Context().Value("user").(string)

	if !ok {
		log.Println("unable to get user from request context")
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	favorites, err := c.Books.FetchFavorites(req.Context(), userID)

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, favorites)
}

// creates a new entry in the favorite books table (/books/favorites/{id})
func (c *BookController) AddToFavorites(rw http.ResponseWriter, req *http.Request) {

	userID, ok := req.Context().Value("user").(string)
	var bookID string = chi.URLParam(req, "id")

	if !ok {
		log.Println("unable to get user from request context")
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	// Validate bookID (ensures book with given id exists in table)
	_, err := c.Books.FetchBook(req.Context(), bookID)
	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusBadRequest, "error")
		return
	}

	err = c.Books.InsertFavoriteBook(req.Context(), userID, bookID)

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusOK, nil)

}

// removes an entry in the favorite books table (/books/favorites/{id})
func (c *BookController) DeleteFromFavorites(rw http.ResponseWriter, req *http.Request) {

	userID, ok := req.Context().Value("user").(string)
	var bookID string = chi.URLParam(req, "id")

	if !ok {
		log.Println("unable to get user from request context")
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	favorited, _ := c.Books.FetchFavoritedBook(req.Context(), userID, bookID)

	if !favorited {
		writeResponse(rw, http.StatusNotFound, "Favorited book with requested ID for user was not found")
		return
	}

	err := c.Books.DeleteFavorite(req.Context(), userID, bookID)

	if err != nil {
		log.Println(err)
		writeResponse(rw, http.StatusInternalServerError, "error")
		return
	}

	writeResponse(rw, http.StatusNoContent, nil)

}
