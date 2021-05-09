package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go/v4"
	fbAuth "firebase.google.com/go/v4/auth"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
	"github.com/TritonSE/words-alive/internal/utils"
)

func main() {
	// Migrate database
	database.Migrate("./migrations")

	var authenticator auth.Authenticator

	if os.Getenv("DISABLE_AUTH") == "true" {
		log.Println(" *** WARNING: Admin and User authentication disabled - use Authorization header \"Bearer test-token-<uid>\" to authenticate requests")
		authenticator = auth.MockAuthenticator{}
	} else {
		authenticator = auth.FirebaseAuthenticator{Client: authClient()}
	}

	// Start API server
	r := controllers.GetRouter(authenticator)

	addr := fmt.Sprintf("0.0.0.0:%s", utils.GetEnv("PORT", "8080"))
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("error starting http server: %v", err)
	}
}

func authClient() fbAuth.Client {
	credentials, err := google.CredentialsFromJSON(context.Background(), []byte(os.Getenv("FIREBASE_CREDENTIALS_JSON")), "https://www.googleapis.com/auth/cloud-platform")
	if err != nil {
		log.Fatalf("unable to parse firebase credentials: %v\n", err)
	}
	app, err := firebase.NewApp(context.Background(), nil, option.WithCredentials(credentials))
	if err != nil {
		log.Fatalf("unable to create firebase app: %v\n", err)
	}
	authClient, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("unable to create firebase auth client: %v\n", err)
	}

	return *authClient
}
