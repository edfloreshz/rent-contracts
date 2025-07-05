package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AddressType string

const (
	PropertyAddress  AddressType = "property"
	TenantAddress    AddressType = "tenant"
	ReferenceAddress AddressType = "reference"
)

type Address struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Type         AddressType    `json:"type" gorm:"type:address_type;not null"`
	Street       string         `json:"street" gorm:"not null"`
	Number       string         `json:"number" gorm:"not null"`
	Neighborhood string         `json:"neighborhood" gorm:"not null"`
	City         string         `json:"city" gorm:"not null"`
	State        string         `json:"state" gorm:"not null"`
	ZipCode      string         `json:"zipCode" gorm:"not null"`
	Country      string         `json:"country" gorm:"not null"`
	CreatedAt    time.Time      `json:"createdAt" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt    *time.Time     `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `json:"deletedAt" gorm:"column:deletedAt;index"`
}

func (Address) TableName() string {
	return "addresses"
}
