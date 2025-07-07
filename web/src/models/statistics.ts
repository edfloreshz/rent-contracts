export interface OverallStatistics {
    // Contract Statistics
    totalContracts: number;
    activeContracts: number;
    expiredContracts: number;

    // Property Statistics
    totalProperties: number;
    occupiedProperties: number;
    vacantProperties: number;

    // User Statistics
    totalTenants: number;
    totalReferences: number;
    activeTenants: number;

    // Financial Statistics
    monthlyRevenue: number;
    averageRent: number;
    totalRevenue: number;

    // Performance Statistics
    occupancyRate: number;
    averageContractDuration: number; // in days
}
