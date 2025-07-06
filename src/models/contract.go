package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ContractStatus string
type ContractType string

const (
	ActiveContract     ContractStatus = "active"
	ExpiredContract    ContractStatus = "expired"
	TerminatedContract ContractStatus = "terminated"
)

const (
	YearlyContract ContractType = "yearly"
)

type Contract struct {
	ID               uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	CurrentVersionID *uuid.UUID     `json:"currentVersionId" gorm:"column:currentversionid;type:uuid"`
	LandlordID       uuid.UUID      `json:"landlordId" gorm:"column:landlordid;type:uuid;not null"`
	TenantID         uuid.UUID      `json:"tenantId" gorm:"column:tenantid;type:uuid;not null"`
	AddressID        uuid.UUID      `json:"addressId" gorm:"column:addressid;type:uuid;not null"`
	CreatedAt        time.Time      `json:"createdAt" gorm:"column:createdat;default:CURRENT_TIMESTAMP"`
	UpdatedAt        *time.Time     `json:"updatedAt" gorm:"column:updatedat"`
	DeletedAt        gorm.DeletedAt `json:"deletedAt" gorm:"column:deletedat;index"`

	// Relationships
	CurrentVersion *ContractVersion  `json:"currentVersion" gorm:"foreignKey:CurrentVersionID;references:id"`
	Landlord       User              `json:"landlord" gorm:"foreignKey:LandlordID;references:id"`
	Tenant         User              `json:"tenant" gorm:"foreignKey:TenantID;references:id"`
	Address        Address           `json:"address" gorm:"foreignKey:AddressID;references:id"`
	Versions       []ContractVersion `json:"versions" gorm:"foreignKey:ContractID;references:id"`
	References     []User            `json:"references" gorm:"many2many:contractreferences;foreignKey:ID;joinForeignKey:contractid;References:ID;joinReferences:referenceid"`
}

func (Contract) TableName() string {
	return "contracts"
}
