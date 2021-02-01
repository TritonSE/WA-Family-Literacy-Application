-- +goose Up
-- SQL in this section is executed when the migration is applied.
CREATE TABLE books(
	id text PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	author text NOT NULL,
	image text,             -- image link
	read_video text,        -- video link
	read_body text,
	explore_video text,     -- video link
	explore_body text,
	learn_video text,       -- video link
	learn_body text,
	created_at timestamptz NOT NULL DEFAULT now()
);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE books;
