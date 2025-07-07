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

type ContractHandler struct {
	contractService *services.ContractService
}

func NewContractHandler(contractService *services.ContractService) *ContractHandler {
	return &ContractHandler{
		contractService: contractService,
	}
}

func (h *ContractHandler) CreateContract(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateContractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	contract, err := h.contractService.CreateContract(&req)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	response := &dto.ContractResponse{
		ID:               contract.ID,
		CurrentVersionID: contract.CurrentVersionID,
		LandlordID:       contract.LandlordID,
		TenantID:         contract.TenantID,
		AddressID:        contract.AddressID,
		Deposit:          contract.Deposit,
		CreatedAt:        contract.CreatedAt.Format(time.RFC3339),
	}

	if contract.UpdatedAt != nil {
		updatedAt := contract.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	writeJSON(w, http.StatusCreated, response)
}

func (h *ContractHandler) GetContract(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	contract, err := h.contractService.GetContractByID(id)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	response := h.buildContractResponse(contract)
	writeJSON(w, http.StatusCreated, response)
}

func (h *ContractHandler) GetAllContracts(w http.ResponseWriter, r *http.Request) {
	tenantIDStr := r.URL.Query().Get("tenantId")
	var contracts []models.Contract
	var err error

	if tenantIDStr != "" {
		tenantID, parseErr := uuid.Parse(tenantIDStr)
		if parseErr != nil {
			writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
			return
		}
		contracts, err = h.contractService.GetContractsByTenant(tenantID)
	} else {
		contracts, err = h.contractService.GetAllContracts()
	}

	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	var responses []dto.ContractResponse
	for _, contract := range contracts {
		response := h.buildContractResponse(&contract)
		responses = append(responses, *response)
	}

	writeJSON(w, http.StatusOK, responses)
}

func (h *ContractHandler) UpdateContract(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	var req dto.UpdateContractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	contract, err := h.contractService.UpdateContract(id, &req)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	response := h.buildContractResponse(contract)
	writeJSON(w, http.StatusCreated, response)
}

func (h *ContractHandler) DeleteContract(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	err = h.contractService.DeleteContract(id)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *ContractHandler) CreateContractVersion(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateContractVersionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	version, err := h.contractService.CreateContractVersion(&req)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	response := h.buildContractVersionResponse(version)
	writeJSON(w, http.StatusCreated, response)
}

func (h *ContractHandler) GetContractVersions(w http.ResponseWriter, r *http.Request) {
	contractIDStr := chi.URLParam(r, "id")
	contractID, err := uuid.Parse(contractIDStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	versions, err := h.contractService.GetContractVersionsByContractID(contractID)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	var responses []dto.ContractVersionResponse
	for _, version := range versions {
		response := h.buildContractVersionResponse(&version)
		responses = append(responses, *response)
	}

	writeJSON(w, http.StatusOK, responses)
}

func (h *ContractHandler) GetContractDocument(w http.ResponseWriter, r *http.Request) {
	contractIDStr := chi.URLParam(r, "id")
	contractID, err := uuid.Parse(contractIDStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
		return
	}

	// Get optional version ID from query parameters
	versionIDStr := r.URL.Query().Get("versionId")
	var versionID *uuid.UUID
	if versionIDStr != "" {
		parsedVersionID, err := uuid.Parse(versionIDStr)
		if err != nil {
			writeJSONError(w, http.StatusBadRequest, "Invalid UUID")
			return
		}
		versionID = &parsedVersionID
	}

	document, err := h.contractService.GetContractDocument(contractID, versionID)
	if err != nil {
		writeJSONError(w, http.StatusNotFound, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.WriteHeader(http.StatusOK)
	w.Write(document)
}

func (h *ContractHandler) buildContractResponse(contract *models.Contract) *dto.ContractResponse {
	response := &dto.ContractResponse{
		ID:               contract.ID,
		CurrentVersionID: contract.CurrentVersionID,
		LandlordID:       contract.LandlordID,
		TenantID:         contract.TenantID,
		AddressID:        contract.AddressID,
		Deposit:          contract.Deposit,
		CreatedAt:        contract.CreatedAt.Format(time.RFC3339),
	}

	if contract.UpdatedAt != nil {
		updatedAt := contract.UpdatedAt.Format(time.RFC3339)
		response.UpdatedAt = &updatedAt
	}

	// Include the current version if loaded
	if contract.CurrentVersion != nil {
		response.CurrentVersion = h.buildContractVersionResponse(contract.CurrentVersion)
	}

	// Include landlord if loaded
	if contract.Landlord.ID != uuid.Nil {
		response.Landlord = &dto.UserResponse{
			ID:         contract.Landlord.ID,
			Type:       string(contract.Landlord.Type),
			AddressID:  contract.Landlord.AddressID,
			FirstName:  contract.Landlord.FirstName,
			MiddleName: contract.Landlord.MiddleName,
			LastName:   contract.Landlord.LastName,
			Email:      contract.Landlord.Email,
			Phone:      contract.Landlord.Phone,
			CreatedAt:  contract.Landlord.CreatedAt.Format(time.RFC3339),
		}
	}

	// Include tenant if loaded
	if contract.Tenant.ID != uuid.Nil {
		response.Tenant = &dto.UserResponse{
			ID:         contract.Tenant.ID,
			Type:       string(contract.Tenant.Type),
			AddressID:  contract.Tenant.AddressID,
			FirstName:  contract.Tenant.FirstName,
			MiddleName: contract.Tenant.MiddleName,
			LastName:   contract.Tenant.LastName,
			Email:      contract.Tenant.Email,
			Phone:      contract.Tenant.Phone,
			CreatedAt:  contract.Tenant.CreatedAt.Format(time.RFC3339),
		}
	}

	// Include tenant address if loaded
	if contract.Tenant.Address.ID != uuid.Nil {
		response.Tenant.Address = &dto.AddressResponse{
			ID:           contract.Tenant.Address.ID,
			Type:         string(contract.Tenant.Address.Type),
			Street:       contract.Tenant.Address.Street,
			Number:       contract.Tenant.Address.Number,
			Neighborhood: contract.Tenant.Address.Neighborhood,
			City:         contract.Tenant.Address.City,
			State:        contract.Tenant.Address.State,
			ZipCode:      contract.Tenant.Address.ZipCode,
			Country:      contract.Tenant.Address.Country,
			CreatedAt:    contract.Tenant.Address.CreatedAt.Format(time.RFC3339),
		}
	}

	// Include address if loaded
	if contract.Address.ID != uuid.Nil {
		response.Address = &dto.AddressResponse{
			ID:           contract.Tenant.Address.ID,
			Type:         string(contract.Tenant.Address.Type),
			Street:       contract.Tenant.Address.Street,
			Number:       contract.Tenant.Address.Number,
			Neighborhood: contract.Tenant.Address.Neighborhood,
			City:         contract.Tenant.Address.City,
			State:        contract.Tenant.Address.State,
			ZipCode:      contract.Tenant.Address.ZipCode,
			Country:      contract.Tenant.Address.Country,
			CreatedAt:    contract.Tenant.Address.CreatedAt.Format(time.RFC3339),
		}
	}

	// Include versions if loaded
	if len(contract.Versions) > 0 {
		for _, version := range contract.Versions {
			versionResponse := h.buildContractVersionResponse(&version)
			response.Versions = append(response.Versions, *versionResponse)
		}
	}

	// Include references if loaded
	if len(contract.References) > 0 {
		for _, reference := range contract.References {
			referenceResponse := &dto.UserResponse{
				ID:         reference.ID,
				Type:       string(reference.Type),
				AddressID:  reference.AddressID,
				FirstName:  reference.FirstName,
				MiddleName: reference.MiddleName,
				LastName:   reference.LastName,
				Email:      reference.Email,
				Phone:      reference.Phone,
				CreatedAt:  reference.CreatedAt.Format(time.RFC3339),
			}
			response.References = append(response.References, *referenceResponse)
		}
	}

	return response
}

func (h *ContractHandler) buildContractVersionResponse(version *models.ContractVersion) *dto.ContractVersionResponse {
	response := &dto.ContractVersionResponse{
		ID:                     version.ID,
		ContractID:             version.ContractID,
		VersionNumber:          version.VersionNumber,
		Rent:                   version.Rent,
		RentIncreasePercentage: version.RentIncreasePercentage,
		Business:               version.Business,
		Status:                 string(version.Status),
		Type:                   string(version.Type),
		StartDate:              version.StartDate.Format("2006-01-02"),
		EndDate:                version.EndDate.Format("2006-01-02"),
		SpecialTerms:           version.SpecialTerms,
		CreatedAt:              version.CreatedAt.Format(time.RFC3339),
	}

	if version.RenewalDate != nil {
		renewalDate := version.RenewalDate.Format("2006-01-02")
		response.RenewalDate = &renewalDate
	}

	return response
}
