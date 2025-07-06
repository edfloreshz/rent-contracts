export const AddressType = {
    Tenant: "tenant",
    Property: "property",
    Reference: "reference",
} as const;

export type AddressType = typeof AddressType[keyof typeof AddressType];

export interface Address {
    id: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    type: AddressType;
    contracts?: Contract[];
    createdAt: string;
    updatedAt?: string;
}

export const UserType = {
    Admin: "admin",
    Tenant: "tenant",
    Reference: "reference",
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export interface User {
    id: string;
    type: UserType;
    addressId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt?: string;
    address: Address;
}

export const ContractStatus = {
    Active: "active",
    Expired: "expired",
    Terminated: "terminated",
} as const;

export type ContractStatus = typeof ContractStatus[keyof typeof ContractStatus];

export const ContractType = {
    Yearly: "yearly",
} as const;

export type ContractType = typeof ContractType[keyof typeof ContractType];

export interface ContractVersion {
    id: string;
    contractId: string;
    versionNumber: number;
    rent: number;
    rentIncreasePercentage: number;
    business: string;
    status: ContractStatus;
    type: ContractType;
    startDate: string;
    endDate: string;
    renewalDate?: string;
    specialTerms?: string;
    createdAt: string;
}

export interface Contract {
    id: string;
    currentVersionId?: string;
    landlordId: string;
    tenantId: string;
    addressId: string;
    deposit: number;
    createdAt: string;
    updatedAt?: string;
    currentVersion?: ContractVersion;
    landlord?: User;
    tenant: User;
    address: Address;
    versions: ContractVersion[];
    references: User[];
}

// Create types
export interface CreateUser {
    type: UserType;
    addressId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface CreateTenant extends CreateUser {
    type: "tenant";
}

export interface CreateAddress {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    type: AddressType;
}

export interface CreateReference extends CreateUser {
    type: "reference";
}

export interface CreateContract {
    landlordId: string;
    tenantId: string;
    addressId: string;
    deposit: number;
    referenceIds?: string[];
}

export interface CreateContractVersion {
    contractId: string;
    deposit: number;
    rent: number;
    rentIncreasePercentage: number;
    business: string;
    status: ContractStatus;
    type: ContractType;
    startDate: string;
    endDate: string;
    renewalDate?: string;
    specialTerms?: string;
}

// Update types
export interface UpdateUser {
    id: string;
    type?: UserType;
    addressId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface UpdateTenant extends UpdateUser {
    type?: "tenant";
}

export interface UpdateAddress {
    id: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    type?: AddressType;
}

export interface UpdateReference extends UpdateUser {
    type?: "reference";
}

export interface UpdateContract {
    id: string;
    landlordId?: string;
    tenantId?: string;
    addressId?: string;
    deposit?: number;
    referenceIds?: string[];
}

export interface UpdateContractVersion {
    id: string;
    rent?: number;
    rentIncreasePercentage?: number;
    business?: string;
    status?: ContractStatus;
    type?: ContractType;
    startDate?: string;
    endDate?: string;
    renewalDate?: string;
    specialTerms?: string;
}

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
