package routes

import (
	"fmt"
	"net/http"
	"time"

	"github.com/MarceloPetrucio/go-scalar-api-reference"
	"github.com/Zachacious/go-respec/respec"
	"github.com/edfloreshz/rent-contracts/src/handlers"
	"github.com/edfloreshz/rent-contracts/src/services"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"gorm.io/gorm"
)

func Router(db *gorm.DB) http.Handler {
	router := chi.NewRouter()

	// Add middleware
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	// Configure CORS
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           int(12 * time.Hour / time.Second),
	}))

	// Initialize services
	addressService := services.NewAddressService(db)
	userService := services.NewUserService(db)
	contractService := services.NewContractService(db)
	statisticsService := services.NewStatisticsService(db)

	// Initialize handlers
	addressHandler := handlers.NewAddressHandler(addressService)
	userHandler := handlers.NewUserHandler(userService)
	contractHandler := handlers.NewContractHandler(contractService)
	statisticsHandler := handlers.NewStatisticsHandler(statisticsService)

	// API v1 routes
	router.Route("/api/v1", func(r chi.Router) {
		// Address routes
		r.Route("/addresses", func(r chi.Router) {
			respec.Meta(r).Tag("Addresses")
			r.Post("/", respec.Handler(addressHandler.CreateAddress).Summary("Create a new address").Unwrap())
			r.Get("/", respec.Handler(addressHandler.GetAllAddresses).Summary("Get all addresses").Unwrap())
			r.Get("/{id}", respec.Handler(addressHandler.GetAddress).Summary("Get a single address").Unwrap())
			r.Put("/{id}", respec.Handler(addressHandler.UpdateAddress).Summary("Update an address").Unwrap())
			r.Delete("/{id}", respec.Handler(addressHandler.DeleteAddress).Summary("Delete an address").Unwrap())
		})

		// User routes
		r.Route("/users", func(r chi.Router) {
			respec.Meta(r).Tag("Users")
			r.Post("/", respec.Handler(userHandler.CreateUser).Summary("Create a new user").Unwrap())
			r.Get("/", respec.Handler(userHandler.GetAllUsers).Summary("Get all users").Unwrap())
			r.Get("/{id}", respec.Handler(userHandler.GetUser).Summary("Get a single user").Unwrap())
			r.Put("/{id}", respec.Handler(userHandler.UpdateUser).Summary("Update a user").Unwrap())
			r.Delete("/{id}", respec.Handler(userHandler.DeleteUser).Summary("Delte a user").Unwrap())
		})

		// Contract routes
		r.Route("/contracts", func(r chi.Router) {
			respec.Meta(r).Tag("Contracts")
			r.Post("/", respec.Handler(contractHandler.CreateContract).Summary("Create a new contract").Unwrap())
			r.Get("/", respec.Handler(contractHandler.GetAllContracts).Summary("Get all contracts").Unwrap()) // Supports ?tenantId=uuid
			r.Get("/{id}", respec.Handler(contractHandler.GetContract).Summary("Get a single contract").Unwrap())
			r.Put("/{id}", respec.Handler(contractHandler.UpdateContract).Summary("Update a contract").Unwrap())
			r.Delete("/{id}", respec.Handler(contractHandler.DeleteContract).Summary("Delte a contract").Unwrap())

			// Contract version routes
			r.Post("/versions", respec.Handler(contractHandler.CreateContractVersion).Summary("Create a new contract version").Unwrap())
			r.Get("/{id}/versions", respec.Handler(contractHandler.GetContractVersions).Summary("Get all versions for a contract").Unwrap())

			// Contract document routes
			r.Get("/{id}/document", respec.Handler(contractHandler.GetContractDocument).Summary("Get the document for a contract").Unwrap())
		})

		// Statistics routes
		r.Route("/statistics", func(r chi.Router) {
			respec.Meta(r).Tag("Statistics")
			r.Get("/overall", respec.Handler(statisticsHandler.GetOverallStatistics).Summary("Get the overall statistics").Unwrap())
		})
	})

	// Health check endpoint
	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"healthy": true}`))
	})

	router.Get("/scalar", func(w http.ResponseWriter, r *http.Request) {
		htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
			SpecURL: "openapi.yaml",
			CustomOptions: scalar.CustomOptions{
				PageTitle: "Rent Contracts API Reference",
			},
			DarkMode: true,
		})

		if err != nil {
			fmt.Printf("%v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error generating API reference"))
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(htmlContent))
	})

	return router
}
