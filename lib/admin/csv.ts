/** Tiny CSV writer — Excel-friendly (BOM + CRLF), with formula-injection guard. */

type Cell = string | number | boolean | null | undefined;

function escapeCell(value: Cell): string {
    if (value === null || value === undefined) return "";
    let s = String(value);
    // Cells starting with = + - @ would run as formulas in Excel/Sheets
    if (/^[=+\-@\t\r]/.test(s) && typeof value === "string") s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: Cell[][]): string {
    return "﻿" + [header, ...rows].map((r) => r.map(escapeCell).join(",")).join("\r\n") + "\r\n";
}

export function csvResponse(csv: string, filename: string): Response {
    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename.replace(/[^A-Za-z0-9._-]/g, "_")}"`,
            "Cache-Control": "no-store",
        },
    });
}
