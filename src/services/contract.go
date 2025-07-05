package services

import (
	"errors"
	"github.com/edfloreshz/rent-contracts/src/dto"
	models2 "github.com/edfloreshz/rent-contracts/src/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ContractService struct {
	db *gorm.DB
}

func NewContractService(db *gorm.DB) *ContractService {
	return &ContractService{
		db,
	}
}

func (s *ContractService) CreateContract(req *dto.CreateContractRequest) (*models2.Contract, error) {
	contract := &models2.Contract{
		TenantID:  req.TenantID,
		AddressID: req.AddressID,
	}

	// Start transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Create(contract).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Add references if provided
	if len(req.ReferenceIDs) > 0 {
		for _, refID := range req.ReferenceIDs {
			contractRef := &models2.ContractReference{
				ContractID:  contract.ID,
				ReferenceID: refID,
			}
			if err := tx.Create(contractRef).Error; err != nil {
				tx.Rollback()
				return nil, err
			}
		}
	}

	tx.Commit()
	return contract, nil
}

func (s *ContractService) GetContractByID(id uuid.UUID) (*models2.Contract, error) {
	var contract models2.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Tenant").
		Preload("Address").
		Preload("Versions").
		Preload("References").
		First(&contract, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract not found")
		}
		return nil, err
	}
	return &contract, nil
}

func (s *ContractService) GetAllContracts() ([]models2.Contract, error) {
	var contracts []models2.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Tenant").
		Preload("Address").
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) GetContractsByTenant(tenantID uuid.UUID) ([]models2.Contract, error) {
	var contracts []models2.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Tenant").
		Preload("Address").
		Where("tenant_id = ?", tenantID).
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) UpdateContract(id uuid.UUID, req *dto.UpdateContractRequest) (*models2.Contract, error) {
	var contract models2.Contract
	if err := s.db.First(&contract, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract not found")
		}
		return nil, err
	}

	// Update only provided fields
	if req.TenantID != nil {
		contract.TenantID = *req.TenantID
	}
	if req.AddressID != nil {
		contract.AddressID = *req.AddressID
	}

	if err := s.db.Save(&contract).Error; err != nil {
		return nil, err
	}

	// Handle references update
	if req.ReferenceIDs != nil {
		// Remove existing references
		if err := s.db.Where("contract_id = ?", contract.ID).Delete(&models2.ContractReference{}).Error; err != nil {
			return nil, err
		}

		// Add new references
		for _, refID := range req.ReferenceIDs {
			contractRef := &models2.ContractReference{
				ContractID:  contract.ID,
				ReferenceID: refID,
			}
			if err := s.db.Create(contractRef).Error; err != nil {
				return nil, err
			}
		}
	}

	return &contract, nil
}

func (s *ContractService) DeleteContract(id uuid.UUID) error {
	if err := s.db.Delete(&models2.Contract{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (s *ContractService) CreateContractVersion(req *dto.CreateContractVersionRequest) (*models2.ContractVersion, error) {
	// Get next version number
	var maxVersion int
	s.db.Model(&models2.ContractVersion{}).
		Where("contract_id = ?", req.ContractID).
		Select("COALESCE(MAX(version_number), 0)").
		Scan(&maxVersion)

	version := &models2.ContractVersion{
		ContractID:             req.ContractID,
		VersionNumber:          maxVersion + 1,
		Deposit:                req.Deposit,
		Rent:                   req.Rent,
		RentIncreasePercentage: req.RentIncreasePercentage,
		Business:               req.Business,
		Status:                 models2.ContractStatus(req.Status),
		Type:                   models2.ContractType(req.Type),
		StartDate:              req.StartDate,
		EndDate:                req.EndDate,
		RenewalDate:            req.RenewalDate,
		SpecialTerms:           req.SpecialTerms,
	}

	if err := s.db.Create(version).Error; err != nil {
		return nil, err
	}

	return version, nil
}

func (s *ContractService) GetContractVersionByID(id uuid.UUID) (*models2.ContractVersion, error) {
	var version models2.ContractVersion
	if err := s.db.First(&version, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract version not found")
		}
		return nil, err
	}
	return &version, nil
}

func (s *ContractService) GetContractVersionsByContractID(contractID uuid.UUID) ([]models2.ContractVersion, error) {
	var versions []models2.ContractVersion
	if err := s.db.Where("contract_id = ?", contractID).Order("version_number DESC").Find(&versions).Error; err != nil {
		return nil, err
	}
	return versions, nil
}
