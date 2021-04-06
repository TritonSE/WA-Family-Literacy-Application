package database

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"

	"github.com/TritonSE/words-alive/internal/models"
)

type UserDatabase struct {
	Conn *pgxpool.Pool
}

// Adds a user to the database
func (db *UserDatabase) CreateUser(ctx context.Context, user models.User) error {
	_, err := db.Conn.Exec(ctx, "INSERT INTO users (id, name, email, in_san_diego) VALUES ($1, $2, $3, $4) RETURNING id", user.ID, user.Name, user.Email, user.InSanDiego)
	if err != nil {
		return errors.Wrap(err, "error in CreateUser")
	}

	return nil
}

// Fetches the user with the given ID from the database, returning nil if it is not found
func (db *UserDatabase) FetchUserByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User

	rows, err := db.Conn.Query(ctx, "SELECT id, name, email, in_san_diego FROM users WHERE id = $1", id)
	if err != nil {
		return nil, errors.Wrap(err, "error querying in FetchUserByID")
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}

	err = rows.Scan(&user.ID, &user.Name, &user.Email, &user.InSanDiego)
	if err != nil {
		return nil, errors.Wrap(err, "error scanning in FetchUserByID")
	}
	return &user, nil
}

// Fetches the user with the given email address from the database, returning nil if it is not found
func (db *UserDatabase) FetchUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User

	rows, err := db.Conn.Query(ctx, "SELECT id, name, email, in_san_diego FROM users WHERE email = $1", email)
	if err != nil {
		return nil, errors.Wrap(err, "error querying in FetchUserByEmail")
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}
	err = rows.Scan(&user.ID, &user.Name, &user.Email, &user.InSanDiego)
	if err != nil {
		return nil, errors.Wrap(err, "error querying in FetchUserByEmail")
	}

	return &user, nil
}

// Deletes the user with the given ID
func (db *UserDatabase) RemoveUser(ctx context.Context, user models.User) error {
	err := db.Conn.QueryRow(ctx, "DELETE FROM users WHERE id = $1", user.ID)
	if err != nil {
		return nil
	}

	return nil
}
