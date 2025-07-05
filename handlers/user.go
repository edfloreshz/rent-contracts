package handlers

import (
	"net/http"
	"time"

	"github.com/edfloreshz/rent-contracts/dto"
	"github.com/edfloreshz/rent-contracts/models"
	"github.com/edfloreshz/rent-contracts/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req dto.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.CreateUser(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	c.JSON(http.StatusCreated, response)
}

func (h *UserHandler) GetUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	user, err := h.userService.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	// Include address if loaded
	if user.Address.ID != uuid.Nil {
		response.Address = &dto.AddressResponse{
			ID:           user.Address.ID,
			Type:         string(user.Address.Type),
			Street:       user.Address.Street,
			Number:       user.Address.Number,
			Neighborhood: user.Address.Neighborhood,
			City:         user.Address.City,
			State:        user.Address.State,
			ZipCode:      user.Address.ZipCode,
			Country:      user.Address.Country,
			CreatedAt:    user.Address.CreatedAt.Format(time.RFC3339),
		}
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	userType := c.Query("type")
	var users []models.User
	var err error

	if userType != "" {
		users, err = h.userService.GetUsersByType(userType)
	} else {
		users, err = h.userService.GetAllUsers()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var responses []dto.UserResponse
	for _, user := range users {
		response := dto.UserResponse{
			ID:         user.ID,
			Type:       string(user.Type),
			AddressID:  user.AddressID,
			FirstName:  user.FirstName,
			MiddleName: user.MiddleName,
			LastName:   user.LastName,
			Email:      user.Email,
			Phone:      user.Phone,
			CreatedAt:  user.CreatedAt.Format(time.RFC3339),
		}

		if user.UpdatedAt != nil {
			updatedAt := user.UpdatedAt.Format(time.RFC3339)
			response.UpdatedAt = &updatedAt
		}

		// Include address if loaded
		if user.Address.ID != uuid.Nil {
			response.Address = &dto.AddressResponse{
				ID:           user.Address.ID,
				Type:         string(user.Address.Type),
				Street:       user.Address.Street,
				Number:       user.Address.Number,
				Neighborhood: user.Address.Neighborhood,
				City:         user.Address.City,
				State:        user.Address.State,
				ZipCode:      user.Address.ZipCode,
				Country:      user.Address.Country,
				CreatedAt:    user.Address.CreatedAt.Format(time.RFC3339),
			}
		}

		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, responses)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.UpdateUser(id, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	err = h.userService.DeleteUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
