-- +goose Up
-- SQL in this section is executed when the migration is applied.
CREATE TABLE books(
	id text,
	title text,
	author text,
	image text,
	read text,
	explore text,
	learn text,
	created_at text
);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE books;
