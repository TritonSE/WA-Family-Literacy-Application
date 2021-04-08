package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"
)

type ImgDatabase struct {
	Conn *pgxpool.Pool
}

func (db *ImgDatabase) InsertImage(ctx context.Context, body []byte, content_type string) (*string, error) {
	var query string = "INSERT INTO image (img, mime_type) VALUES ($1, $2) RETURNING id"
	var url string
	err := db.Conn.QueryRow(ctx, query, body, content_type).Scan(&url)
	if err != nil {
		fmt.Print(err)
		return nil, errors.Wrap(err, "error in INSERT")
	}

	return &url, nil
}
