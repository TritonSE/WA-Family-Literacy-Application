package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	chiMW "github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/controllers/middleware"
	"github.com/TritonSE/words-alive/internal/database"
)

// Sets up the router
func GetRouter(authenticator auth.Authenticator) chi.Router {
	log.Print("Starting HTTP server")

	dbConn := database.GetConnection()

	bookDB := database.BookDatabase{Conn: dbConn}
	userDB := database.UserDatabase{Conn: dbConn}

	// Set up the controller, which receives and responds to HTTP requests
	bookController := BookController{Books: bookDB}
	userController := UserController{Users: userDB}

	r := chi.NewRouter()
	r.Use(chiMW.Logger)
	r.Use(chiMW.Recoverer)
	r.Use(chiMW.Timeout(15 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Authorization"},
	}))

	r.Get("/ping", ping)

	r.Route("/books", func(r chi.Router) {
		// "localhost:8080/books/
		r.Get("/", bookController.GetBookList)

		// "localhost:8080/books/{id}/{lang}
		r.Get("/{id}/{lang}", bookController.GetBookDetails)

		r.Post("/", bookController.CreateBook)

		r.Post("/{id}", bookController.CreateBookDetail)

		r.Delete("/{id}", bookController.DeleteBook)

		r.Delete("/{id}/{lang}", bookController.DeleteBookDetail)

		r.Patch("/{id}", bookController.UpdateBook)

		r.Patch("/{id}/{lang}", bookController.UpdateBookDetails)
	})

	r.With(middleware.RequireAuth(authenticator)).Post("/users", userController.CreateUser)
	r.With(middleware.RequireAuth(authenticator)).Get("/users/{id}", userController.GetUser)
	r.With(middleware.RequireAuth(authenticator)).Patch("/users/{id}", userController.UpdateUser)

	return r
}

// GET /ping handler, for a very simple health check
func ping(rw http.ResponseWriter, _ *http.Request) {
	writeResponse(rw, http.StatusOK, "pong!")
}
