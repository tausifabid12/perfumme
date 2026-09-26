import { NextRequest, NextResponse } from "next/server";
import { updateCustomer, createAddress, updateAddress, setDefaultAddress } from "@/lib/shopify/customer-api";

type UserErrors = { message: string }[];

const fail = (errors: UserErrors) =>
    NextResponse.json({ error: errors[0].message }, { status: 400 });

export async function POST(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // shopifyFetch throws on GraphQL/network errors — always answer with JSON
    // so the form can show the message instead of hanging on res.json().
    try {
        if (action === "updateProfile") {
            const { firstName, lastName, email, phone } = body;
            const result = await updateCustomer(token, { firstName, lastName, email, phone });
            if (result.customerUserErrors.length) return fail(result.customerUserErrors);
            return NextResponse.json({ ok: true });
        }

        if (action === "createAddress") {
            const { address, makeDefault } = body;
            const result = await createAddress(token, address);
            if (result.customerUserErrors.length || !result.customerAddress) {
                return fail(result.customerUserErrors.length ? result.customerUserErrors : [{ message: "Could not save address" }]);
            }
            if (makeDefault) {
                const def = await setDefaultAddress(token, result.customerAddress.id);
                if (def.customerUserErrors.length) return fail(def.customerUserErrors);
            }
            return NextResponse.json({ ok: true, id: result.customerAddress.id });
        }

        if (action === "updateAddress") {
            const { id, address, makeDefault } = body;
            const result = await updateAddress(token, id, address);
            if (result.customerUserErrors.length) return fail(result.customerUserErrors);
            // Shopify may return a new ID for an updated address
            const newId = result.customerAddress?.id ?? id;
            if (makeDefault) {
                const def = await setDefaultAddress(token, newId);
                if (def.customerUserErrors.length) return fail(def.customerUserErrors);
            }
            return NextResponse.json({ ok: true, id: newId });
        }

        if (action === "setDefaultAddress") {
            const { addressId } = body;
            const result = await setDefaultAddress(token, addressId);
            if (result.customerUserErrors.length) return fail(result.customerUserErrors);
            return NextResponse.json({ ok: true });
        }
    } catch (err) {
        console.error(`account update (${action}) failed:`, err);
        const message = err instanceof Error ? err.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
