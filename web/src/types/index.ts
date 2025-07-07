export const AddressType = {
    Tenant: "tenant",
    Property: "property",
    Reference: "reference",
} as const;

export type AddressType = typeof AddressType[keyof typeof AddressType];

export const UserType = {
    Admin: "admin",
    Tenant: "tenant",
    Reference: "reference",
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

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
