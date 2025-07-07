import type {
    Address,
    Contract,
    ContractVersion,
    CreateAddress,
    CreateContract,
    CreateContractVersion,
    CreateReference,
    CreateTenant,
    CreateUser,
    OverallStatistics,
    UpdateAddress,
    UpdateContract,
    UpdateReference,
    UpdateTenant,
    UpdateUser,
    User,
} from "../types";

class ApiService {
    private baseUrl: string;

    constructor() {
        // Use environment variable for API base URL, fallback to relative URL for development
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        console.log("Making API request to:", fullUrl);

        // Only set Content-Type for requests with a body
        const headers: Record<string, string> = {};
        if (options.body) {
            headers["Content-Type"] = "application/json";
        }

        // Convert request body to snake_case if it's a JSON string
        let body = options.body;
        if (body && typeof body === "string") {
            try {
                const data = JSON.parse(body);
                body = JSON.stringify(data);
            } catch (error) {
                console.warn(
                    "Failed to parse request body for case conversion:",
                    error,
                );
            }
        }

        const response = await fetch(fullUrl, {
            headers: {
                ...headers,
                ...options.headers,
            },
            ...options,
            body,
        });

        console.log("API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", response.status, errorText);
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`,
            );
        }

        // Check if response has content before trying to parse JSON
        const contentType = response.headers.get("content-type");
        const contentLength = response.headers.get("content-length");

        // If no content or content-length is 0, return empty for void responses
        if (
            !contentType?.includes("application/json") ||
            contentLength === "0" || response.status === 204
        ) {
            return undefined as T;
        }

        // Try to parse JSON only if we expect content
        const text = await response.text();
        if (!text) {
            return undefined as T;
        }

        try {
            return JSON.parse(text) ?? [] as T;
        } catch (error) {
            console.warn("Failed to parse JSON response:", error);
            return undefined as T;
        }
    }

    // Address endpoints
    getAddresses = (): Promise<Address[]> => {
        return this.request<Address[]>("/api/v1/addresses");
    };

    getTenantAddresses = (): Promise<Address[]> => {
        return this.request<Address[]>("/api/v1/addresses?type=tenant");
    };

    getPropertyAddresses = (): Promise<Address[]> => {
        return this.request<Address[]>("/api/v1/addresses?type=property");
    };

    getReferenceAddresses = (): Promise<Address[]> => {
        return this.request<Address[]>("/api/v1/addresses?type=reference");
    };

    getAddress = (id: string): Promise<Address> => {
        return this.request<Address>(`/api/v1/addresses/${id}`);
    };

    createAddress = (address: CreateAddress): Promise<Address> => {
        return this.request<Address>("/api/v1/addresses", {
            method: "POST",
            body: JSON.stringify(address),
        });
    };

    updateAddress = (address: UpdateAddress): Promise<Address> => {
        return this.request<Address>(`/api/v1/addresses/${address.id}`, {
            method: "PUT",
            body: JSON.stringify(address),
        });
    };

    deleteAddress = (id: string): Promise<void> => {
        return this.request<void>(`/api/v1/addresses/${id}`, {
            method: "DELETE",
        });
    };

    // User endpoints
    getUsers = (type?: "admin" | "tenant" | "reference"): Promise<User[]> => {
        const query = type ? `?type=${type}` : "";
        return this.request<User[]>(`/api/v1/users${query}`);
    };

    getUser = (id: string): Promise<User> => {
        return this.request<User>(`/api/v1/users/${id}`);
    };

    createUser = (user: CreateUser): Promise<User> => {
        return this.request<User>("/api/v1/users", {
            method: "POST",
            body: JSON.stringify(user),
        });
    };

    updateUser = (user: UpdateUser): Promise<User> => {
        return this.request<User>(`/api/v1/users/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(user),
        });
    };

    deleteUser = (id: string): Promise<void> => {
        return this.request<void>(`/api/v1/users/${id}`, {
            method: "DELETE",
        });
    };

    // Tenant endpoints (wrapper around user endpoints)
    getTenants = (): Promise<User[]> => {
        return this.getUsers("tenant") as Promise<User[]>;
    };

    getTenant = (id: string): Promise<User> => {
        return this.getUser(id) as Promise<User>;
    };

    createTenant = (tenant: CreateTenant): Promise<User> => {
        return this.createUser(tenant) as Promise<User>;
    };

    updateTenant = (tenant: UpdateTenant): Promise<User> => {
        return this.updateUser(tenant) as Promise<User>;
    };

    deleteTenant = (id: string): Promise<void> => {
        return this.deleteUser(id);
    };

    // Reference endpoints (wrapper around user endpoints)
    getReferences = (): Promise<User[]> => {
        return this.getUsers("reference") as Promise<User[]>;
    };

    getReference = (id: string): Promise<User> => {
        return this.getUser(id) as Promise<User>;
    };

    createReference = (reference: CreateReference): Promise<User> => {
        return this.createUser(reference) as Promise<User>;
    };

    updateReference = (reference: UpdateReference): Promise<User> => {
        return this.updateUser(reference) as Promise<User>;
    };

    deleteReference = (id: string): Promise<void> => {
        return this.deleteUser(id);
    };

    // Contract endpoints
    getContracts = (tenantId?: string): Promise<Contract[]> => {
        console.log(tenantId);
        const query = tenantId ? `?tenantId=${tenantId}` : "";
        return this.request<Contract[]>(`/api/v1/contracts${query}`);
    };

    getContract = (id: string): Promise<Contract> => {
        return this.request<Contract>(`/api/v1/contracts/${id}`);
    };

    createContract = (contract: CreateContract): Promise<Contract> => {
        return this.request<Contract>("/api/v1/contracts", {
            method: "POST",
            body: JSON.stringify(contract),
        });
    };

    updateContract = (contract: UpdateContract): Promise<Contract> => {
        return this.request<Contract>(`/api/v1/contracts/${contract.id}`, {
            method: "PUT",
            body: JSON.stringify(contract),
        });
    };

    deleteContract = (id: string): Promise<void> => {
        return this.request<void>(`/api/v1/contracts/${id}`, {
            method: "DELETE",
        });
    };

    // Contract version endpoints
    createContractVersion = (
        version: CreateContractVersion,
    ): Promise<ContractVersion> => {
        return this.request<ContractVersion>("/api/v1/contracts/versions", {
            method: "POST",
            body: JSON.stringify(version),
        });
    };

    getContractVersions = (contractId: string): Promise<ContractVersion[]> => {
        return this.request<ContractVersion[]>(
            `/api/v1/contracts/${contractId}/versions`,
        );
    };

    getContractDocument = (
        contractId: string,
        versionId?: string,
    ): Promise<Blob> => {
        const url = versionId
            ? `${this.baseUrl}/api/v1/contracts/${contractId}/document?versionId=${versionId}`
            : `${this.baseUrl}/api/v1/contracts/${contractId}/document`;
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            });
    };

    // Statistics
    getOverallStatistics = (): Promise<OverallStatistics> => {
        return this.request<OverallStatistics>("/api/v1/statistics/overall");
    };
}

export const apiService = new ApiService();
