-- +goose Up
-- SQL in this section is executed when the migration is applied.
-- setup/teardown file
CREATE TABLE users (
    id    text PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    in_san_diego boolean NOT NULL DEFAULT FALSE
);
-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE users;