package models

import (
	"time"

	"github.com/google/uuid"
)

type ContractVersion struct {
	ID                     uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	ContractID             uuid.UUID      `json:"contractId" gorm:"column:contractid;type:uuid;not null"`
	VersionNumber          int            `json:"versionNumber" gorm:"column:versionnumber;not null"`
	Rent                   float64        `json:"rent" gorm:"column:rent;type:numeric;not null"`
	RentIncreasePercentage float64        `json:"rentIncreasePercentage" gorm:"column:rentincreasepercentage;type:numeric;not null"`
	Business               string         `json:"business" gorm:"column:business;not null"`
	Status                 ContractStatus `json:"status" gorm:"column:status;type:contractstatus;not null"`
	Type                   ContractType   `json:"type" gorm:"column:type;type:contracttype;not null"`
	StartDate              time.Time      `json:"startDate" gorm:"column:startdate;type:date;not null"`
	EndDate                time.Time      `json:"endDate" gorm:"column:enddate;type:date;not null"`
	RenewalDate            *time.Time     `json:"renewalDate" gorm:"column:renewaldate;type:date"`
	SpecialTerms           *string        `json:"specialTerms" gorm:"column:specialterms"`
	CreatedAt              time.Time      `json:"createdAt" gorm:"column:createdat;default:CURRENT_TIMESTAMP"`

	// Relationships
	Contract Contract `json:"contract" gorm:"foreignKey:ContractID;references:id"`
}

func (ContractVersion) TableName() string {
	return "contractversions"
}
