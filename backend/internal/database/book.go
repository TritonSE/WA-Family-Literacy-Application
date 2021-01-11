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
    // Only need image, id for the main page
    rows, err := db.Conn.QueryEx(ctx, "SELECT id, title, author, image, created_at FROM books", nil)
    if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM books in FetchBookList")
	}

    defer rows.Close();

    // Define our list of books to return
	books := make([]models.Book, 0)

	// Loop over all of the rows that were returned (one for each book in the database)
	for rows.Next() {
		// Create a new book object, then "scan" the column values from the row into the struct.
		var book models.Book
		// Pay attention to the order, since we did SELECT id, title, we need to scan the ID before the Title
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Image, &book.Created_At); err != nil {
			return nil, errors.Wrap(err, "error scanning result of SELECT FROM books in FetchBookList")
		}
		// Add the book to the result
		books = append(books, book)
	}

	return books, nil
}

/*
 * Fetch a full book including all read/explore/learn content
 * For use after a user has selected a book to read
 */
func (db *BookDatabase) FetchBookByID (ctx context.Context, id string) (models.Book, error) {

    var book models.Book

    err := db.Conn.QueryRowEx(ctx, "SELECT * FROM books WHERE id = $1", nil, id).Scan(
            &book.ID, &book.Title, &book.Author, &book.Image, &book.Read, &book.Explore,
            &book.Learn, &book.Created_At)

    if err != nil {
        return book, errors.Wrap(err, "error on SELECT FROM books in FetchBookByID")
    }

    return book, nil
}

