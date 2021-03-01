package database

import (
	"context"

	"github.com/jackc/pgx"
	"github.com/pkg/errors"

	"github.com/TritonSE/words-alive/internal/models"
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

	var query string = "SELECT books.id, title, author, image, created_at, " +
		"array_agg(lang) FROM books LEFT JOIN book_contents ON books.id = " +
		"book_contents.id GROUP BY books.id ORDER BY title"

	rows, err := db.Conn.QueryEx(ctx, query, nil)
	if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM books in FetchBookList")
	}

	defer rows.Close()

	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Image,
			&book.CreatedAt, &book.Languages); err != nil {
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
func (db *BookDatabase) FetchBookDetails(ctx context.Context,
	id string, lang string) (*models.BookDetails, bool, error) {

	var book models.BookDetails

	var query string = "SELECT books.id, title, author, image, " +
		"created_at, read_video, read_body, explore_video, explore_body, " +
		"learn_video, learn_body FROM books LEFT JOIN book_contents ON " +
		"books.id = book_contents.id WHERE books.id = $1 AND lang = $2"
	rows, err := db.Conn.QueryEx(ctx, query, nil, id, lang)
	if err != nil {
		return &book, false, errors.Wrap(err, "error on query for book details")
	}

	defer rows.Close()

	if !rows.Next() {
		// Check if user has selected a wrong language
		var count int
		var queryID string = "SELECT count(*) FROM book_contents WHERE " +
			"id = $1"

		err = db.Conn.QueryRowEx(ctx, queryID, nil, id).Scan(&count)

		if err != nil {
			return nil, false, errors.Wrap(err, "error on scan for ID")
		}

		return nil, count > 0, nil
	}

	err = rows.Scan(&book.ID, &book.Title, &book.Author, &book.Image,
		&book.CreatedAt, &book.Read.Video, &book.Read.Body, &book.Explore.Video,
		&book.Explore.Body, &book.Learn.Video, &book.Learn.Body)

	if err != nil {
		return &book, false, errors.Wrap(err, "error on Scan into book details")
	}

	return &book, false, nil
}
