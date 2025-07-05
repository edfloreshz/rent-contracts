package main

import (
	"github.com/edfloreshz/rent-contracts/src/config"
	"github.com/edfloreshz/rent-contracts/src/database"
	"github.com/edfloreshz/rent-contracts/src/routes"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.New()

	// Connect to database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Setup routes
	router := routes.Router(db)

	// Get port from environment or use default
	port := config.GetEnv("PORT", "8080")

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
