// models/book.go
package models

import "time"

// Book represents a book in our library system.
// JSON tags control how fields appear in API responses.
type Book struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	ISBN      string    `json:"isbn"`
	Published time.Time `json:"published"`
	CreatedAt time.Time `json:"created_at"`
}

// BookRequest is used for creating and updating books.
// We exclude ID and CreatedAt since those are server-generated.
type BookRequest struct {
	Title     string `json:"title"`
	Author    string `json:"author"`
	ISBN      string `json:"isbn"`
	Published string `json:"published"` // Accept as string, parse to time.Time
}
