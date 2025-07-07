import type { AddressType } from "../types";
import type { Contract } from "./contract";

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
