"use client";

import { useState } from "react";
import { X } from "lucide-react";
import WhatsAppOtpForm from "@/components/WhatsAppOtpForm";

/**
 * Checkout gate for signed-out visitors: WhatsApp OTP signs them in (account
 * created on first use), then onVerified() continues to checkout. Mount it
 * only while open so every opening starts fresh.
 */
export default function WhatsAppOtpModal({
    onClose, onVerified,
}: {
    onClose: () => void;
    onVerified: () => void | Promise<void>;
}) {
    const [busy, setBusy] = useState(false);

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => !busy && onClose()}>
            <div
                role="dialog" aria-modal="true" aria-labelledby="wa-otp-title"
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-[400px] rounded-2xl p-7"
                style={{
                    background: "linear-gradient(160deg, #111116 0%, #0a0a0f 100%)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                }}
            >
                <div className="absolute top-0 left-6 right-6 h-[1px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }} />

                <button onClick={onClose} disabled={busy} aria-label="Close"
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,245,245,0.5)" }}>
                    <X size={14} />
                </button>

                <WhatsAppOtpForm
                    headingId="wa-otp-title"
                    title="Verify to check out"
                    intro="Enter your WhatsApp number and we'll send a one-time code to complete your order."
                    verifyLabel="Verify & checkout"
                    onVerified={async () => {
                        setBusy(true);
                        await onVerified();
                        setBusy(false);
                    }}
                />
            </div>
        </div>
    );
}
