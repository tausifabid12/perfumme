/**
 * GET /api/admin/eshipz/manifest?id=<manifest_id>
 * Streams the handover manifest PDF. Proxied so the eShipz token never reaches the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { fetchManifestPdf } from "@/lib/admin/eshipz";

export async function GET(req: NextRequest) {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id") ?? "";
    if (!/^[A-Za-z0-9]{6,40}$/.test(id)) return NextResponse.json({ error: "Invalid manifest id" }, { status: 400 });

    const upstream = await fetchManifestPdf(id);
    if (!upstream.ok) {
        return NextResponse.json({ error: `eShipz returned ${upstream.status}` }, { status: 502 });
    }

    const type = upstream.headers.get("content-type") ?? "application/pdf";
    // Some accounts get a JSON body with a link to the PDF instead of the file itself
    if (type.includes("json")) {
        const json = await upstream.json().catch(() => null);
        const url = json?.url ?? json?.data?.url ?? json?.manifest_url;
        if (typeof url === "string" && url.startsWith("https://")) return NextResponse.redirect(url);
        return NextResponse.json({ error: "Manifest is not ready yet — try again in a minute." }, { status: 502 });
    }

    return new NextResponse(upstream.body, {
        headers: {
            "Content-Type": type,
            "Content-Disposition": `inline; filename="manifest-${id}.pdf"`,
            "Cache-Control": "no-store",
        },
    });
}
