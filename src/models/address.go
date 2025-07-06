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
	Type         AddressType    `json:"type" gorm:"column:type;type:addresstype;not null"`
	Street       string         `json:"street" gorm:"column:street;not null"`
	Number       string         `json:"number" gorm:"column:number;not null"`
	Neighborhood string         `json:"neighborhood" gorm:"column:neighborhood;not null"`
	City         string         `json:"city" gorm:"column:city;not null"`
	State        string         `json:"state" gorm:"column:state;not null"`
	ZipCode      string         `json:"zipCode" gorm:"column:zipcode;not null"`
	Country      string         `json:"country" gorm:"column:country;not null"`
	CreatedAt    time.Time      `json:"createdAt" gorm:"column:createdat;default:CURRENT_TIMESTAMP"`
	UpdatedAt    *time.Time     `json:"updatedAt" gorm:"column:updatedat"`
	DeletedAt    gorm.DeletedAt `json:"deletedAt" gorm:"column:deletedat;index"`
}

func (Address) TableName() string {
	return "addresses"
}

func (a Address) FullAddress() string {
	return a.Street + ", " + a.Number + ", " + a.Neighborhood + ", " + a.City + ", " + a.State + ", " + a.ZipCode + ", " + a.Country
}
