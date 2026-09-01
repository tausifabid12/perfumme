import { shopifyFetch } from "./client";
import {
    CUSTOMER_ACCESS_TOKEN_CREATE,
    CUSTOMER_CREATE,
    CUSTOMER_ACCESS_TOKEN_DELETE,
    GET_CUSTOMER,
    CUSTOMER_UPDATE,
    CUSTOMER_ADDRESS_CREATE,
    CUSTOMER_ADDRESS_UPDATE,
    CUSTOMER_DEFAULT_ADDRESS_UPDATE,
    CUSTOMER_PASSWORD_RESET,
} from "./customer-queries";

export type CustomerAddress = {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
};

export type CustomerOrder = {
    id: string;
    name: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    currentTotalPrice: { amount: string; currencyCode: string };
    lineItems: {
        nodes: {
            title: string;
            quantity: number;
            variant: {
                price: { amount: string; currencyCode: string };
                image: { url: string; altText: string } | null;
            } | null;
        }[];
    };
};

export type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    defaultAddress: CustomerAddress | null;
    addresses: { nodes: CustomerAddress[] };
    orders: { nodes: CustomerOrder[] };
};

type UserError = { code: string; field: string[]; message: string };

// ── Login ─────────────────────────────────────────────────────────────────────
export async function customerLogin(email: string, password: string) {
    const data = await shopifyFetch<{
        customerAccessTokenCreate: {
            customerAccessToken: { accessToken: string; expiresAt: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_ACCESS_TOKEN_CREATE, { input: { email, password } });

    return data.customerAccessTokenCreate;
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function customerRegister(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptsMarketing?: boolean;
}) {
    const data = await shopifyFetch<{
        customerCreate: {
            customer: { id: string; email: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_CREATE, { input });

    return data.customerCreate;
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function customerLogout(token: string) {
    await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: token });
}

// ── Get profile ───────────────────────────────────────────────────────────────
export async function getCustomer(token: string): Promise<Customer | null> {
    try {
        const data = await shopifyFetch<{ customer: Customer | null }>(
            GET_CUSTOMER,
            { customerAccessToken: token }
        );
        return data.customer;
    } catch {
        return null;
    }
}

// ── Update profile ────────────────────────────────────────────────────────────
export async function updateCustomer(
    token: string,
    input: { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string }
) {
    const data = await shopifyFetch<{
        customerUpdate: {
            customer: { id: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_UPDATE, { customerAccessToken: token, customer: input });

    return data.customerUpdate;
}

// ── Create address ────────────────────────────────────────────────────────────
export async function createAddress(token: string, address: Omit<CustomerAddress, "id">) {
    const data = await shopifyFetch<{
        customerAddressCreate: {
            customerAddress: { id: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_ADDRESS_CREATE, { customerAccessToken: token, address });

    return data.customerAddressCreate;
}

// ── Update address ────────────────────────────────────────────────────────────
export async function updateAddress(token: string, id: string, address: Omit<CustomerAddress, "id">) {
    const data = await shopifyFetch<{
        customerAddressUpdate: {
            customerAddress: { id: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_ADDRESS_UPDATE, { customerAccessToken: token, id, address });

    return data.customerAddressUpdate;
}

// ── Set default address ───────────────────────────────────────────────────────
export async function setDefaultAddress(token: string, addressId: string) {
    const data = await shopifyFetch<{
        customerDefaultAddressUpdate: {
            customer: { id: string } | null;
            customerUserErrors: UserError[];
        };
    }>(CUSTOMER_DEFAULT_ADDRESS_UPDATE, { customerAccessToken: token, addressId });

    return data.customerDefaultAddressUpdate;
}

// ── Password reset ────────────────────────────────────────────────────────────
export async function sendPasswordReset(email: string) {
    const data = await shopifyFetch<{
        customerRecover: { customerUserErrors: UserError[] };
    }>(CUSTOMER_PASSWORD_RESET, { email });

    return data.customerRecover;
}
