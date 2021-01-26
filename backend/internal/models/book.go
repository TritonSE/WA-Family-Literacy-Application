package models

import (
	"github.com/jackc/pgtype"
)

type BookDetails struct {
	Read_Video  *string `json:"read_video"`  // youtube link
    Read_Body   *string `json:"read_body"`    // markdown
	Explore_Video  *string `json:"explore_video"`  // youtube link
    Explore_Body   *string `json:"explore_body"`    // markdown
	Learn_Video  *string `json:"learn_video"`  // youtube link
    Learn_Body   *string `json:"learn_body"`    // markdown
}

type Book struct {
    ID         string     `json:"id"`
    Title      string     `json:"title"`
    Author     string     `json:"author"`
    Image      *string     `json:"image"`       // image link
	Details		BookDetails		`json:"details"`
    Created_At pgtype.Timestamptz     `json:"created_at"`   // Following ISO 8601
}
