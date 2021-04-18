package database

import (
	"bytes"
	"context"
	"fmt"
	"image"

	_ "image/jpeg"
	_ "image/png"

	"github.com/buckket/go-blurhash"
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

func (db *ImgDatabase) InsertImage(ctx context.Context, body []byte, content_type string) (*string, bool, error) {

	var query string = "INSERT INTO image (id, img, mime_type) VALUES ($1, $2, $3)"

	img, _, err := image.Decode(bytes.NewReader(body))

	if err != nil {
		fmt.Print(err)
		return nil, false, errors.Wrap(err, "error on decoding image")
	}

	hash, err := blurhash.Encode(4, 3, img)

	if err != nil {
		fmt.Print(err)
		return nil, false, errors.Wrap(err, "error on encoding with blurhash")
	}

	storedImage, _, _ := db.GetImage(ctx, hash)

	if storedImage != nil {
		return &hash, false, nil
	}

	_, err = db.Conn.Exec(ctx, query, hash, body, content_type)
	if err != nil {
		return nil, false, errors.Wrap(err, "error in INSERT")
	}

	return &hash, true, nil
}
