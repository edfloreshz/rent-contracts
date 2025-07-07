import type { ContractStatus, ContractType } from "../types";
import type { Address } from "./address";
import type { User } from "./user";

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
