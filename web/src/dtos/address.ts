import type { AddressType } from "../types";

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
