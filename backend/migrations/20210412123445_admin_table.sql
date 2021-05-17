-- +goose Up
CREATE TABLE admins(
    id    text PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    can_manage_users boolean NOT NULL DEFAULT false,
    can_upload_books boolean NOT NULL DEFAULT false,
    can_edit_books   boolean NOT NULL DEFAULT false,
    can_delete_books boolean NOT NULL DEFAULT false,
    is_primary_admin boolean NOT NULL DEFAULT false
);

-- +goose Down
DROP TABLE admins;
