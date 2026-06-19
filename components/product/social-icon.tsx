"use client";

import useMagnetic from "@/lib/animations/use-magnetic";

export default function SocialIcon({
  Icon,
  href = "#",
}: {
  Icon: React.ComponentType<{ size?: number }>;
  href?: string;
}) {
  const ref = useMagnetic(0.4);

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white/10 cursor-hover"
      style={{ border: "1px solid rgba(212,175,55,0.2)", color: "var(--text-primary)" }}
    >
      <Icon size={18} />
    </a>
  );
}
