package handlers

import (
	"net/http"
	"time"

	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"
	"github.com/edfloreshz/rent-contracts/src/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AddressHandler struct {
	addressService *services.AddressService
}

func NewAddressHandler(addressService *services.AddressService) *AddressHandler {
	return &AddressHandler{
		addressService: addressService,
	}
}

func (h *AddressHandler) CreateAddress(c *gin.Context) {
	var req dto.CreateAddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, err := h.addressService.CreateAddress(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	c.JSON(http.StatusCreated, response)
}

func (h *AddressHandler) GetAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	address, err := h.addressService.GetAddressByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	c.JSON(http.StatusOK, response)
}

func (h *AddressHandler) GetAllAddresses(c *gin.Context) {
	typeFilter := c.Query("type")

	var addresses []models.Address
	var err error

	if typeFilter != "" {
		// Convert string to AddressType
		addressType := models.AddressType(typeFilter)
		addresses, err = h.addressService.GetAddressesByType(addressType)
	} else {
		addresses, err = h.addressService.GetAllAddresses()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var responses []dto.AddressResponse
	for _, address := range addresses {
		response := dto.AddressResponse{
			ID:           address.ID,
			Type:         string(address.Type),
			Street:       address.Street,
			Number:       address.Number,
			Neighborhood: address.Neighborhood,
			City:         address.City,
			State:        address.State,
			ZipCode:      address.ZipCode,
			Country:      address.Country,
			CreatedAt:    address.CreatedAt.Format(time.RFC3339),
		}

		if address.UpdatedAt != nil {
			updatedAt := address.UpdatedAt.Format(time.RFC3339)
			response.UpdatedAt = &updatedAt
		}

		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, responses)
}

func (h *AddressHandler) UpdateAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	var req dto.UpdateAddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, err := h.addressService.UpdateAddress(id, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	c.JSON(http.StatusOK, response)
}

func (h *AddressHandler) DeleteAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID"})
		return
	}

	err = h.addressService.DeleteAddress(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
