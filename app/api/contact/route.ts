import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
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
        from: `"Senz8 Contact Form" <${senderEmail}>`,
        to: supportEmail,
        replyTo: email,
        subject: `[Contact] ${subject ?? "General Enquiry"} — ${name}`,
        html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
                <h2 style="border-bottom:2px solid #d4af37;padding-bottom:8px;color:#d4af37">
                    New Contact Form Submission
                </h2>
                <table style="width:100%;border-collapse:collapse;margin-top:16px">
                    <tr>
                        <td style="padding:8px 0;font-weight:bold;width:100px">Name</td>
                        <td style="padding:8px 0">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;font-weight:bold">Email</td>
                        <td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;font-weight:bold">Subject</td>
                        <td style="padding:8px 0">${subject ?? "—"}</td>
                    </tr>
                </table>
                <h3 style="margin-top:24px;margin-bottom:8px">Message</h3>
                <p style="background:#f5f5f5;padding:16px;border-radius:6px;white-space:pre-wrap;margin:0">${message}</p>
                <p style="margin-top:24px;font-size:12px;color:#888">
                    Sent via the Senz8 Aroma contact form · Reply directly to this email to respond to ${name}.
                </p>
            </div>
        `,
    });

    return NextResponse.json({ ok: true });
}
