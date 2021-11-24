-- +goose Up
-- +goose StatementBegin
ALTER TABLE admins ADD COLUMN can_chat BOOL NOT NULL DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE admins DROP COLUMN can_chat;
-- +goose StatementEnd
