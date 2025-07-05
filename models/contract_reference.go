package models

import (
	"github.com/google/uuid"
)

type ContractReference struct {
	ContractID  uuid.UUID `json:"contractId" gorm:"type:uuid;primaryKey"`
	ReferenceID uuid.UUID `json:"referenceId" gorm:"type:uuid;primaryKey"`

	// Relationships
	Contract  Contract `json:"contract" gorm:"foreignKey:ContractID"`
	Reference User     `json:"reference" gorm:"foreignKey:ReferenceID"`
}

func (ContractReference) TableName() string {
	return "contractReferences"
}
