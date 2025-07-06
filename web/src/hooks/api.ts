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

// Guarantor hooks
export const useGuarantors = () => {
    return useQuery({
        queryKey: ["guarantors"],
        queryFn: apiService.getGuarantors,
    });
};

export const useGuarantor = (id: string) => {
    return useQuery({
        queryKey: ["guarantor", id],
        queryFn: () => apiService.getGuarantor(id),
        enabled: !!id,
    });
};

export const useCreateGuarantor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.createGuarantor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
        },
    });
};

export const useUpdateGuarantor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.updateGuarantor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
        },
    });
};

export const useDeleteGuarantor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.deleteGuarantor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
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
        mutationFn: apiService.getContractDocument,
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
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
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
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
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
            queryClient.invalidateQueries({ queryKey: ["guarantors"] });
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
