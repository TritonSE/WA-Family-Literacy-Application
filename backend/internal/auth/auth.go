package auth

import (
	"context"
)

/*
 * Authenticator interface that middleware will use to ensure user has
 * access to the routes they're accessing.
 * Main function is VerifyToken, which will be a mock token for now
 * After Firebase is set up, this will be implemented by the Firebase client
 */
type Authenticator interface {
	VerifyToken(ctx context.Context, token string) (string, bool)
}
