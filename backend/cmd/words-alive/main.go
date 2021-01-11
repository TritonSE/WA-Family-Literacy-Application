package main

import (
	"log"
	"net/http"
	"time"

    "github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {
	database.Migrate("./migrations")

	log.Print("Starting HTTP server")

    dbConn := database.GetConnection()

	bookDB := database.BookDatabase{Conn: dbConn}

	// Set up the controller, which receives and responds to HTTP requests
	bookController := controllers.BookController{Books: bookDB}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(15 * time.Second))

    r.Get("/books", bookController.GetBookList);
    r.Get("/books/:id", bookController.GetBookByID);

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting http server: %v", err)
	}
}
