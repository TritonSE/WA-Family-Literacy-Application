-- +goose Up
-- +goose StatementBegin
ALTER TABLE books DROP COLUMN read_video;
ALTER TABLE books DROP COLUMN read_body;
ALTER TABLE books DROP COLUMN explore_video;
ALTER TABLE books DROP COLUMN explore_body;
ALTER TABLE books DROP COLUMN learn_video;
ALTER TABLE books DROP COLUMN learn_body;

CREATE TABLE book_contents(
    id              text NOT NULL,
    lang            text NOT NULL,
	read_video      text,        -- video link
	read_body       text NOT NULL,
	explore_video   text,     -- video link
	explore_body    text NOT NULL,
	learn_video     text,       -- video link
	learn_body      text NOT NULL,
    PRIMARY KEY (id, lang)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE books ADD COLUMN read_video text;
ALTER TABLE books ADD COLUMN read_body text NOT NULL;
ALTER TABLE books ADD COLUMN explore_video text;
ALTER TABLE books ADD COLUMN explore_body text NOT NULL;
ALTER TABLE books ADD COLUMN learn_video text;
ALTER TABLE books ADD COLUMN learn_body text NOT NULL;

DROP TABLE book_contents;
-- +goose StatementEnd
