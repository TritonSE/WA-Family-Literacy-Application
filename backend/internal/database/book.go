package database

import (
	"context"

	"github.com/TritonSE/words-alive/internal/models"
	"github.com/jackc/pgx"
	"github.com/pkg/errors"
)

type BookDatabase struct {
	Conn *pgx.Conn
}

/*
 * Get book list for the main page
 * Only need to show previews (no read/explore/learn)
 */
func (db *BookDatabase) FetchBookList(ctx context.Context) ([]models.Book, error) {

	books := make([]models.Book, 0)

	var query string = "SELECT id, title, author, image, created_at FROM " +
		"books ORDER BY title"

	rows, err := db.Conn.QueryEx(ctx, query, nil)
	if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM books in FetchBookList")
	}

	defer rows.Close()

	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Image,
			&book.CreatedAt); err != nil {
			return nil, errors.Wrap(err, "error scanning result of"+
				" SELECT FROM books in FetchBookList")
		}
		books = append(books, book)
	}

	return books, nil
}

/*
 * Fetch a full book including all read/explore/learn content
 * For use after a user has selected a book to read
 */
func (db *BookDatabase) FetchBookDetailsByID(ctx context.Context,
	id string) (models.BookDetails, error) {

	var book models.BookDetails
	var read, explore, learn models.TabContent

	var query string = "SELECT id, title, author, image, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body," +
		"created_at FROM books WHERE id = $1"

	err := db.Conn.QueryRowEx(ctx, query, nil, id).Scan(
		&book.ID, &book.Title, &book.Author, &book.Image, &read.Video,
		&read.Body, &explore.Video, &explore.Body,
		&learn.Video, &learn.Body, &book.CreatedAt)

	if err != nil {
		return book, errors.Wrap(err, "error on SELECT FROM books in FetchBookByID")
	}

	book.Read = &read
	book.Explore = &explore
	book.Learn = &learn

	return book, nil
}
