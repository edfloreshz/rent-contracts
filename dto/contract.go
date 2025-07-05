package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateContractRequest struct {
	TenantID     uuid.UUID   `json:"tenantId" binding:"required"`
	AddressID    uuid.UUID   `json:"addressId" binding:"required"`
	ReferenceIDs []uuid.UUID `json:"referenceIds,omitempty"`
}

type UpdateContractRequest struct {
	TenantID     *uuid.UUID  `json:"tenantId,omitempty"`
	AddressID    *uuid.UUID  `json:"addressId,omitempty"`
	ReferenceIDs []uuid.UUID `json:"referenceIds,omitempty"`
}

type ContractResponse struct {
	ID               uuid.UUID                 `json:"id"`
	CurrentVersionID *uuid.UUID                `json:"currentVersionId"`
	TenantID         uuid.UUID                 `json:"tenantId"`
	AddressID        uuid.UUID                 `json:"addressId"`
	CreatedAt        string                    `json:"createdAt"`
	UpdatedAt        *string                   `json:"updatedAt"`
	CurrentVersion   *ContractVersionResponse  `json:"currentVersion,omitempty"`
	Tenant           *UserResponse             `json:"tenant,omitempty"`
	Address          *AddressResponse          `json:"address,omitempty"`
	Versions         []ContractVersionResponse `json:"versions,omitempty"`
	References       []UserResponse            `json:"references,omitempty"`
}

type CreateContractVersionRequest struct {
	ContractID             uuid.UUID  `json:"contractId" binding:"required"`
	Deposit                float64    `json:"deposit" binding:"required,min=0"`
	Rent                   float64    `json:"rent" binding:"required,min=0"`
	RentIncreasePercentage float64    `json:"rentIncreasePercentage" binding:"required,min=0,max=100"`
	Business               string     `json:"business" binding:"required"`
	Status                 string     `json:"status" binding:"required,oneof=active expired terminated"`
	Type                   string     `json:"type" binding:"required,oneof=yearly"`
	StartDate              time.Time  `json:"startDate" binding:"required"`
	EndDate                time.Time  `json:"endDate" binding:"required"`
	RenewalDate            *time.Time `json:"renewalDate"`
	SpecialTerms           *string    `json:"specialTerms"`
}

type UpdateContractVersionRequest struct {
	Deposit                *float64   `json:"deposit,omitempty" binding:"omitempty,min=0"`
	Rent                   *float64   `json:"rent,omitempty" binding:"omitempty,min=0"`
	RentIncreasePercentage *float64   `json:"rentIncreasePercentage,omitempty" binding:"omitempty,min=0,max=100"`
	Business               *string    `json:"business,omitempty"`
	Status                 *string    `json:"status,omitempty" binding:"omitempty,oneof=active expired terminated"`
	Type                   *string    `json:"type,omitempty" binding:"omitempty,oneof=yearly"`
	StartDate              *time.Time `json:"startDate,omitempty"`
	EndDate                *time.Time `json:"endDate,omitempty"`
	RenewalDate            *time.Time `json:"renewalDate,omitempty"`
	SpecialTerms           *string    `json:"specialTerms,omitempty"`
}

type ContractVersionResponse struct {
	ID                     uuid.UUID `json:"id"`
	ContractID             uuid.UUID `json:"contractId"`
	VersionNumber          int       `json:"versionNumber"`
	Deposit                float64   `json:"deposit"`
	Rent                   float64   `json:"rent"`
	RentIncreasePercentage float64   `json:"rentIncreasePercentage"`
	Business               string    `json:"business"`
	Status                 string    `json:"status"`
	Type                   string    `json:"type"`
	StartDate              string    `json:"startDate"`
	EndDate                string    `json:"endDate"`
	RenewalDate            *string   `json:"renewalDate"`
	SpecialTerms           *string   `json:"specialTerms"`
	CreatedAt              string    `json:"createdAt"`
}
