package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/edfloreshz/rent-contracts/src/dto"
	"github.com/edfloreshz/rent-contracts/src/models"
	"github.com/edfloreshz/rent-contracts/src/services"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type AddressHandler struct {
	addressService *services.AddressService
}

func NewAddressHandler(addressService *services.AddressService) *AddressHandler {
	return &AddressHandler{
		addressService: addressService,
	}
}

func (h *AddressHandler) CreateAddress(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateAddressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	address, err := h.addressService.CreateAddress(&req)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *AddressHandler) GetAddress(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	address, err := h.addressService.GetAddressByID(id)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *AddressHandler) GetAllAddresses(w http.ResponseWriter, r *http.Request) {
	typeFilter := r.URL.Query().Get("type")
	availableFilter := r.URL.Query().Get("available")
	limitFilter := r.URL.Query().Get("limit")
	filter := services.AddressServiceFilter{}

	var err error
	var addresses []models.Address

	if typeFilter != "" {
		addressType := models.AddressType(typeFilter)
		filter.Type = &addressType
	}

	available, err := strconv.ParseBool(availableFilter)
	if err == nil {
		filter.Available = &available
	}

	limit, err := strconv.Atoi(limitFilter)
	if err == nil && limit > 0 {
		filter.Limit = &limit
	}

	if filter.Type != nil || filter.Available != nil || filter.Limit != nil {
		addresses, err = h.addressService.GetAllAddresses(&filter)
	} else {
		addresses, err = h.addressService.GetAllAddresses(nil)
	}

	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	var responses []dto.AddressResponse
	for _, address := range addresses {
		response := dto.AddressResponse{
			ID:           address.ID,
			Type:         string(address.Type),
			Street:       address.Street,
			Number:       address.Number,
			Neighborhood: address.Neighborhood,
			City:         address.City,
			State:        address.State,
			ZipCode:      address.ZipCode,
			Country:      address.Country,
			CreatedAt:    address.CreatedAt.Format(time.RFC3339),
		}

		if address.UpdatedAt != nil {
			updatedAt := address.UpdatedAt.Format(time.RFC3339)
			response.UpdatedAt = &updatedAt
		}

		responses = append(responses, response)
	}

	writeJSON(w, http.StatusOK, responses)
}

func (h *AddressHandler) UpdateAddress(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	var req dto.UpdateAddressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	address, err := h.addressService.UpdateAddress(id, &req)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	response := &dto.AddressResponse{
		ID:           address.ID,
		Type:         string(address.Type),
		Street:       address.Street,
		Number:       address.Number,
		Neighborhood: address.Neighborhood,
		City:         address.City,
		State:        address.State,
		ZipCode:      address.ZipCode,
		Country:      address.Country,
		CreatedAt:    address.CreatedAt.Format(time.RFC3339),
	}

	if address.UpdatedAt != nil {
		updatedAt := address.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *AddressHandler) DeleteAddress(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	err = h.addressService.DeleteAddress(id)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
