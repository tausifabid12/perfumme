"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import { useCart } from "@/components/providers/CartProvider";
import Image from "next/image";

// â”€â”€â”€ Brand nav links â€” update hrefs to match your routing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAV_LINKS = [
    { name: "Collections", text: "1", href: "/collections" },
    // { name: "Imperial Smoke", text: "2", href: "/products/imperial-smoke" },
    // { name: "IT Boy", text: "3", href: "/products/it-boy" },
    // { name: "Rebel Girl", text: "4", href: "/products/rebel-girl" },
    { name: "About Us", text: "2", href: "/about" },
    { name: "Contact", text: "3", href: "/contact" },
];

export default function CinematicNav({ canAnimate = false }: { canAnimate?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const { totalQuantity, setCartOpen } = useCart();

    const circleRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const linksRef = useRef<(HTMLLIElement | null)[]>([]);
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const getScale = () => {
        const d = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        return (d * 2.2) / 80; // 80 = circle diameter in px
    };

    const handleMagnetic = (e: React.MouseEvent<HTMLElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        gsap.to(e.currentTarget, {
            x: (e.clientX - (left + width / 2)) * 0.3,
            y: (e.clientY - (top + height / 2)) * 0.3,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    const resetMagnetic = (e: React.MouseEvent<HTMLElement>) =>
        gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.3)" });

    // â”€â”€ Cursor follower â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // ── Nav entry animation once loading is done ─────────────────────
    useEffect(() => {
        if (!canAnimate) return;
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.15 }
        );
    }, [canAnimate]);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    // â”€â”€ Open / close animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    useEffect(() => {
        const validLinks = linksRef.current.filter((el): el is HTMLLIElement => el !== null);
        const cx = typeof window !== "undefined" ? window.innerWidth - 56 : 0;
        const cy = 56;
        const maxR = typeof window !== "undefined" ? Math.hypot(window.innerWidth, window.innerHeight) * 1.1 : 2000;

        if (isOpen) {
            gsap.timeline()
                .set(navRef.current, { display: "flex", clipPath: `circle(0px at ${cx}px ${cy}px)` })
                .to(navRef.current, {
                    clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
                    duration: 0.9,
                    ease: "power4.inOut",
                })
                .fromTo(
                    validLinks,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power4.out" },
                    "-=0.45"
                );
        } else {
            gsap.timeline()
                .to(validLinks, { y: 20, opacity: 0, stagger: -0.05, duration: 0.3 })
                .to(navRef.current, {
                    clipPath: `circle(0px at ${cx}px ${cy}px)`,
                    duration: 0.65,
                    ease: "power4.inOut",
                }, "-=0.1")
                .set(navRef.current, { display: "none" });
        }
    }, [isOpen]);

    // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    return (
        <>
            {/* Grain layer */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9000]"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
            />

            {/* Dot cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[100000] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
            />
            {/* Ring follower */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-white/20 rounded-full pointer-events-none z-[100000] -translate-x-1/2 -translate-y-1/2"
            />

            {/* â”€â”€ Header bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <header ref={headerRef} className="fixed top-0 left-0 w-full z-[210] px-6 py-4 md:py-7 md:px-12 flex justify-between items-center mix-blend-difference" style={{ opacity: 0 }}>

                {/* Logo */}
                <Link href="/">
                    <div
                        className="cursor-pointer flex items-center group select-none"
                        onMouseMove={handleMagnetic}
                        onMouseLeave={resetMagnetic}
                    >
                        <div className="relative w-14 h-14">
                            <Image
                                src="/logo.png"
                                alt="Senz8"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </Link>

                {/* Cart icon + Hamburger toggle */}
                <div className="flex items-center gap-3 relative z-[211]">

                    {/* Account link */}
                    <Link
                        href="/account"
                        className="relative flex items-center justify-center transition-opacity duration-300 hover:opacity-70"
                        style={{ padding: 4 }}
                        aria-label="My account"
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </Link>

                    {/* Cart button */}
                    <button
                        onClick={() => setCartOpen(true)}
                        onMouseMove={handleMagnetic}
                        onMouseLeave={resetMagnetic}
                        className="relative flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:opacity-70"
                        style={{ background: "transparent", border: "none", padding: 4 }}
                        aria-label="Open cart"
                    >
                        {/* Cart bag icon â€” hand-drawn SVG to match aesthetic */}
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>

                        {/* Item count badge */}
                        {totalQuantity > 0 && (
                            <span
                                className="absolute flex items-center justify-center font-black leading-none"
                                style={{
                                    top: -4, right: -4,
                                    minWidth: 16, height: 16,
                                    padding: "0 4px",
                                    borderRadius: 999,
                                    background: "#D4AF37",
                                    color: "#0a0a0a",
                                    fontSize: 8,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {totalQuantity > 99 ? "99+" : totalQuantity}
                            </span>
                        )}
                    </button>

                    {/* Hamburger toggle */}
                    <button
                        onClick={() => setIsOpen(v => !v)}
                        className={`relative bg-transparent border-none p-0 cursor-pointer transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                        aria-label="Toggle menu"
                    >
                        <svg viewBox="0 0 100 100" width="54" className="md:w-[72px]">
                            <path
                                className={`fill-none stroke-current text-white transition-all duration-500 ease-in-out ${isOpen ? "-translate-x-[7px]" : "translate-x-0"}`}
                                style={{
                                    strokeWidth: 5.5,
                                    strokeLinecap: "round",
                                    strokeDasharray: "40 139",
                                    strokeDashoffset: isOpen ? -98 : 0,
                                }}
                                d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
                            />
                            <path
                                className={`fill-none stroke-current text-white transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
                                style={{ strokeWidth: 5.5, strokeLinecap: "round" }}
                                d="m 30,50 h 40"
                            />
                            <path
                                className={`fill-none stroke-current text-white transition-all duration-500 ease-in-out origin-center ${isOpen ? "-rotate-90 translate-x-[2px]" : "rotate-0 translate-x-0"}`}
                                style={{
                                    strokeWidth: 5.5,
                                    strokeLinecap: "round",
                                    strokeDasharray: "20 180",
                                    strokeDashoffset: isOpen ? -138 : -20,
                                }}
                                d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* â”€â”€ Expansion circle â€” smoked glass lens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {/* circle ref kept for legacy — animation now uses clip-path on nav */}
            <div ref={circleRef} className="fixed pointer-events-none" style={{ display: "none" }} />

            {/* â”€â”€ Full-screen nav overlay â€” glass mirror surface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <nav
                ref={navRef}
                className="fixed inset-0 z-[200] hidden items-center justify-center p-6"
                style={{
                    background: [
                        /* top-left specular — light catching the glass edge */
                        "radial-gradient(ellipse 60% 50% at 5% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)",
                        /* gold shimmer — bottom right */
                        "radial-gradient(ellipse 50% 40% at 95% 100%, rgba(212,175,55,0.08) 0%, transparent 55%)",
                        /* dark gold-tinted glass base */
                        "linear-gradient(160deg, rgba(28,22,12,0.94) 0%, rgba(10,8,4,0.97) 100%)",
                    ].join(", "),
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    /* glass surface edge line */
                    boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.08), inset 1px 1px 0 rgba(255,255,255,0.06)",
                    willChange: "clip-path",
                }}
            >
                {/* Mirror glass anatomy â€” decorative light layers */}
                <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Top mirror edge â€” thin bright line like glass surface boundary */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                        background: "linear-gradient(to right, transparent 5%, rgba(255,255,255,0.14) 30%, rgba(255,255,255,0.08) 65%, transparent 95%)",
                    }} />
                    {/* Diagonal gloss streak â€” like light crossing a glass pane */}
                    <div style={{
                        position: "absolute",
                        top: "-10%", left: "-5%",
                        width: "55%", height: "55%",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
                        transform: "skewX(-15deg)",
                    }} />
                    {/* Smoke vignette â€” darker at the corners, atmospheric */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "transparent",
                    }} />
                </div>
                <ul className="w-full max-w-2xl flex flex-col gap-2">
                    {NAV_LINKS.map((link, i) => (
                        <li
                            key={link.name}
                            ref={el => { linksRef.current[i] = el; }}
                            className="relative group opacity-0"
                        >
                            <TransitionLink
                                href={link.href}
                                label={link.name}
                                onClick={() => setIsOpen(false)}
                                className="relative block py-4 md:py-6 text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none transition-all duration-500 text-white"
                            >
                                {/* Ghost number */}
                                <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] opacity-0 group-hover:opacity-[0.06] transition-all duration-500 pointer-events-none select-none">
                                    {link.text}
                                </span>

                                <div className="flex items-center gap-4 transition-transform duration-500 group-hover:translate-x-8">
                                    <span className="group-hover:italic">{link.name}</span>
                                    <ArrowUpRight className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
                                </div>
                            </TransitionLink>

                            {/* Glass mirror divider */}
                            <div
                                className="w-full h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                                style={{
                                    background: "linear-gradient(to right, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 45%, transparent 100%)",
                                }}
                            />
                        </li>
                    ))}
                </ul>


                {/* Bottom â€” tagline */}
                <p className="absolute bottom-10 right-10 hidden md:block text-[10px] tracking-[0.35em] text-white/50 uppercase select-none">
                    Fine Fragrance Â· Est. 2024
                </p>
            </nav>
        </>
    );
}






