package services

import (
	"database/sql"

	"github.com/edfloreshz/rent-contracts/src/models"
	"gorm.io/gorm"
)

type StatisticsService struct {
	db *gorm.DB
}

// OverallStatistics represents the overall statistics response
type OverallStatistics struct {
	// Contract Statistics
	TotalContracts   int64 `json:"totalContracts"`
	ActiveContracts  int64 `json:"activeContracts"`
	ExpiredContracts int64 `json:"expiredContracts"`

	// Property Statistics
	TotalProperties    int64 `json:"totalProperties"`
	OccupiedProperties int64 `json:"occupiedProperties"`
	VacantProperties   int64 `json:"vacantProperties"`

	// User Statistics
	TotalTenants    int64 `json:"totalTenants"`
	TotalReferences int64 `json:"totalReferences"`
	ActiveTenants   int64 `json:"activeTenants"`

	// Financial Statistics
	MonthlyRevenue float64 `json:"monthlyRevenue"`
	AverageRent    float64 `json:"averageRent"`
	TotalRevenue   float64 `json:"totalRevenue"`

	// Performance Statistics
	OccupancyRate           float64 `json:"occupancyRate"`
	AverageContractDuration int     `json:"averageContractDuration"` // in days
}

func NewStatisticsService(db *gorm.DB) *StatisticsService {
	return &StatisticsService{
		db: db,
	}
}

// GetOverallContractStatistics returns comprehensive statistics for landlords
func (s *StatisticsService) GetOverallContractStatistics() (*OverallStatistics, error) {
	stats := &OverallStatistics{}

	// Total contracts
	err := s.db.Model(&models.Contract{}).
		Where("deletedat IS NULL").
		Count(&stats.TotalContracts).Error
	if err != nil {
		return nil, err
	}

	// Active contracts (contracts with status = 'active' in current version)
	err = s.db.Table("contracts").
		Joins("LEFT JOIN contractversions ON contracts.currentversionid = contractversions.id").
		Where("contracts.deletedat IS NULL AND contractversions.status = ?", models.ActiveContract).
		Count(&stats.ActiveContracts).Error
	if err != nil {
		return nil, err
	}

	// Expired contracts (contracts with status = 'expired' in current version)
	err = s.db.Table("contracts").
		Joins("LEFT JOIN contractversions ON contracts.currentversionid = contractversions.id").
		Where("contracts.deletedat IS NULL AND contractversions.status = ?", models.ExpiredContract).
		Count(&stats.ExpiredContracts).Error
	if err != nil {
		return nil, err
	}

	// Total properties (addresses of type 'property')
	err = s.db.Model(&models.Address{}).
		Where("deletedat IS NULL AND type = ?", models.PropertyAddress).
		Count(&stats.TotalProperties).Error
	if err != nil {
		return nil, err
	}

	// Occupied properties (properties with active contracts)
	err = s.db.Table("addresses").
		Joins("JOIN contracts ON addresses.id = contracts.addressid").
		Joins("LEFT JOIN contractversions ON contracts.currentversionid = contractversions.id").
		Where("addresses.deletedat IS NULL AND addresses.type = ? AND contracts.deletedat IS NULL AND contractversions.status = ?", models.PropertyAddress, models.ActiveContract).
		Count(&stats.OccupiedProperties).Error
	if err != nil {
		return nil, err
	}

	// Vacant properties
	stats.VacantProperties = stats.TotalProperties - stats.OccupiedProperties

	// Total tenants
	err = s.db.Model(&models.User{}).
		Where("deletedat IS NULL AND type = ?", "tenant").
		Count(&stats.TotalTenants).Error
	if err != nil {
		return nil, err
	}

	// Total references
	err = s.db.Model(&models.User{}).
		Where("deletedat IS NULL AND type = ?", "reference").
		Count(&stats.TotalReferences).Error
	if err != nil {
		return nil, err
	}

	// Active tenants (tenants with active contracts)
	err = s.db.Table("users").
		Joins("JOIN contracts ON users.id = contracts.tenantid").
		Joins("LEFT JOIN contractversions ON contracts.currentversionid = contractversions.id").
		Where("users.deletedat IS NULL AND users.type = ? AND contracts.deletedat IS NULL AND contractversions.status = ?", "tenant", models.ActiveContract).
		Count(&stats.ActiveTenants).Error
	if err != nil {
		return nil, err
	}

	// Monthly revenue (sum of rent from active contracts)
	err = s.db.Table("contracts").
		Joins("LEFT JOIN contractversions ON contracts.currentversionid = contractversions.id").
		Where("contracts.deletedat IS NULL AND contractversions.status = ?", models.ActiveContract).
		Select("COALESCE(SUM(contractversions.rent), 0)").
		Scan(&stats.MonthlyRevenue).Error
	if err != nil {
		return nil, err
	}

	// Average rent (average rent from active contracts)
	if stats.ActiveContracts > 0 {
		stats.AverageRent = stats.MonthlyRevenue / float64(stats.ActiveContracts)
	}

	// Total revenue (sum of all rent - for simplicity, calculating as monthly revenue * 12)
	// In a real scenario, you might want to sum actual payments received
	stats.TotalRevenue = stats.MonthlyRevenue * 12

	// Occupancy rate
	if stats.TotalProperties > 0 {
		stats.OccupancyRate = (float64(stats.OccupiedProperties) / float64(stats.TotalProperties)) * 100
	}

	// Average contract duration (in days)
	var avgDuration sql.NullFloat64
	err = s.db.Table("contractversions").
		Where("startdate IS NOT NULL AND enddate IS NOT NULL").
		Select("AVG(enddate - startdate)").
		Scan(&avgDuration).Error
	if err != nil {
		return nil, err
	}
	if avgDuration.Valid {
		stats.AverageContractDuration = int(avgDuration.Float64)
	}

	return stats, nil
}
