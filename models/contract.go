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
	CurrentVersionID *uuid.UUID     `json:"currentVersionId" gorm:"type:uuid"`
	TenantID         uuid.UUID      `json:"tenantId" gorm:"type:uuid;not null"`
	AddressID        uuid.UUID      `json:"addressId" gorm:"type:uuid;not null"`
	CreatedAt        time.Time      `json:"createdAt" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt        *time.Time     `json:"updatedAt"`
	DeletedAt        gorm.DeletedAt `json:"deletedAt" gorm:"index"`

	// Relationships
	CurrentVersion *ContractVersion  `json:"currentVersion" gorm:"foreignKey:CurrentVersionID"`
	Tenant         User              `json:"tenant" gorm:"foreignKey:TenantID"`
	Address        Address           `json:"address" gorm:"foreignKey:AddressID"`
	Versions       []ContractVersion `json:"versions" gorm:"foreignKey:ContractID"`
	References     []User            `json:"references" gorm:"many2many:contractReferences;foreignKey:ID;joinForeignKey:ContractID;References:ID;joinReferences:ReferenceID"`
}

func (Contract) TableName() string {
	return "contracts"
}
