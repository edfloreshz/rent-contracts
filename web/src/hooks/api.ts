import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Address hooks
export const useAddresses = () => {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: apiService.getAddresses,
    });
};

export const useTenantAddresses = () => {
    return useQuery({
        queryKey: ["addresses", "tenant"],
        queryFn: apiService.getTenantAddresses,
    });
};

export const usePropertyAddresses = () => {
    return useQuery({
        queryKey: ["addresses", "property"],
        queryFn: apiService.getPropertyAddresses,
    });
};

export const useAvailablePropertyAddresses = () => {
    return useQuery({
        queryKey: ["addresses", "property"],
        queryFn: apiService.getAvailablePropertyAddresses,
    });
};

export const useReferenceAddresses = () => {
    return useQuery({
        queryKey: ["addresses", "reference"],
        queryFn: apiService.getReferenceAddresses,
    });
};

export const useAddress = (id: string) => {
    return useQuery({
        queryKey: ["address", id],
        queryFn: () => apiService.getAddress(id),
        enabled: !!id,
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

// Tenant hooks
export const useTenants = () => {
    return useQuery({
        queryKey: ["tenants"],
        queryFn: apiService.getTenants,
    });
};

export const useTenant = (id: string) => {
    return useQuery({
        queryKey: ["tenant", id],
        queryFn: () => apiService.getTenant(id),
        enabled: !!id,
    });
};

export const useCreateTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createTenant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
    });
};

export const useUpdateTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateTenant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
    });
};

export const useDeleteTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteTenant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
    });
};

// Reference hooks
export const useReferences = () => {
    return useQuery({
        queryKey: ["references"],
        queryFn: apiService.getReferences,
    });
};

export const useReference = (id: string) => {
    return useQuery({
        queryKey: ["reference", id],
        queryFn: () => apiService.getReference(id),
        enabled: !!id,
    });
};

export const useCreateReference = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createReference,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

export const useUpdateReference = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateReference,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

export const useDeleteReference = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteReference,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

// Contract hooks
export const useContracts = (tenantId?: string) => {
    return useQuery({
        queryKey: ["contracts", tenantId],
        queryFn: () => apiService.getContracts(tenantId),
    });
};

export const useContract = (id: string) => {
    return useQuery({
        queryKey: ["contract", id],
        queryFn: () => apiService.getContract(id),
        enabled: !!id,
    });
};

export const useCreateContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createContract,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
};

export const useUpdateContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateContract,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
};

export const useDeleteContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteContract,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
};

export const useGenerateContractPdf = () => {
    return useMutation({
        mutationFn: (
            { contractId, versionId }: {
                contractId: string;
                versionId?: string;
            },
        ) => apiService.getContractDocument(contractId, versionId),
    });
};

// User hooks
export const useUsers = (type?: "admin" | "tenant" | "reference") => {
    return useQuery({
        queryKey: ["users", type],
        queryFn: () => apiService.getUsers(type),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => apiService.getUser(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            queryClient.invalidateQueries({ queryKey: ["references"] });
        },
    });
};

// Contract version hooks
export const useCreateContractVersion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createContractVersion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
};

export const useContractVersions = (contractId: string) => {
    return useQuery({
        queryKey: ["contract-versions", contractId],
        queryFn: () => apiService.getContractVersions(contractId),
        enabled: !!contractId,
    });
};

export const useContractDocument = () => {
    return useMutation({
        mutationFn: apiService.getContractDocument,
    });
};

// Statistics hooks
export const useOverallStatistics = () => {
    return useQuery({
        queryKey: ["statistics", "overall"],
        queryFn: apiService.getOverallStatistics,
    });
};
