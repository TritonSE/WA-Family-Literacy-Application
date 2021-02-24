package controllers

import (
	"log"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/TritonSE/words-alive/internal/database"
)

// Sets up the router
func GetRouter() chi.Router {
	database.Migrate("../../migrations")

	log.Print("Starting HTTP server")

	dbConn := database.GetConnection()

	bookDB := database.BookDatabase{Conn: dbConn}

	// Set up the controller, which receives and responds to HTTP requests
	bookController := BookController{Books: bookDB}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(15 * time.Second))

	r.Route("/books", func(r chi.Router) {
		// "localhost:8080/books/{id}/{lang}
		r.Get("/{id}/{lang}", bookController.GetBookDetails)

		// "localhost:8080/books/
		r.Get("/", bookController.GetBookList)
	})

	return r
}
