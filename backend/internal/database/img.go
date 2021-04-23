package database

import (
	"bytes"
	"context"
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

/*
 * Gets an image from the image table given the id. If image exists, returns the binary data of the image
 */
func (db *ImgDatabase) GetImage(ctx context.Context, id string) (*[]byte, string, error) {
	var img []byte
	var ctype string
	var query string = "SELECT img, mime_type FROM images WHERE id=$1"

	row := db.Conn.QueryRow(ctx, query, id)

	err := row.Scan(&img, &ctype)

	if err != nil {
		// check for error message b/c sql.ErrNoRows is not the same as the error returned
		// when image cannot be found in the database
		if err.Error() == "no rows in result set" {
			return nil, "", nil
		}

		return nil, "", errors.Wrap(err, "error in SELECT")
	}

	return &img, "", nil

}

/*
 * Puts an image into the image table and returns id (generated using blurhash) and
 * a boolean specifying if an image was entered into the db. If the image
 * already exists, returns hash of pre-existing image
 */
func (db *ImgDatabase) InsertImage(ctx context.Context, body []byte, content_type string) (*string, bool, error) {

	var query string = "INSERT INTO images (id, img, mime_type) VALUES ($1, $2, $3)"

	// get the image into jpg/png form
	img, _, err := image.Decode(bytes.NewReader(body))

	if err != nil {
		return nil, false, errors.Wrap(err, "error on decoding image")
	}

	// encode using blurhash
	hash, err := blurhash.Encode(4, 4, img)

	if err != nil {
		return nil, false, errors.Wrap(err, "error on encoding with blurhash")
	}

	// check if image already exists
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
