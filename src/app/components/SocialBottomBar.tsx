"use client";

import { useEffect, useState } from "react";
import { SocialSticker, SOCIAL_BRAND_CLASS, type SocialName } from "./SocialSticker";

const SOCIAL_LINKS: {
  label: SocialName;
  href: string;
  external: boolean;
}[] = [
  { label: "GitHub", href: "https://github.com/Patrick9913", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
    external: true,
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com", external: false },
];

export const SocialBottomBar = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0.15 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Redes sociales"
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white/[0.06] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-8 py-3.5 md:gap-12 md:px-16 lg:px-24">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`group inline-flex items-center gap-2.5 font-mono text-[10px] font-light uppercase tracking-[0.18em] text-white/65 transition-colors duration-300 md:text-xs ${SOCIAL_BRAND_CLASS[link.label]}`}
            >
              <SocialSticker name={link.label} size="sm" />
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SocialBottomBar;
