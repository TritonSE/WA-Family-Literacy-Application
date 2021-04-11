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

func (db *ImgDatabase) GetImage(ctx context.Context, id string) (*[]byte, *string, error) {
	var img []byte
	var ctype string
	var query string = "SELECT img, mime_type FROM image WHERE id=$1"

	err := db.Conn.QueryRow(ctx, query, id).Scan(&img, &ctype)

	if err != nil {
		fmt.Print(err)
		return nil, nil, errors.Wrap(err, "error in SELECT")
	}

	return &img, &ctype, nil

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
