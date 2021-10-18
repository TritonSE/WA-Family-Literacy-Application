-- +goose Up
-- +goose StatementBegin
ALTER TABLE admins ADD can_access_analytics boolean NOT NULL DEFAULT false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE admins DROP COLUMN can_access_analytics;
-- +goose StatementEnd
