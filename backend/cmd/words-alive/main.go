package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/utils"
)

func main() {
	// Migrate database
	database.Migrate("./migrations")

	// TODO: Set up Firebase Project
	// Start API server
	authenticator := auth.MockAuthenticator{}
	r := controllers.GetRouter(authenticator)

	addr := fmt.Sprintf("0.0.0.0:%s", utils.GetEnv("PORT", "8080"))
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("error starting http server: %v", err)
	}
}
