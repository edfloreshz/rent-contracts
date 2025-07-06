package routes

import (
	"fmt"
	"github.com/MarceloPetrucio/go-scalar-api-reference"
	handlers "github.com/edfloreshz/rent-contracts/src/handlers"
	services "github.com/edfloreshz/rent-contracts/src/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

func Router(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	// Initialize services
	addressService := services.NewAddressService(db)
	userService := services.NewUserService(db)
	contractService := services.NewContractService(db)

	// Initialize handlers
	addressHandler := handlers.NewAddressHandler(addressService)
	userHandler := handlers.NewUserHandler(userService)
	contractHandler := handlers.NewContractHandler(contractService)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Address routes
		addresses := v1.Group("/addresses")
		{
			addresses.POST("", addressHandler.CreateAddress)
			addresses.GET("", addressHandler.GetAllAddresses)
			addresses.GET("/:id", addressHandler.GetAddress)
			addresses.PUT("/:id", addressHandler.UpdateAddress)
			addresses.DELETE("/:id", addressHandler.DeleteAddress)
		}

		// User routes
		users := v1.Group("/users")
		{
			users.POST("", userHandler.CreateUser)
			users.GET("", userHandler.GetAllUsers) // Supports ?type=tenant|admin|reference
			users.GET("/:id", userHandler.GetUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.DELETE("/:id", userHandler.DeleteUser)
		}

		// Contract routes
		contracts := v1.Group("/contracts")
		{
			contracts.POST("", contractHandler.CreateContract)
			contracts.GET("", contractHandler.GetAllContracts) // Supports ?tenantId=uuid
			contracts.GET("/:id", contractHandler.GetContract)
			contracts.PUT("/:id", contractHandler.UpdateContract)
			contracts.DELETE("/:id", contractHandler.DeleteContract)

			// Contract version routes
			contracts.POST("/versions", contractHandler.CreateContractVersion)
			contracts.GET("/:id/versions", contractHandler.GetContractVersions)

			// Contract document routes
			contracts.GET("/:id/document", contractHandler.GetContractDocument)
		}
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"healthy": true,
		})
	})

	router.GET("/scalar", func(c *gin.Context) {
		htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
			SpecURL: "openapi.yaml",
			CustomOptions: scalar.CustomOptions{
				PageTitle: "Rent Contracts API Reference",
			},
			DarkMode: true,
		})

		if err != nil {
			fmt.Printf("%v", err)
			c.String(http.StatusInternalServerError, "Error generating API reference")
			return
		}

		c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(htmlContent))
	})

	return router
}
