package main

import (
	"github.com/jaenelleisidro/go-crud/initializers"
	"github.com/jaenelleisidro/go-crud/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.Todo{})
}
