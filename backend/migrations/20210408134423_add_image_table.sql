-- +goose Up
-- +goose StatementBegin
CREATE TABLE image (
    id text PRIMARY KEY DEFAULT gen_random_uuid(),
    img bytea NOT NULL,
    mime_type text not NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE image
-- +goose StatementEnd
