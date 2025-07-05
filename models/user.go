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
	Type       UserType       `json:"type" gorm:"type:user_type;not null"`
	AddressID  uuid.UUID      `json:"addressId" gorm:"type:uuid;not null"`
	FirstName  string         `json:"firstName" gorm:"not null"`
	MiddleName *string        `json:"middleName"`
	LastName   string         `json:"lastName" gorm:"not null"`
	Email      string         `json:"email" gorm:"not null"`
	Phone      string         `json:"phone" gorm:"not null"`
	CreatedAt  time.Time      `json:"createdAt" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt  *time.Time     `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `json:"deletedAt" gorm:"index"`

	// Relationships
	Address Address `json:"address" gorm:"foreignKey:AddressID"`
}

func (User) TableName() string {
	return "users"
}
