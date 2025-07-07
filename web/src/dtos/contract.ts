import type { ContractStatus, ContractType } from "../types";

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
