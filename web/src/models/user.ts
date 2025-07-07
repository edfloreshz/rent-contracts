import type { UserType } from "../types";
import type { Address } from "./address";

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
