package models

import (
	"time"
)

type TabContent struct {
	Video *string `json:"video"`
	Body  string  `json:"body"`
}

// Contains the contents of a book (all book information)
type BookDetails struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	Author    string     `json:"author"`
	Image     *string    `json:"image"` // image link
	Read      TabContent `json:"read"`
	Explore   TabContent `json:"explore"`
	Learn     TabContent `json:"learn"`
	CreatedAt time.Time  `json:"created_at"` // Following ISO 8601
}

// For main page listings
type Book struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	Image     *string   `json:"image"`      // image link
	CreatedAt time.Time `json:"created_at"` // Following ISO 8601
    Languages []string  `json:"languages"`  // Array of languages
}
