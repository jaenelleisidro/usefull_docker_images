// main.go
package main

import (
	"bookapi/handlers"
	"bookapi/middleware"
	"bookapi/store"
	"log"
	"net/http"
)

func main() {
	// Initialize storage and handlers
	bookStore := store.NewMemoryStore()
	bookHandler := handlers.NewBookHandler(bookStore)

	// Create a new ServeMux with pattern matching (Go 1.22+)
	mux := http.NewServeMux()

	// Register routes with HTTP method prefixes
	mux.HandleFunc("GET /books", bookHandler.List)
	mux.HandleFunc("GET /books/{id}", bookHandler.Get)
	mux.HandleFunc("POST /books", bookHandler.Create)
	mux.HandleFunc("PUT /books/{id}", bookHandler.Update)
	mux.HandleFunc("DELETE /books/{id}", bookHandler.Delete)

	// Health check endpoint
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Apply middleware
	handler := middleware.Logging(mux)

	// Start the server
	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
