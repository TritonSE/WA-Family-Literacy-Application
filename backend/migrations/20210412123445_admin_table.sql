-- +goose Up
CREATE TABLE admins(
    id    text PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    can_manage_users boolean,
    can_upload_books boolean,
    can_delete_books boolean,
    is_primary_admin boolean
);

-- +goose Down
DROP TABLE admins;
