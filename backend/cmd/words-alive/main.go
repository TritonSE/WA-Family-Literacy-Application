package main

import (
	"log"
	"net/http"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
)

func main() {
	// Migrate database
	database.Migrate("./migrations")

	// TODO: Set up Firebase Project
	// Start API server
	authenticator := auth.MockAuthenticator{}
	r := controllers.GetRouter(authenticator)
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting http server: %v", err)
	}
}
