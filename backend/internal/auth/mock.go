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
