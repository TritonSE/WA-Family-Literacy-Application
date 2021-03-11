package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	chiMW "github.com/go-chi/chi/middleware"

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
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			next.ServeHTTP(w, req)
		})
	})

	r.Route("/books", func(r chi.Router) {
		// "localhost:8080/books/{id}/{lang}
		r.Get("/{id}/{lang}", bookController.GetBookDetails)

		// "localhost:8080/books/
		r.Get("/", bookController.GetBookList)
	})

	//authenticator := auth.MockAuthenticator{}
	r.With(middleware.RequireAuth(authenticator)).Post("/users", userController.CreateUser)
	r.With(middleware.RequireAuth(authenticator)).Get("/users/{id}", userController.GetUser)
	r.With(middleware.RequireAuth(authenticator)).Put("/users/{id}", userController.UpdateUser)

	return r
}
