-- +goose Up
-- +goose StatementBegin

CREATE TABLE favorite_books (
    user_id text REFERENCES users(id) ON DELETE CASCADE,
    book_id text REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, book_id) 
);

CREATE INDEX favorite_books_idx_user_id ON favorite_books(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX favorite_books_idx_user_id;
DROP TABLE favorite_books;
-- +goose StatementEnd
