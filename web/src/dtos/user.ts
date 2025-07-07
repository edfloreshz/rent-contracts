import type { UserType } from "../types";

export interface CreateUser {
    type: UserType;
    addressId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
}

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
