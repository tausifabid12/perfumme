import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About — SENZ8 · Parfum Maison",
    description: "The story behind SENZ8 — a fragrance house built for a generation that refuses to be ordinary.",
};

export default function AboutPage() {
    return <AboutClient />;
}
