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
	"github.com/TritonSE/words-alive/internal/models"
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
	bookController := BookController{Books: bookDB, Auth: authenticator}
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
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
	}))

	r.Get("/ping", ping)

	r.Route("/books", func(r chi.Router) {
		r.Get("/", bookController.GetBookList)

		r.Get("/popular", bookController.GetPopularBooks)

		r.Get("/{id}", bookController.GetBook)

		r.Get("/{id}/{lang}", bookController.GetBookDetails)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanUploadBooks)).
			Post("/", bookController.CreateBook)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanUploadBooks)).
			Post("/{id}", bookController.CreateBookDetail)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanDeleteBooks)).
			Delete("/{id}", bookController.DeleteBook)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanDeleteBooks)).
			Delete("/{id}/{lang}", bookController.DeleteBookDetail)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanEditBooks)).
			Patch("/{id}", bookController.UpdateBook)

		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanEditBooks)).
			Patch("/{id}/{lang}", bookController.UpdateBookDetails)

		r.With(middleware.RequireAuth(authenticator)).
			Get("/favorites", bookController.GetFavorites)

		r.With(middleware.RequireAuth(authenticator)).
			Put("/favorites/{id}", bookController.AddToFavorites)

		r.With(middleware.RequireAuth(authenticator)).
			Delete("/favorites/{id}", bookController.DeleteFromFavorites)
	})

	r.Route("/images", func(r chi.Router) {
		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanUploadBooks)).
			Post("/", imageController.PostImage)

		r.Get("/{id}", imageController.GetImage)
	})

	r.Route("/analytics", func(r chi.Router) {
		r.Put("/{id}/inc", bookController.UpdateBookClicks)

		// /analytics?range=<days>
		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanAccessAnalytics)).
			Get("/", bookController.GetAllBookClicks)

		// "localhost:8080/analytics/{id}?range=<days>
		r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanAccessAnalytics)).Get("/{id}", bookController.GetBookClicks)
	})

	r.With(middleware.RequireAuth(authenticator)).Post("/users", userController.CreateUser)
	r.With(middleware.RequireAuth(authenticator)).Get("/users/{id}", userController.GetUser)
	r.With(middleware.RequireAuth(authenticator)).Patch("/users/{id}", userController.UpdateUser)
	r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanManageUsers)).
		Post("/admins", adminController.CreateAdmin)
	r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanManageUsers)).
		Get("/admins", adminController.GetAdminList)

	// WARNING: This route does NOT require CanManageUsers - we also need to allow admins to fetch their own account
	r.With(middleware.RequireAuth(authenticator)).
		Get("/admins/{id}", adminController.GetAdminByID)

	r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanManageUsers)).
		Patch("/admins/{id}", adminController.UpdateAdmin)
	r.With(middleware.RequireAuth(authenticator), middleware.RequirePermission(adminDB, models.CanManageUsers)).
		Delete("/admins/{id}", adminController.DeleteAdmin)
	return r
}

// GET /ping handler, for a very simple health check
func ping(rw http.ResponseWriter, _ *http.Request) {
	writeResponse(rw, http.StatusOK, "pong!")
}
