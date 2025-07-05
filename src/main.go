package main

import (
	"github.com/edfloreshz/rent-contracts/src/database"
	"github.com/edfloreshz/rent-contracts/src/routes"
	"log"
	"os"
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
