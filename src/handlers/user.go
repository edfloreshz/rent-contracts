package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"
	"github.com/edfloreshz/rent-contracts/src/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.userService.CreateUser(&req)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusCreated, response)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	user, err := h.userService.GetUserByID(id)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	// Include address if loaded
	if user.Address.ID != uuid.Nil {
		response.Address = &dto.AddressResponse{
			ID:           user.Address.ID,
			Type:         string(user.Address.Type),
			Street:       user.Address.Street,
			Number:       user.Address.Number,
			Neighborhood: user.Address.Neighborhood,
			City:         user.Address.City,
			State:        user.Address.State,
			ZipCode:      user.Address.ZipCode,
			Country:      user.Address.Country,
			CreatedAt:    user.Address.CreatedAt.Format(time.RFC3339),
		}
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *UserHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	typeFilter := r.URL.Query().Get("type")

	var users []models.User
	var err error

	if typeFilter != "" {
		users, err = h.userService.GetUsersByType(typeFilter)
	} else {
		users, err = h.userService.GetAllUsers()
	}

	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	var responses []dto.UserResponse
	for _, user := range users {
		response := dto.UserResponse{
			ID:         user.ID,
			Type:       string(user.Type),
			AddressID:  user.AddressID,
			FirstName:  user.FirstName,
			MiddleName: user.MiddleName,
			LastName:   user.LastName,
			Email:      user.Email,
			Phone:      user.Phone,
			CreatedAt:  user.CreatedAt.Format(time.RFC3339),
		}

		if user.UpdatedAt != nil {
			updatedAt := user.UpdatedAt.Format(time.RFC3339)
			response.UpdatedAt = &updatedAt
		}

		// Include address if loaded
		if user.Address.ID != uuid.Nil {
			response.Address = &dto.AddressResponse{
				ID:           user.Address.ID,
				Type:         string(user.Address.Type),
				Street:       user.Address.Street,
				Number:       user.Address.Number,
				Neighborhood: user.Address.Neighborhood,
				City:         user.Address.City,
				State:        user.Address.State,
				ZipCode:      user.Address.ZipCode,
				Country:      user.Address.Country,
				CreatedAt:    user.Address.CreatedAt.Format(time.RFC3339),
			}
		}

		responses = append(responses, response)
	}

	writeJSON(w, http.StatusOK, responses)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	var req dto.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.userService.UpdateUser(id, &req)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	response := &dto.UserResponse{
		ID:         user.ID,
		Type:       string(user.Type),
		AddressID:  user.AddressID,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		LastName:   user.LastName,
		Email:      user.Email,
		Phone:      user.Phone,
		CreatedAt:  user.CreatedAt.Format(time.RFC3339),
	}

	if user.UpdatedAt != nil {
		updatedAt := user.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	err = h.userService.DeleteUser(id)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
