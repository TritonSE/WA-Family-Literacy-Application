-- +goose Up
-- +goose StatementBegin
CREATE TABLE images (
    id text PRIMARY KEY,
    img bytea NOT NULL,
    mime_type text not NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE images;
-- +goose StatementEnd
