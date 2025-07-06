package handlers

import (
	"net/http"

	"github.com/edfloreshz/rent-contracts/src/services"
	"github.com/gin-gonic/gin"
)

type StatisticsHandler struct {
	statisticsService *services.StatisticsService
}

func NewStatisticsHandler(statisticsService *services.StatisticsService) *StatisticsHandler {
	return &StatisticsHandler{
		statisticsService: statisticsService,
	}
}

func (h *StatisticsHandler) GetOverallStatistics(c *gin.Context) {
	stats, err := h.statisticsService.GetOverallContractStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}
