// handlers/books.go
package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"time"

	"bookapi/models"
	"bookapi/store"
)

// BookHandler manages HTTP requests for book resources.
type BookHandler struct {
	store *store.MemoryStore
}

// NewBookHandler creates a handler with the given store.
func NewBookHandler(s *store.MemoryStore) *BookHandler {
	return &BookHandler{store: s}
}

// writeJSON sends a JSON response with the given status code.
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// writeError sends an error response in a consistent format.
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

// newID generates a random 128-bit hexadecimal ID.
func newID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// List handles GET /books - returns all books.
func (h *BookHandler) List(w http.ResponseWriter, r *http.Request) {
	books := h.store.List()
	writeJSON(w, http.StatusOK, books)
}

// Get handles GET /books/{id} - returns a single book.
func (h *BookHandler) Get(w http.ResponseWriter, r *http.Request) {
	// Go 1.22+ provides PathValue for extracting route parameters
	id := r.PathValue("id")

	book, err := h.store.Get(id)
	if err == store.ErrNotFound {
		writeError(w, http.StatusNotFound, "book not found")
		return
	}

	writeJSON(w, http.StatusOK, book)
}

// Create handles POST /books - adds a new book.
func (h *BookHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.BookRequest

	// Decode request body into struct
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	// Basic validation
	if req.Title == "" || req.Author == "" {
		writeError(w, http.StatusBadRequest, "title and author are required")
		return
	}

	// Parse the published date
	published, err := time.Parse("2006-01-02", req.Published)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid date format, use YYYY-MM-DD")
		return
	}

	id, err := newID()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not generate book ID")
		return
	}

	book := models.Book{
		ID:        id,
		Title:     req.Title,
		Author:    req.Author,
		ISBN:      req.ISBN,
		Published: published,
		CreatedAt: time.Now(),
	}

	h.store.Create(book)
	writeJSON(w, http.StatusCreated, book)
}

// Update handles PUT /books/{id} - modifies an existing book.
func (h *BookHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	existing, err := h.store.Get(id)
	if err == store.ErrNotFound {
		writeError(w, http.StatusNotFound, "book not found")
		return
	}

	var req models.BookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	// Update fields if provided
	if req.Title != "" {
		existing.Title = req.Title
	}
	if req.Author != "" {
		existing.Author = req.Author
	}
	if req.ISBN != "" {
		existing.ISBN = req.ISBN
	}
	if req.Published != "" {
		published, err := time.Parse("2006-01-02", req.Published)
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid date format")
			return
		}
		existing.Published = published
	}

	h.store.Update(existing)
	writeJSON(w, http.StatusOK, existing)
}

// Delete handles DELETE /books/{id} - removes a book.
func (h *BookHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	if err := h.store.Delete(id); err == store.ErrNotFound {
		writeError(w, http.StatusNotFound, "book not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
