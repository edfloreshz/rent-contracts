package routes

import (
	"github.com/edfloreshz/rent-contracts/handlers"
	"github.com/edfloreshz/rent-contracts/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	router := gin.Default()

	// Initialize services
	addressService := services.NewAddressService()
	userService := services.NewUserService()
	contractService := services.NewContractService()

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
			contracts.GET("/:contractId/versions", contractHandler.GetContractVersions)
		}
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Rent Contracts API is running",
		})
	})

	return router
}
