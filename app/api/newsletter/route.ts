import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const supportEmail = process.env.SUPPORT_EMAIL;
    const senderEmail = process.env.EMAIL;
    const appPassword = process.env.APP_PASSWORD;

    if (!supportEmail || !senderEmail || !appPassword) {
        console.error("Missing email environment variables.");
        return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: senderEmail,
            pass: appPassword,
        },
    });

    await transporter.sendMail({
        from: `"Senz8 Aroma" <${senderEmail}>`,
        to: supportEmail,
        subject: `[Newsletter] New subscriber — ${email}`,
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
                <h2 style="border-bottom:2px solid #d4af37;padding-bottom:8px;color:#d4af37">
                    New Newsletter Subscriber
                </h2>
                <p style="margin-top:20px;font-size:15px">
                    A new visitor signed up to stay in the loop:
                </p>
                <p style="font-size:18px;font-weight:bold;margin:12px 0">
                    <a href="mailto:${email}">${email}</a>
                </p>
                <p style="font-size:12px;color:#888;margin-top:24px">
                    Submitted via the Senz8 Aroma footer newsletter form.
                </p>
            </div>
        `,
    });

    return NextResponse.json({ ok: true });
}
