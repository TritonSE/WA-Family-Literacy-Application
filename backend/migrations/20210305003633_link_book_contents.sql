-- +goose Up
-- +goose StatementBegin
ALTER TABLE book_contents ADD CONSTRAINT books_id FOREIGN key (id) REFERENCES books(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE book_contents DROP CONSTRAINT books_id;
-- +goose StatementEnd
