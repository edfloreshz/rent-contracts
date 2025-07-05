package dto

import (
	"github.com/google/uuid"
)

type CreateAddressRequest struct {
	Type         string `json:"type" binding:"required,oneof=property tenant reference"`
	Street       string `json:"street" binding:"required"`
	Number       string `json:"number" binding:"required"`
	Neighborhood string `json:"neighborhood" binding:"required"`
	City         string `json:"city" binding:"required"`
	State        string `json:"state" binding:"required"`
	ZipCode      string `json:"zipCode" binding:"required"`
	Country      string `json:"country" binding:"required"`
}

type UpdateAddressRequest struct {
	Type         *string `json:"type,omitempty" binding:"omitempty,oneof=property tenant reference"`
	Street       *string `json:"street,omitempty"`
	Number       *string `json:"number,omitempty"`
	Neighborhood *string `json:"neighborhood,omitempty"`
	City         *string `json:"city,omitempty"`
	State        *string `json:"state,omitempty"`
	ZipCode      *string `json:"zipCode,omitempty"`
	Country      *string `json:"country,omitempty"`
}

type AddressResponse struct {
	ID           uuid.UUID `json:"id"`
	Type         string    `json:"type"`
	Street       string    `json:"street"`
	Number       string    `json:"number"`
	Neighborhood string    `json:"neighborhood"`
	City         string    `json:"city"`
	State        string    `json:"state"`
	ZipCode      string    `json:"zipCode"`
	Country      string    `json:"country"`
	CreatedAt    string    `json:"createdAt"`
	UpdatedAt    *string   `json:"updatedAt"`
}
