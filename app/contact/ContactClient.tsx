"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Send, MapPin, Mail, Phone, Check, Loader2 } from "lucide-react";
import CinematicNav from "@/components/Cinematicnav";
import SiteFooter from "@/components/SiteFooter";
import ScrollProgress from "@/lib/animations/scroll-progress";
import TransitionLink from "@/components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

// ── Contact info cards ────────────────────────────────────────────────────────
const INFO = [
    {
        icon: Mail,
        label: "Email Us",
        value: "hello@senz8.com",
        sub: "We reply within 24 hours",
        href: "mailto:hello@senz8.com",
    },
    {
        icon: Phone,
        label: "Call Us",
        value: "+880 1800 000 000",
        sub: "Mon – Fri, 10am – 6pm",
        href: "tel:+8801800000000",
    },
    {
        icon: MapPin,
        label: "Visit Us",
        value: "Dhaka, Bangladesh",
        sub: "By appointment only",
        href: "#",
    },
];

// ── Subject options ───────────────────────────────────────────────────────────
const SUBJECTS = [
    "Order Enquiry",
    "Fragrance Advice",
    "Wholesale / B2B",
    "Press & Media",
    "General Question",
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const subRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating glow
            gsap.to(glowRef.current, {
                scale: 1.35, opacity: 0.6, duration: 3.5,
                ease: "sine.inOut", repeat: -1, yoyo: true,
            });

            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.fromTo(wordRefs.current,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2 }, 0.3)
                .fromTo(lineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, transformOrigin: "left", duration: 1.1 }, 0.9)
                .fromTo(subRef.current,
                    { opacity: 0, y: 16, filter: "blur(6px)" },
                    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 1.1);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const words = ["Get", "In", "Touch."];

    return (
        <div ref={sectionRef} className="relative min-h-[55vh] flex flex-col justify-end px-6 lg:px-12 pb-16 pt-32 overflow-hidden"
            style={{ background: "var(--bg-primary)" }}>

            {/* Ambient glow */}
            <div ref={glowRef} className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                    width: 600, height: 600,
                    background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%)",
                    willChange: "transform, opacity"
                }} />

            {/* Grid lines decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
                    backgroundSize: "80px 80px"
                }} />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

            <div className="relative max-w-[1100px]">
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[8px] uppercase tracking-[0.7em] font-bold" style={{ color: "var(--accent-gold)" }}>
                        House of SENZ8
                    </span>
                    <div style={{ width: 36, height: 1, background: "rgba(212,175,55,0.4)" }} />
                    <span className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>
                        Contact
                    </span>
                </div>

                {/* Headline */}
                <div className="flex flex-wrap gap-x-5">
                    {words.map((w, i) => (
                        <div key={w} style={{ overflow: "hidden" }}>
                            <span ref={el => { if (el) wordRefs.current[i] = el; }}
                                className="block font-black uppercase"
                                style={{
                                    fontFamily: "var(--font-bodoni), 'Georgia', serif",
                                    fontSize: "clamp(52px, 9vw, 130px)",
                                    letterSpacing: "-0.04em", lineHeight: 0.88,
                                    color: i === words.length - 1 ? "var(--accent-gold)" : "var(--text-primary)",
                                }}>
                                {w}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Gold rule */}
                <div ref={lineRef} className="mt-8 mb-6"
                    style={{
                        height: 1, width: "100%", maxWidth: 480,
                        background: "linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.15), transparent)",
                        transformOrigin: "left"
                    }} />

                <p ref={subRef} className="text-sm max-w-md leading-relaxed opacity-0"
                    style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                    Whether you have a question about our fragrances, need help with an order,
                    or just want to talk scent — we're here.
                </p>
            </div>
        </div>
    );
}

// ── Info cards ────────────────────────────────────────────────────────────────
function InfoCards() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current?.children ?? [],
                { opacity: 0, y: 32, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.85, ease: "expo.out",
                    scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 lg:px-12 py-10 max-w-[1100px] mx-auto w-full">
            {INFO.map(({ icon: Icon, label, value, sub, href }) => (
                <a key={label} href={href}
                    className="group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden transition-all duration-400 cursor-hover"
                    style={{
                        background: "linear-gradient(160deg,#141419 0%,#0f0f14 100%)",
                        border: "1px solid rgba(255,255,255,0.07)"
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.35)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(212,175,55,0.08)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}>
                    {/* Gold top edge */}
                    <div className="absolute top-0 left-0 right-0 h-[1px]"
                        style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)" }} />

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                        <Icon size={16} style={{ color: "var(--accent-gold)" }} />
                    </div>

                    <div>
                        <p className="text-[8px] uppercase tracking-[0.45em] mb-1.5 font-bold"
                            style={{ color: "var(--accent-gold)", opacity: 0.7 }}>{label}</p>
                        <p className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{value}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>{sub}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    // Scroll reveal
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 24 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" }
                }
            );
            gsap.fromTo(formRef.current?.querySelectorAll(".form-field") ?? [],
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power2.out", delay: 0.15,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate send — replace with real API call
        await new Promise(r => setTimeout(r, 1400));
        setSending(false);
        setSent(true);
    }, []);

    const inputBase: React.CSSProperties = {
        width: "100%",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,175,55,0.15)",
        borderRadius: 12,
        padding: "14px 16px",
        color: "var(--text-primary)",
        fontSize: 13,
        outline: "none",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        transition: "border-color 0.25s, box-shadow 0.25s",
    };
    const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.borderColor = "rgba(212,175,55,0.5)";
        e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.06)";
    };
    const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.borderColor = "rgba(212,175,55,0.15)";
        e.target.style.boxShadow = "none";
    };

    return (
        <div ref={sectionRef} className="px-6 lg:px-12 pb-24 max-w-[1100px] mx-auto w-full">

            {/* Divider */}
            <div className="mb-12"
                style={{ height: 1, background: "linear-gradient(90deg, var(--accent-gold), rgba(212,175,55,0.1), transparent)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">

                {/* Left — heading + note */}
                <div ref={headRef} className="opacity-0">
                    <span className="text-[8px] uppercase tracking-[0.6em] font-bold block mb-4"
                        style={{ color: "var(--accent-gold)" }}>Send a Message</span>
                    <h2 className="font-black uppercase mb-5"
                        style={{
                            fontFamily: "var(--font-bodoni), 'Georgia', serif",
                            fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em",
                            lineHeight: 0.9, color: "var(--text-primary)"
                        }}>
                        We'd Love<br />To Hear<br />From You.
                    </h2>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                        Fill in the form and our team will get back to you within 24 hours.
                        Or reach out directly via email or phone.
                    </p>

                    {/* Social links */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[8px] uppercase tracking-[0.5em]" style={{ color: "var(--text-secondary)" }}>
                            Follow Our World
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { name: "Instagram", href: "https://instagram.com" },
                                { name: "TikTok", href: "https://tiktok.com" },
                                { name: "YouTube", href: "https://youtube.com" },
                            ].map(s => (
                                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                                    className="text-[9px] uppercase tracking-[0.35em] font-bold transition-colors duration-300 cursor-hover"
                                    style={{ color: "rgba(245,245,245,0.3)" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.3)"; }}>
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — form */}
                {sent ? (
                    <SuccessState />
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Name + Email row */}
                        <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-5 opacity-0">
                            <div className="flex flex-col gap-2">
                                <label className="text-[8px] uppercase tracking-[0.45em] font-bold"
                                    style={{ color: "var(--text-secondary)" }}>Your Name</label>
                                <input type="text" required placeholder="e.g. Alex Rahman"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    style={inputBase}
                                    onFocus={focusStyle} onBlur={blurStyle} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[8px] uppercase tracking-[0.45em] font-bold"
                                    style={{ color: "var(--text-secondary)" }}>Email Address</label>
                                <input type="email" required placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    style={inputBase}
                                    onFocus={focusStyle} onBlur={blurStyle} />
                            </div>
                        </div>

                        {/* Subject pills */}
                        <div className="form-field flex flex-col gap-2 opacity-0">
                            <label className="text-[8px] uppercase tracking-[0.45em] font-bold"
                                style={{ color: "var(--text-secondary)" }}>Subject</label>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECTS.map(s => (
                                    <button key={s} type="button"
                                        onClick={() => setSubject(s)}
                                        className="px-4 py-1.5 rounded-pill text-[9px] font-bold uppercase tracking-widest transition-all duration-250 cursor-hover"
                                        style={{
                                            background: subject === s ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${subject === s ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.08)"}`,
                                            color: subject === s ? "var(--accent-gold)" : "var(--text-secondary)",
                                        }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="form-field flex flex-col gap-2 opacity-0">
                            <label className="text-[8px] uppercase tracking-[0.45em] font-bold"
                                style={{ color: "var(--text-secondary)" }}>Message</label>
                            <textarea required rows={6} placeholder="Tell us how we can help…"
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                style={{ ...inputBase, resize: "none" }}
                                onFocus={focusStyle as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                                onBlur={blurStyle as unknown as React.FocusEventHandler<HTMLTextAreaElement>} />
                        </div>

                        {/* Submit */}
                        <div className="form-field opacity-0">
                            <button type="submit" disabled={sending}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-pill font-black uppercase tracking-widest text-[10px] transition-all duration-300 cursor-hover"
                                style={{
                                    background: "var(--accent-gold)",
                                    color: "#0A0A0A",
                                    boxShadow: "0 0 0 3px rgba(212,175,55,0.15), 0 0 28px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.5)",
                                    opacity: sending ? 0.7 : 1,
                                }}
                                onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                                {sending
                                    ? <><Loader2 size={13} className="animate-spin" /> Sending…</>
                                    : <><Send size={13} /> Send Message</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessState() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(ref.current,
            { opacity: 0, y: 24, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" }
        );
    }, []);

    return (
        <div ref={ref} className="flex flex-col items-start justify-center gap-6 py-12">
            {/* Check icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <Check size={28} style={{ color: "var(--accent-gold)" }} />
            </div>

            <div>
                <h3 className="font-black uppercase mb-3"
                    style={{
                        fontFamily: "var(--font-bodoni), 'Georgia', serif",
                        fontSize: "clamp(26px,3vw,42px)", letterSpacing: "-0.03em",
                        lineHeight: 0.9, color: "var(--text-primary)"
                    }}>
                    Message<br />Received.
                </h3>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                    While you wait, explore our full collection.
                </p>
            </div>

            <TransitionLink href="/collections" label="The Collection"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill font-black uppercase tracking-widest text-[10px] cursor-hover transition-all duration-300"
                style={{
                    background: "var(--accent-gold)", color: "#0A0A0A",
                    boxShadow: "0 0 24px rgba(212,175,55,0.3)"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}>
                Explore Collection <ArrowRight size={11} />
            </TransitionLink>
        </div>
    );
}

// ── FAQ strip ─────────────────────────────────────────────────────────────────
const FAQS = [
    { q: "How long does shipping take?", a: "Standard delivery is 2–3 business days within Bangladesh. Express options available at checkout." },
    { q: "Can I return a fragrance?", a: "We accept returns within 7 days if the bottle is unopened and in original condition." },
    { q: "How do I find my signature scent?", a: "Browse our collection and filter by gender or mood. If you're unsure, email us — we'll guide you personally." },
    { q: "Do you offer wholesale pricing?", a: "Yes. Select 'Wholesale / B2B' in the contact form above and our team will be in touch within 48 hours." },
];

function FaqStrip() {
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<number | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current?.querySelectorAll(".faq-item") ?? [],
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out",
                    scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="px-6 lg:px-12 pb-24 max-w-[1100px] mx-auto w-full">
            <div className="mb-10">
                <span className="text-[8px] uppercase tracking-[0.6em] font-bold block mb-3"
                    style={{ color: "var(--accent-gold)" }}>Quick Answers</span>
                <h2 className="font-black uppercase"
                    style={{
                        fontFamily: "var(--font-bodoni), 'Georgia', serif",
                        fontSize: "clamp(28px,3.5vw,52px)", letterSpacing: "-0.04em",
                        lineHeight: 0.9, color: "var(--text-primary)"
                    }}>
                    FAQs
                </h2>
            </div>

            <div className="flex flex-col">
                {FAQS.map(({ q, a }, i) => (
                    <div key={i} className="faq-item opacity-0"
                        style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                        <button
                            className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-hover"
                            onClick={() => setOpen(open === i ? null : i)}>
                            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{q}</span>
                            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{
                                    border: "1px solid rgba(212,175,55,0.25)",
                                    background: open === i ? "rgba(212,175,55,0.12)" : "transparent",
                                    color: open === i ? "var(--accent-gold)" : "var(--text-secondary)",
                                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                                }}>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </span>
                        </button>
                        <div style={{
                            maxHeight: open === i ? 200 : 0,
                            overflow: "hidden",
                            transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                        }}>
                            <p className="pb-5 text-sm leading-relaxed pr-12"
                                style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>
                        </div>
                    </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }} />
            </div>
        </div>
    );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function ContactClient() {
    return (
        <div className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <ScrollProgress />
            <CinematicNav canAnimate={true} />

            <Hero />

            <div style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />

            <InfoCards />

            <ContactForm />

            <div className="px-6 lg:px-12">
                <div className="max-w-[1100px] mx-auto"
                    style={{ height: 1, background: "rgba(212,175,55,0.07)" }} />
            </div>

            <FaqStrip />

            <SiteFooter />
        </div>
    );
}
