package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserType string

const (
	AdminUser     UserType = "admin"
	TenantUser    UserType = "tenant"
	ReferenceUser UserType = "reference"
)

type User struct {
	ID         uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Type       UserType       `json:"type" gorm:"column:type;type:usertype;not null"`
	AddressID  uuid.UUID      `json:"addressId" gorm:"column:addressid;type:uuid;not null"`
	FirstName  string         `json:"firstName" gorm:"column:firstname;not null"`
	MiddleName *string        `json:"middleName" gorm:"column:middlename"`
	LastName   string         `json:"lastName" gorm:"column:lastname;not null"`
	Email      string         `json:"email" gorm:"column:email;not null"`
	Phone      string         `json:"phone" gorm:"column:phone;not null"`
	CreatedAt  time.Time      `json:"createdAt" gorm:"column:createdat;default:CURRENT_TIMESTAMP"`
	UpdatedAt  *time.Time     `json:"updatedAt" gorm:"column:updatedat"`
	DeletedAt  gorm.DeletedAt `json:"deletedAt" gorm:"column:deletedat;index"`

	// Relationships
	Address Address `json:"address" gorm:"foreignKey:AddressID;references:id"`
}

func (User) TableName() string {
	return "users"
}
