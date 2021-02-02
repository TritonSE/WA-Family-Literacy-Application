package models

import (
	"github.com/jackc/pgtype"
)

// Contains the contents of a book (all book information)
type BookDetails struct {
	ID            string             `json:"id"`
	Title         string             `json:"title"`
	Author        string             `json:"author"`
	Image         *string            `json:"image"`         // image link
	Read_Video    *string            `json:"read_video"`    // youtube link
	Read_Body     *string            `json:"read_body"`     // markdown
	Explore_Video *string            `json:"explore_video"` // youtube link
	Explore_Body  *string            `json:"explore_body"`  // markdown
	Learn_Video   *string            `json:"learn_video"`   // youtube link
	Learn_Body    *string            `json:"learn_body"`    // markdown
	Created_At    pgtype.Timestamptz `json:"created_at"`    // Following ISO 8601
}

// For main page listings
type Book struct {
	ID         string             `json:"id"`
	Title      string             `json:"title"`
	Author     string             `json:"author"`
	Image      *string            `json:"image"`      // image link
	Created_At pgtype.Timestamptz `json:"created_at"` // Following ISO 8601
}
