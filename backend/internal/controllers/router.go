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
	imageDB := database.ImgDatabase{Conn: dbConn}
	userDB := database.UserDatabase{Conn: dbConn}
	adminDB := database.AdminDatabase{Conn: dbConn}

	// Set up the controller, which receives and responds to HTTP requests
    bookController := BookController{Books: bookDB, Admins: adminDB}
	imageController := ImgController{Image: imageDB}
	userController := UserController{Users: userDB}
    adminController := AdminController{Admins: adminDB, Auth: authenticator}

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
		r.Get("/", bookController.GetBookList)

		r.Get("/{id}/{lang}", bookController.GetBookDetails)

		r.With(middleware.RequireAuth(authenticator)).Post("/", bookController.CreateBook)

		r.With(middleware.RequireAuth(authenticator)).Post("/{id}", bookController.CreateBookDetail)

		r.With(middleware.RequireAuth(authenticator)).Delete("/{id}", bookController.DeleteBook)

		r.With(middleware.RequireAuth(authenticator)).Delete("/{id}/{lang}", bookController.DeleteBookDetail)

		r.With(middleware.RequireAuth(authenticator)).Patch("/{id}", bookController.UpdateBook)

		r.With(middleware.RequireAuth(authenticator)).Patch("/{id}/{lang}", bookController.UpdateBookDetails)
	})

    r.Get("/admins", adminController.GetAdminList)

	r.Route("/image", func(r chi.Router) {
		r.Post("/", imageController.PostImage)

		r.Get("/{id}", imageController.GetImage)
	})

	r.With(middleware.RequireAuth(authenticator)).Post("/users", userController.CreateUser)
	r.With(middleware.RequireAuth(authenticator)).Get("/users/{id}", userController.GetUser)
	r.With(middleware.RequireAuth(authenticator)).Patch("/users/{id}", userController.UpdateUser)
	r.With(middleware.RequireAuth(authenticator)).Post("/admins", adminController.CreateAdmin)
    r.With(middleware.RequireAuth(authenticator)).Get("/admins", adminController.GetAdminList)
	r.With(middleware.RequireAuth(authenticator)).Get("/admins/{id}", adminController.GetAdminByID)
	r.With(middleware.RequireAuth(authenticator)).Patch("/admins/{id}", adminController.UpdateAdmin)
	r.With(middleware.RequireAuth(authenticator)).Delete("/admins/{id}", adminController.DeleteAdmin)
	return r
}

// GET /ping handler, for a very simple health check
func ping(rw http.ResponseWriter, _ *http.Request) {
	writeResponse(rw, http.StatusOK, "pong!")
}
