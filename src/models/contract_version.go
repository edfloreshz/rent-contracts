package models

import (
	"time"

	"github.com/google/uuid"
)

type ContractVersion struct {
	ID                     uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	ContractID             uuid.UUID      `json:"contractId" gorm:"type:uuid;not null"`
	VersionNumber          int            `json:"versionNumber" gorm:"not null"`
	Deposit                float64        `json:"deposit" gorm:"type:numeric;not null"`
	Rent                   float64        `json:"rent" gorm:"type:numeric;not null"`
	RentIncreasePercentage float64        `json:"rentIncreasePercentage" gorm:"type:numeric;not null"`
	Business               string         `json:"business" gorm:"not null"`
	Status                 ContractStatus `json:"status" gorm:"type:contract_status;not null"`
	Type                   ContractType   `json:"type" gorm:"type:contract_type;not null"`
	StartDate              time.Time      `json:"startDate" gorm:"type:date;not null"`
	EndDate                time.Time      `json:"endDate" gorm:"type:date;not null"`
	RenewalDate            *time.Time     `json:"renewalDate" gorm:"type:date"`
	SpecialTerms           *string        `json:"specialTerms"`
	CreatedAt              time.Time      `json:"createdAt" gorm:"default:CURRENT_TIMESTAMP"`

	// Relationships
	Contract Contract `json:"contract" gorm:"foreignKey:ContractID"`
}

func (ContractVersion) TableName() string {
	return "contractVersions"
}
