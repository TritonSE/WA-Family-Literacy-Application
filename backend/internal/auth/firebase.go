package auth

import (
	"context"
	"fmt"

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

func (a FirebaseAuthenticator) GenerateToken(ctx context.Context, email string, pwd string) (string, error) {
	// Populate struct with fields for user creation
	var u *auth.UserToCreate
	u = u.Email(email)
	u = u.Password(pwd)

	// Create User
	ur, err := a.Client.CreateUser(ctx, u)
	if err != nil {
		fmt.Println(err)
		return "", errors.Wrap(err, "Error in Firebase CreateUser")
	}

	// Return UID from UserRecord
	return ur.UserInfo.UID, nil
}
