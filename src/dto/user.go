package dto

import (
	"github.com/google/uuid"
)

type CreateUserRequest struct {
	Type       string    `json:"type" binding:"required,oneof=admin tenant reference"`
	AddressID  uuid.UUID `json:"addressId" binding:"required"`
	FirstName  string    `json:"firstName" binding:"required"`
	MiddleName *string   `json:"middleName"`
	LastName   string    `json:"lastName" binding:"required"`
	Email      string    `json:"email" binding:"required,email"`
	Phone      string    `json:"phone" binding:"required"`
}

type UpdateUserRequest struct {
	Type       *string    `json:"type,omitempty" binding:"omitempty,oneof=admin tenant reference"`
	AddressID  *uuid.UUID `json:"addressId,omitempty"`
	FirstName  *string    `json:"firstName,omitempty"`
	MiddleName *string    `json:"middleName,omitempty"`
	LastName   *string    `json:"lastName,omitempty"`
	Email      *string    `json:"email,omitempty" binding:"omitempty,email"`
	Phone      *string    `json:"phone,omitempty"`
}

type UserResponse struct {
	ID         uuid.UUID        `json:"id"`
	Type       string           `json:"type"`
	AddressID  uuid.UUID        `json:"addressId"`
	FirstName  string           `json:"firstName"`
	MiddleName *string          `json:"middleName"`
	LastName   string           `json:"lastName"`
	Email      string           `json:"email"`
	Phone      string           `json:"phone"`
	CreatedAt  string           `json:"createdAt"`
	UpdatedAt  *string          `json:"updatedAt"`
	Address    *AddressResponse `json:"address,omitempty"`
}
