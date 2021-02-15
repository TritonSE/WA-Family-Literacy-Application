package database

import (
	"context"
    "fmt"

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

    var query string = "SELECT books.id, title, author, image, created_at, "+
        "array_agg(lang) FROM books LEFT JOIN book_contents ON books.id = " +
        "book_contents.id GROUP BY books.id ORDER BY title"

	rows, err := db.Conn.QueryEx(ctx, query, nil)
	if err != nil {
        fmt.Printf("Error: %s\n", err)
		return nil, errors.Wrap(err, "error on SELECT FROM books in FetchBookList")
	}

	defer rows.Close()

	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Image,
			&book.CreatedAt, &book.Languages); err != nil {
            fmt.Printf("Error: %s\n", err)
			return nil, errors.Wrap(err, "error scanning result of"+
				" SELECT FROM books in FetchBookList")
		}

        fmt.Printf("Book: %s, available in:\n", book.Title)
        fmt.Println(book.Languages);
		books = append(books, book)
	}

	return books, nil
}

/*
 * Fetch a full book including all read/explore/learn content
 * For use after a user has selected a book to read
 */
func (db *BookDatabase) FetchBookDetailsByID(ctx context.Context,
	id string, lang string) (models.BookDetails, error) {

	var book models.BookDetails

	var query string = "SELECT id, title, author, image, " +
		"created_at FROM books WHERE id = $1"

    var queryContent string = "SELECT read_video, read_body, explore_video, " +
        "explore_body, learn_video, learn_body FROM book_contents WHERE id " +
        "= $1 AND lang = $2"

	err := db.Conn.QueryRowEx(ctx, query, nil, id).Scan(
		&book.ID, &book.Title, &book.Author, &book.Image,
		&book.CreatedAt)

	if err != nil {
		return book, errors.Wrap(err, "error on SELECT FROM books in FetchBookByID")
	}

	err = db.Conn.QueryRowEx(ctx, queryContent, nil, id, lang).Scan(
        &book.Read.Video, &book.Read.Body, &book.Explore.Video, &book.Explore.Body,
        &book.Learn.Video, &book.Learn.Body)

	if err != nil {
		return book, errors.Wrap(err, "error on SELECT FROM books in FetchBookByID")
	}

	return book, nil
}

/*
 * Check for existence of a book with the specified id
 */
func (db *BookDatabase) CheckBookID(ctx context.Context, id string,
        lang string) (bool, error) {

    var count int

    var query string = "SELECT COUNT(*) FROM book_contents WHERE id = $1 AND lang = $2"

    err := db.Conn.QueryRowEx(ctx, query, nil, id, lang).Scan(&count)

    if err != nil {
        fmt.Printf("Error: %s\n", err)
        return false, errors.Wrap(err, "error on SELECT COUNT FROM books in CheckBookID")
    }
    fmt.Printf("No errors, returning\n")

    return count == 1, nil
}
