package auth

import (
	"context"
	"strings"
)

type MockAuthenticator struct{}

// This is an authenticator that takes tokens of the form test-token<user ID>
func (a MockAuthenticator) VerifyToken(ctx context.Context, token string) (string, bool) {
	if strings.HasPrefix(token, "test-token-") {
		return strings.TrimPrefix(token, "test-token-"), true
	}
	return "", false
}

func (a MockAuthenticator) CreateUser(ctx context.Context, email string, pwd string) (string, error) {

	// Set token to the part of the email before the @
	// EX: test1@test.com -> test1
	return strings.Split(email, "@")[0], nil
}

func (a MockAuthenticator) DeleteUser(ctx context.Context, id string) error {
	return nil
}

func (a MockAuthenticator) SetCustomUserClaims(ctx context.Context, id string, claims map[string]interface{}) error {
	return nil
}
