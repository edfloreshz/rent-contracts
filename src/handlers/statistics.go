package handlers

import (
	"net/http"

	"github.com/edfloreshz/rent-contracts/src/services"
)

type StatisticsHandler struct {
	statisticsService *services.StatisticsService
}

func NewStatisticsHandler(statisticsService *services.StatisticsService) *StatisticsHandler {
	return &StatisticsHandler{
		statisticsService: statisticsService,
	}
}

func (h *StatisticsHandler) GetOverallStatistics(w http.ResponseWriter, r *http.Request) {
	stats, err := h.statisticsService.GetOverallContractStatistics()
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to retrieve overall statistics")
		return
	}

	writeJSON(w, http.StatusOK, stats)
}
