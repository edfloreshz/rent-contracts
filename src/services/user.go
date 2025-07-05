package services

import (
	"errors"
	"github.com/edfloreshz/rent-contracts/src/database"
	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

func (s *UserService) CreateUser(req *dto.CreateUserRequest) (*models.User, error) {
	user := &models.User{
		Type:       models.UserType(req.Type),
		AddressID:  req.AddressID,
		FirstName:  req.FirstName,
		MiddleName: req.MiddleName,
		LastName:   req.LastName,
		Email:      req.Email,
		Phone:      req.Phone,
	}

	if err := database.DB.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := database.DB.Preload("Address").First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

func (s *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := database.DB.Preload("Address").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUsersByType(userType string) ([]models.User, error) {
	var users []models.User
	if err := database.DB.Preload("Address").Where("type = ?", userType).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) UpdateUser(id uuid.UUID, req *dto.UpdateUserRequest) (*models.User, error) {
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Update only provided fields
	if req.Type != nil {
		user.Type = models.UserType(*req.Type)
	}
	if req.AddressID != nil {
		user.AddressID = *req.AddressID
	}
	if req.FirstName != nil {
		user.FirstName = *req.FirstName
	}
	if req.MiddleName != nil {
		user.MiddleName = req.MiddleName
	}
	if req.LastName != nil {
		user.LastName = *req.LastName
	}
	if req.Email != nil {
		user.Email = *req.Email
	}
	if req.Phone != nil {
		user.Phone = *req.Phone
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) DeleteUser(id uuid.UUID) error {
	if err := database.DB.Delete(&models.User{}, id).Error; err != nil {
		return err
	}
	return nil
}
