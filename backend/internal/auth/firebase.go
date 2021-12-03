package auth

import (
	"context"
	"log"

	"firebase.google.com/go/v4/auth"
	"github.com/pkg/errors"
)

type FirebaseAuthenticator struct {
	Client auth.Client
}

/*
 * Firebase client verifies the token, ensures JWT is signed and valid for
 * our Firebase project. Returns the UID in of the user
 */
func (a FirebaseAuthenticator) VerifyToken(ctx context.Context, token string) (string, bool) {
	result, err := a.Client.VerifyIDToken(ctx, token)
	if err != nil {
		return "", false
	}
	return result.UID, true
}

func (a FirebaseAuthenticator) CreateUser(ctx context.Context, email string, pwd string) (string, error) {
	// Populate struct with fields for user creation
	var user auth.UserToCreate
	u := &user
	u = u.Email(email)
	u = u.Password(pwd)

	// Create User
	ur, err := a.Client.CreateUser(ctx, u)
	if err != nil {
		log.Println(err)
		return "", errors.Wrap(err, "Error in Firebase CreateUser")
	}

	// Return UID from UserRecord
	return ur.UserInfo.UID, nil
}

func (a FirebaseAuthenticator) DeleteUser(ctx context.Context, id string) error {
	return a.Client.DeleteUser(ctx, id)
}

func (a FirebaseAuthenticator) SetCustomUserClaims(ctx context.Context, id string, claims map[string]interface{}) error {
	return a.Client.SetCustomUserClaims(ctx, id, claims)
}
