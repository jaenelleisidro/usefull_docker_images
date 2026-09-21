// store/memory.go
package store

import (
	"errors"
	"sync"

	"bookapi/models"
)

var (
	ErrNotFound = errors.New("book not found")
)

// MemoryStore provides thread-safe in-memory storage for books.
type MemoryStore struct {
	mu    sync.RWMutex
	books map[string]models.Book
}

// NewMemoryStore creates an initialized store ready for use.
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		books: make(map[string]models.Book),
	}
}

// List returns all books in the store.
func (s *MemoryStore) List() []models.Book {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]models.Book, 0, len(s.books))
	for _, book := range s.books {
		result = append(result, book)
	}
	return result
}

// Get retrieves a single book by ID.
func (s *MemoryStore) Get(id string) (models.Book, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	book, exists := s.books[id]
	if !exists {
		return models.Book{}, ErrNotFound
	}
	return book, nil
}

// Create adds a new book to the store.
func (s *MemoryStore) Create(book models.Book) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.books[book.ID] = book
}

// Update modifies an existing book.
func (s *MemoryStore) Update(book models.Book) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.books[book.ID]; !exists {
		return ErrNotFound
	}
	s.books[book.ID] = book
	return nil
}

// Delete removes a book from the store.
func (s *MemoryStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.books[id]; !exists {
		return ErrNotFound
	}
	delete(s.books, id)
	return nil
}
