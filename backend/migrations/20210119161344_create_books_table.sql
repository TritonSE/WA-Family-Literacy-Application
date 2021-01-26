-- +goose Up
-- SQL in this section is executed when the migration is applied.
CREATE TABLE books(
	id text PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	author text NOT NULL,
	image text,
	read_video text,
	read_body text,
	explore_video text,
	explore_body text,
	learn_video text,
	learn_body text,
	created_at timestamptz NOT NULL DEFAULT now()
);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE books;
