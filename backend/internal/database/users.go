package database

import (
	"context"
    "fmt"

	"github.com/jackc/pgx"
	"github.com/pkg/errors"

	"github.com/TritonSE/words-alive/internal/models"
)

type UserDatabase struct {
	Conn *pgx.Conn
}

func (db *UserDatabase) CreateUser(ctx context.Context, user models.User) (string, error) {
	var id string

	err := db.Conn.QueryRowEx(ctx, "INSERT INTO users (id, name, email, in_san_diego) VALUES ($1, $2, $3, $4) RETURNING id",
            nil, user.ID, user.Name, user.Email, user.InSanDiego).Scan(&id)
	if err != nil {
		return "", errors.Wrap(err, "error on INSERT INTO users")
	}

	return id, nil
}

func (db *UserDatabase) FetchUserByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User

	rows, err := db.Conn.QueryEx(ctx, "SELECT id, name, email, in_san_diego FROM users WHERE id = $1", nil, id)
	if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM user")
	}
	defer rows.Close()
	if !rows.Next() {
		return nil, nil
	}
	rows.Scan(&user.ID, &user.Name, &user.Email, &user.InSanDiego)
	return &user, nil
}

func (db *UserDatabase) FetchUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User

	rows, err := db.Conn.QueryEx(ctx, "SELECT id, name, email, in_san_diego FROM users WHERE email = $1", nil, email)
	if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM user")
	}
	defer rows.Close()
	if !rows.Next() {
		return nil, nil
	}
	rows.Scan(&user.ID, &user.Name, &user.Email, &user.InSanDiego)

	return &user, nil
}

func (db *UserDatabase) UpdateUser(ctx context.Context, id string, user models.User) (error) {

    var query string = "UPDATE users SET " +
                        "name = COALESCE($1, name), " +
                        "in_san_diego = COALESCE($2, in_san_diego) " +
                        "WHERE id = $3"

    cmd, err := db.Conn.ExecEx(ctx, query,
                 nil, user.Name, user.InSanDiego, id)
    if err != nil {
        fmt.Printf("Error: %s\n", err)
        return errors.Wrap(err, "error on UPDATE users")
    }

    if cmd.RowsAffected() != 1 {
        return errors.New("No users to update")
    }

    return nil
}

func (db *UserDatabase) RemoveUser(ctx context.Context, user models.User) error {
	err := db.Conn.QueryRowEx(ctx, "DELETE FROM users WHERE id = ($1)", nil, user.ID)
	if err != nil {
		return nil
	}

	return nil
}
