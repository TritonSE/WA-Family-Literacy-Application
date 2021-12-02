-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION last_n_days(
    arr integer[],
    days integer
) RETURNS integer[] AS $func$
DECLARE
    today integer;
    last_year integer;
BEGIN
    today := extract(doy from now());
    last_year := extract(year from now() - interval '1 year');
    IF days <= today THEN
        RETURN arr[today-days+1:today];
    END IF;
    IF (last_year % 4 = 0) THEN
        RETURN arr[366-days+today+1:] || arr[1:today];
    ELSE
        RETURN arr[365-days+today+1:365] || arr[1:today];
    END IF;
END;
$func$ LANGUAGE 'plpgsql';

CREATE OR REPLACE VIEW book_analytics_last_30 AS
    WITH last_30 AS (
        SELECT id, last_n_days(clicks, 30) AS clicks FROM book_analytics
    )
    SELECT id, clicks, (
        SELECT sum(v) AS total
        FROM UNNEST(clicks) WITH ORDINALITY a(v))
    FROM last_30;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION last_n_days;

DROP VIEW book_analytics_last_30;
-- +goose StatementEnd
