-- +goose Up

ALTER TABLE books RENAME TO book_info;

CREATE VIEW books AS (
    SELECT book_info.*, array_remove(array_agg(book_contents.lang), NULL) AS languages
    FROM book_info
    LEFT JOIN book_contents ON book_info.id = book_contents.id
    GROUP BY book_info.id
);

-- +goose Down

DROP VIEW IF EXISTS books;
ALTER TABLE book_info RENAME TO books;
