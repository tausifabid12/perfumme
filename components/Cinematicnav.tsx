"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import { useCart } from "@/components/providers/CartProvider";

// â”€â”€â”€ Brand nav links â€” update hrefs to match your routing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAV_LINKS = [
    { name: "Collections", text: "1", href: "/collections" },
    { name: "Imperial Smoke", text: "2", href: "/products/imperial-smoke" },
    { name: "IT Boy", text: "3", href: "/products/it-boy" },
    { name: "Rebel Girl", text: "4", href: "/products/rebel-girl" },
    { name: "Contact", text: "5", href: "/contact" },
];

export default function CinematicNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { totalQuantity, setCartOpen } = useCart();

    const circleRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const linksRef = useRef<(HTMLLIElement | null)[]>([]);
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

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

        if (isOpen) {
            gsap.timeline()
                .to(navRef.current, { display: "flex", duration: 0 })
                .to(circleRef.current, { scale: getScale(), duration: 1.2, ease: "expo.inOut" })
                .fromTo(
                    validLinks,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power4.out" },
                    "-=0.6"
                );
        } else {
            gsap.timeline()
                .to(validLinks, { y: 20, opacity: 0, stagger: -0.05, duration: 0.4 })
                .to(circleRef.current, { scale: 0, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
                .to(navRef.current, { display: "none", duration: 0 });
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
            <header className="fixed top-0 left-0 w-full z-[210] px-6 py-7 md:px-12 flex justify-between items-center mix-blend-difference">

                {/* Logo */}
                <Link href={"/"}>
                    <div
                        className="cursor-pointer flex items-end gap-1 group select-none"
                        onMouseMove={handleMagnetic}
                        onMouseLeave={resetMagnetic}
                    >
                        <span
                            className="text-white text-sm font-bold tracking-[0.52em] uppercase transition-opacity duration-500 group-hover:opacity-60"
                            style={{ fontFamily: "var(--font-bodoni), 'Georgia', serif" }}
                        >
                            senz8
                        </span>
                        <span className="w-[5px] h-[5px] bg-amber-400 rounded-full mb-[4px] animate-pulse" />
                    </div>
                </Link>

                {/* Cart icon + Hamburger toggle */}
                <div className="flex items-center gap-3 relative z-[211]">

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
            <div
                ref={circleRef}
                className="fixed top-6 right-6 md:top-10 md:right-10 w-20 h-20 rounded-full z-[100] pointer-events-none scale-0"
                style={{
                    background: [
                        /* mirror light catch â€” top-left */
                        "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.13) 0%, rgba(210,205,230,0.04) 18%, transparent 42%)",
                        /* cool smoke body */
                        "radial-gradient(circle at 55% 60%, rgba(160,150,200,0.06) 0%, transparent 55%)",
                        /* near-void obsidian base */
                        "linear-gradient(145deg, rgba(18,14,26,0.94) 0%, rgba(5,4,8,0.97) 100%)",
                    ].join(", "),
                    backdropFilter: "blur(42px) saturate(180%) brightness(0.85)",
                    WebkitBackdropFilter: "blur(42px) saturate(180%) brightness(0.85)",
                    /* inner glass edge shimmer */
                    boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.09), inset 1px 1px 0 rgba(255,255,255,0.06)",
                    isolation: "isolate",
                    willChange: "transform",
                }}
            />

            {/* â”€â”€ Full-screen nav overlay â€” glass mirror surface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <nav
                ref={navRef}
                className="fixed inset-0 z-[200] hidden items-center justify-center p-6"
                style={{
                    /* Top-corner mirror catch â€” angled light hitting the glass */
                    background: [
                        "linear-gradient(148deg, rgba(255,255,255,0.055) 0%, transparent 28%)",
                        /* Bottom luminance bounce â€” light from below through glass */
                        "radial-gradient(ellipse 65% 30% at 50% 108%, rgba(200,195,230,0.05) 0%, transparent 60%)",
                    ].join(", "),
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
                        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
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

                {/* Bottom â€” socials with glass rule above */}
                <div className="absolute bottom-10 left-10 hidden md:flex flex-col gap-3">
                    {/* Glass rule */}
                    <div style={{
                        height: "1px",
                        width: "120px",
                        background: "linear-gradient(to right, rgba(255,255,255,0.2), transparent)",
                        marginBottom: "4px",
                    }} />
                    <div className="flex gap-10 text-[10px] tracking-[0.35em] font-medium text-white/35">
                        <Link href="https://instagram.com" className="hover:text-white/80 transition-colors">INSTAGRAM</Link>
                        <Link href="https://tiktok.com" className="hover:text-white/80 transition-colors">TIKTOK</Link>
                        <Link href="https://pinterest.com" className="hover:text-white/80 transition-colors">PINTEREST</Link>
                    </div>
                </div>

                {/* Bottom â€” tagline */}
                <p className="absolute bottom-10 right-10 hidden md:block text-[10px] tracking-[0.35em] text-white/25 uppercase select-none">
                    Fine Fragrance Â· Est. 2024
                </p>
            </nav>
        </>
    );
}