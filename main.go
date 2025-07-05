package main

import (
	"log"
	"os"

	"github.com/edfloreshz/rent-contracts/database"
	"github.com/edfloreshz/rent-contracts/routes"
)

func main() {
	// Connect to database
	database.Connect()

	// Setup routes
	router := routes.SetupRoutes()

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
