package services

import (
	"errors"
	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AddressService struct {
	db *gorm.DB
}

func NewAddressService(db *gorm.DB) *AddressService {
	return &AddressService{
		db,
	}
}

func (s *AddressService) CreateAddress(req *dto.CreateAddressRequest) (*models.Address, error) {
	address := &models.Address{
		Type:         models.AddressType(req.Type),
		Street:       req.Street,
		Number:       req.Number,
		Neighborhood: req.Neighborhood,
		City:         req.City,
		State:        req.State,
		ZipCode:      req.ZipCode,
		Country:      req.Country,
	}

	if err := s.db.Create(address).Error; err != nil {
		return nil, err
	}

	return address, nil
}

func (s *AddressService) GetAddressByID(id uuid.UUID) (*models.Address, error) {
	var address models.Address
	if err := s.db.First(&address, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("address not found")
		}
		return nil, err
	}
	return &address, nil
}

func (s *AddressService) GetAllAddresses() ([]models.Address, error) {
	var addresses []models.Address
	if err := s.db.Find(&addresses).Error; err != nil {
		return nil, err
	}
	return addresses, nil
}

func (s *AddressService) UpdateAddress(id uuid.UUID, req *dto.UpdateAddressRequest) (*models.Address, error) {
	var address models.Address
	if err := s.db.First(&address, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("address not found")
		}
		return nil, err
	}

	// Update only provided fields
	if req.Type != nil {
		address.Type = models.AddressType(*req.Type)
	}
	if req.Street != nil {
		address.Street = *req.Street
	}
	if req.Number != nil {
		address.Number = *req.Number
	}
	if req.Neighborhood != nil {
		address.Neighborhood = *req.Neighborhood
	}
	if req.City != nil {
		address.City = *req.City
	}
	if req.State != nil {
		address.State = *req.State
	}
	if req.ZipCode != nil {
		address.ZipCode = *req.ZipCode
	}
	if req.Country != nil {
		address.Country = *req.Country
	}

	if err := s.db.Save(&address).Error; err != nil {
		return nil, err
	}

	return &address, nil
}

func (s *AddressService) DeleteAddress(id uuid.UUID) error {
	if err := s.db.Delete(&models.Address{}, id).Error; err != nil {
		return err
	}
	return nil
}
