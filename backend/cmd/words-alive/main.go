package main

import (
	"github.com/TritonSE/words-alive/internal/database"
	"log"
	"net/http"

	"github.com/TritonSE/words-alive/internal/controllers"
)

func main() {
	database.Migrate("./migrations")

	// Get router and start server
	r := controllers.GetRouter()
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("error starting http server: %v", err)
	}
}
