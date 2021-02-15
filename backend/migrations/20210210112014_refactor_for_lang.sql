-- +goose Up
-- +goose StatementBegin
ALTER TABLE books DROP COLUMN read_video;
ALTER TABLE books DROP COLUMN read_body;
ALTER TABLE books DROP COLUMN explore_video;
ALTER TABLE books DROP COLUMN explore_body;
ALTER TABLE books DROP COLUMN learn_video;
ALTER TABLE books DROP COLUMN learn_body;

CREATE TABLE book_contents(
    id text NOT NULL,
    lang text NOT NULL,
	read_video text,        -- video link
	read_body text,
	explore_video text,     -- video link
	explore_body text,
	learn_video text,       -- video link
	learn_body text,
    PRIMARY KEY (id, lang)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE books ADD read_video text;
ALTER TABLE books ADD read_body text;
ALTER TABLE books ADD explore_video text;
ALTER TABLE books ADD explore_body text;
ALTER TABLE books ADD learn_video text;
ALTER TABLE books ADD learn_body text;

DROP TABLE book_contents;
-- +goose StatementEnd
