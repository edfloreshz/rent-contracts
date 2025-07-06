package models

import (
	"github.com/google/uuid"
)

type ContractReference struct {
	ContractID  uuid.UUID `json:"contractId" gorm:"column:contractid;type:uuid;primaryKey"`
	ReferenceID uuid.UUID `json:"referenceId" gorm:"column:referenceid;type:uuid;primaryKey"`

	// Relationships
	Contract  Contract `json:"contract" gorm:"foreignKey:ContractID;references:id"`
	Reference User     `json:"reference" gorm:"foreignKey:ReferenceID;references:id"`
}

func (ContractReference) TableName() string {
	return "contractreferences"
}
