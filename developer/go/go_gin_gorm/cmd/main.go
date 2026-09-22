package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jaenelleisidro/go-crud/initializers"
	"github.com/jaenelleisidro/go-crud/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {

	r := gin.Default()

	// Todo Routes
	routes.TodoRoutes(r)

	r.Run()
}
