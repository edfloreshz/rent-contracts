package services

import (
	"errors"
	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"

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

func (s *ContractService) CreateContract(req *dto.CreateContractRequest) (*models.Contract, error) {
	contract := &models.Contract{
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
			contractRef := &models.ContractReference{
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

func (s *ContractService) GetContractByID(id uuid.UUID) (*models.Contract, error) {
	var contract models.Contract
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

func (s *ContractService) GetAllContracts() ([]models.Contract, error) {
	var contracts []models.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Tenant").
		Preload("Address").
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) GetContractsByTenant(tenantID uuid.UUID) ([]models.Contract, error) {
	var contracts []models.Contract
	if err := s.db.
		Preload("CurrentVersion").
		Preload("Tenant").
		Preload("Address").
		Where("tenantid = ?", tenantID).
		Find(&contracts).Error; err != nil {
		return nil, err
	}
	return contracts, nil
}

func (s *ContractService) UpdateContract(id uuid.UUID, req *dto.UpdateContractRequest) (*models.Contract, error) {
	var contract models.Contract
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
		if err := s.db.Where("contractid = ?", contract.ID).Delete(&models.ContractReference{}).Error; err != nil {
			return nil, err
		}

		// Add new references
		for _, refID := range req.ReferenceIDs {
			contractRef := &models.ContractReference{
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
	if err := s.db.Delete(&models.Contract{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (s *ContractService) CreateContractVersion(req *dto.CreateContractVersionRequest) (*models.ContractVersion, error) {
	var maxVersion int
	s.db.Model(&models.ContractVersion{}).
		Where("contractid = ?", req.ContractID).
		Select("COALESCE(MAX(versionnumber), 0)").
		Scan(&maxVersion)

	version := &models.ContractVersion{
		ContractID:             req.ContractID,
		VersionNumber:          maxVersion + 1,
		Deposit:                req.Deposit,
		Rent:                   req.Rent,
		RentIncreasePercentage: req.RentIncreasePercentage,
		Business:               req.Business,
		Status:                 models.ContractStatus(req.Status),
		Type:                   models.ContractType(req.Type),
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

func (s *ContractService) GetContractVersionByID(id uuid.UUID) (*models.ContractVersion, error) {
	var version models.ContractVersion
	if err := s.db.First(&version, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("contract version not found")
		}
		return nil, err
	}
	return &version, nil
}

func (s *ContractService) GetContractVersionsByContractID(contractID uuid.UUID) ([]models.ContractVersion, error) {
	var versions []models.ContractVersion
	if err := s.db.Where("contractid = ?", contractID).Order("versionnumber DESC").Find(&versions).Error; err != nil {
		return nil, err
	}
	return versions, nil
}
