import { NextRequest, NextResponse } from "next/server";
import { updateCustomer, createAddress, updateAddress, setDefaultAddress } from "@/lib/shopify/customer-api";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("shopify_customer_token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === "updateProfile") {
        const { firstName, lastName, email, phone } = body;
        const result = await updateCustomer(token, { firstName, lastName, email, phone });
        if (result.customerUserErrors.length) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    }

    if (action === "createAddress") {
        const { address } = body;
        const result = await createAddress(token, address);
        if (result.customerUserErrors.length) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    }

    if (action === "updateAddress") {
        const { id, address } = body;
        const result = await updateAddress(token, id, address);
        if (result.customerUserErrors.length) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    }

    if (action === "setDefaultAddress") {
        const { addressId } = body;
        const result = await setDefaultAddress(token, addressId);
        if (result.customerUserErrors.length) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
