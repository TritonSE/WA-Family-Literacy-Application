-- +goose Up
-- +goose StatementBegin
CREATE TABLE book_analytics (
    id    text PRIMARY KEY,
    clicks integer[],
    last_updated timestamptz NOT NULL DEFAULT now(),
    FOREIGN key (id) REFERENCES books(id) ON DELETE CASCADE
);
INSERT INTO book_analytics (id, clicks) SELECT id, ARRAY_FILL(0, array[366]) FROM books;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE book_analytics;
-- +goose StatementEnd
