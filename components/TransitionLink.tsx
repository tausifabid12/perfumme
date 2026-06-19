"use client";

/**
 * TransitionLink
 * ─────────────
 * Drop-in replacement for <a> that triggers the cinematic page-exit
 * animation before navigating. Supports ref forwarding so it works
 * with useMagnetic and other ref-based hooks.
 */

import { forwardRef } from "react";
import { useTransition } from "./PageTransition";
import type { MouseEvent, AnchorHTMLAttributes, ReactNode } from "react";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    label?: string;
    children: ReactNode;
}

const TransitionLink = forwardRef<HTMLAnchorElement, Props>(
    ({ href, label, children, onClick, ...rest }, ref) => {
        const { navigate } = useTransition();

        const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            // Let modifier-key clicks (new tab, etc.) pass through normally
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onClick?.(e);
            navigate(href, label ?? "");
        };

        return (
            <a ref={ref} href={href} onClick={handleClick} {...rest}>
                {children}
            </a>
        );
    }
);

TransitionLink.displayName = "TransitionLink";

export default TransitionLink;
