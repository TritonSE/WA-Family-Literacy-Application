-- +goose Up
-- +goose StatementBegin
CREATE TABLE book_analytics (
    id    text PRIMARY KEY,
    clicks integer[] NOT NULL DEFAULT ARRAY_FILL(0, array[366]),
    last_updated timestamptz NOT NULL DEFAULT now(),
    FOREIGN key (id) REFERENCES books(id) ON DELETE CASCADE
);
INSERT INTO book_analytics (id) SELECT id FROM books;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE book_analytics;
-- +goose StatementEnd
