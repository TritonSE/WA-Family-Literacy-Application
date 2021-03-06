package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx"
	"github.com/pkg/errors"

	"github.com/TritonSE/words-alive/internal/models"
)

type BookDatabase struct {
	Conn *pgx.Conn
}

type APICreateBook struct {
	Title  string  `json:"title"`
	Author string  `json:"author"`
	Image  *string `json:"image"`
}

type APICreateBookContents struct {
	Language string            `json:"lang"`
	Read     models.TabContent `json:"read"`
	Explore  models.TabContent `json:"explore"`
	Learn    models.TabContent `json:"learn"`
}

type APIUpdateTabContents struct {
	Video *string `json:"video"`
	Body  *string `json:"body"`
}

type APIUpdateBook struct {
	Title  *string `json:"title"`
	Author *string `json:"author"`
	Image  *string `json:"image"`
}

type APIUpdateBookDetails struct {
	Language *string              `json:"language"`
	Read     APIUpdateTabContents `json:"read"`
	Explore  APIUpdateTabContents `json:"explore"`
	Learn    APIUpdateTabContents `json:"learn"`
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
			fmt.Print(err)
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

func (db *BookDatabase) InsertBook(ctx context.Context, book APICreateBook) (models.Book, error) {
	var newBook models.Book
	var query string = "INSERT INTO books (title, author, image) VALUES ($1, $2, $3) RETURNING " +
		"id, title, author, image, created_at;"
	err := db.Conn.QueryRowEx(ctx, query, nil, book.Title, book.Author, book.Image).Scan(&newBook.ID,
		&newBook.Title, &newBook.Author, &newBook.Image, &newBook.CreatedAt)

	if err != nil {
		fmt.Printf("Error: %s\n", err)

		return newBook, errors.Wrap(err, "error on INSERT INTO books in InsertBook")
	}

	newBook.Languages = []string{}

	return newBook, nil

}

func (db *BookDatabase) InsertBookDetails(ctx context.Context, id string, book APICreateBookContents) (models.BookDetails, error) {
	var newBookDetail models.BookDetails
	var query string = "INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) " +
		"RETURNING id, lang"

	// scan called here without argument to free up connection
	// https://stackoverflow.com/questions/47706147/how-to-reuse-a-single-postgres-db-connection-for-row-inserts-in-go
	err := db.Conn.QueryRowEx(ctx, query, nil, id, book.Language, book.Read.Video, book.Read.Body,
		book.Explore.Video, book.Explore.Body, book.Learn.Video, book.Learn.Body).Scan()

	query = "SELECT books.id, title, author, image, " +
		"created_at, read_video, read_body, explore_video, explore_body, " +
		"learn_video, learn_body FROM books LEFT JOIN book_contents ON " +
		"books.id = book_contents.id WHERE books.id = $1 AND lang = $2"

	err = db.Conn.QueryRowEx(ctx, query, nil, id, book.Language).
		Scan(&newBookDetail.ID, &newBookDetail.Title, &newBookDetail.Author, &newBookDetail.Image, &newBookDetail.CreatedAt,
			&newBookDetail.Read.Video, &newBookDetail.Read.Body, &newBookDetail.Explore.Video,
			&newBookDetail.Explore.Body, &newBookDetail.Learn.Video, &newBookDetail.Learn.Body)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return newBookDetail, errors.Wrap(err, "error on query for book details")
	}

	return newBookDetail, nil
}

func (db *BookDatabase) DeleteBookContent(ctx context.Context, id string, lang string) error {
	var query string = "DELETE from book_contents WHERE id = $1 AND lang = $2"

	commandTag, err := db.Conn.Exec(query, id, lang)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return errors.Wrap(err, "error on delete from book_contents")
	}

	if commandTag.RowsAffected() != 1 {
		fmt.Printf("Error: %s\n", commandTag)
		return errors.New("No row found to delete")
	}

	query = "SELECT COUNT(*) FROM book_contents WHERE id = $1"
	var count int
	err = db.Conn.QueryRowEx(ctx, query, nil, id).Scan(&count)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return errors.Wrap(err, "error reading back data in delete from book_contents")
	}

	if count == 0 {
		err = db.DeleteBookWithID(ctx, id)
		if err != nil {
			return errors.Wrap(err, "error on deleting book with no language")
		}
	}

	return nil
}

func (db *BookDatabase) DeleteBookWithID(ctx context.Context, id string) error {
	var query string = "DELETE from books WHERE id = $1"

	commandTag, err := db.Conn.Exec(query, id)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return errors.Wrap(err, "error on delete from book")
	}

	if commandTag.RowsAffected() != 1 {
		return errors.New("No row found to delete")
	}

	return nil
}

func (db *BookDatabase) UpdateBookWithID(ctx context.Context, id string,
	updates APIUpdateBook) (models.Book, error) {
	var updatedBook models.Book
	var query string = "UPDATE books " +
		"SET title = COALESCE($1, title), " +
		"author = COALESCE($2, author), " +
		"image = COALESCE($3, image) " +
		"WHERE id = $4 RETURNING id, title, author, image, created_at"
	err := db.Conn.QueryRowEx(ctx, query, nil, updates.Title, updates.Author,
		updates.Image, id).Scan(&updatedBook.ID, &updatedBook.Title, &updatedBook.Author, &updatedBook.Image,
		&updatedBook.CreatedAt)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return updatedBook, errors.Wrap(err, "error on update book")
	}

	query = "SELECT lang FROM book_contents WHERE id = $1"
	rows, err := db.Conn.QueryEx(ctx, query, nil, id)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return updatedBook, errors.Wrap(err, "error on selecting languages on update book")
	}

	defer rows.Close()

	for rows.Next() {
		var lang string
		rows.Scan(&lang)
		updatedBook.Languages = append(updatedBook.Languages, lang)
	}

	if rows.Err() != nil {
		fmt.Printf("Error: %s\n", err)
		return updatedBook, errors.Wrap(err, "error on row iteration in update book")
	}

	return updatedBook, nil

}

func (db *BookDatabase) UpdateBookDetails(ctx context.Context, id string,
	lang string, book APIUpdateBookDetails) (models.BookDetails, error) {
	var updatedBookDetails models.BookDetails
	var updatedLanguage string
	var query string = "UPDATE book_contents " +
		" SET lang = COALESCE($1, lang), " +
		"read_video = COALESCE($2, read_video), " +
		"read_body = COALESCE($3, read_body), " +
		"explore_video = COALESCE($4, explore_video), " +
		"explore_body = COALESCE($5, explore_body), " +
		"learn_video = COALESCE($6, learn_video), " +
		"learn_body = COALESCE($7, learn_body) " +
		"WHERE id = $8 AND lang = $9 " +
		"RETURNING lang"

	err := db.Conn.QueryRowEx(ctx, query, nil, book.Language, book.Read.Video, book.Read.Body,
		book.Explore.Video, book.Explore.Body, book.Learn.Video, book.Learn.Body,
		id, lang).Scan(&updatedLanguage)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return updatedBookDetails, errors.Wrap(err, "error on updating book_contents")
	}

	query = "SELECT books.id, title, author, image, " +
		"created_at, read_video, read_body, explore_video, explore_body, " +
		"learn_video, learn_body FROM books LEFT JOIN book_contents ON " +
		"books.id = book_contents.id WHERE books.id = $1 AND lang = $2"

	err = db.Conn.QueryRowEx(ctx, query, nil, id, updatedLanguage).Scan(&updatedBookDetails.ID,
		&updatedBookDetails.Title, &updatedBookDetails.Author, &updatedBookDetails.Image,
		&updatedBookDetails.CreatedAt, &updatedBookDetails.Read.Video, &updatedBookDetails.Read.Body,
		&updatedBookDetails.Explore.Video, &updatedBookDetails.Explore.Body, &updatedBookDetails.Learn.Video,
		&updatedBookDetails.Learn.Body)

	if err != nil {
		fmt.Printf("Error: %s\n", err)
		return updatedBookDetails, errors.Wrap(err, "error on reading back from book_contents on update book_details")

	}

	return updatedBookDetails, nil

}

// func (db* BookDatabase) DeleteBook(ctx context.Context, id string) ()
