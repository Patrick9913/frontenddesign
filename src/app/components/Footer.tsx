"use client";

import { SocialSticker, SOCIAL_BRAND_CLASS, type SocialName } from "./SocialSticker";

const SOCIAL_LINKS: { label: SocialName; href: string }[] = [
  { label: "GitHub", href: "https://github.com/Patrick9913" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="relative z-10 border-t border-white/[0.08] bg-[#0a0a0a] px-8 py-8 md:px-16 lg:px-24 xl:px-36"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/55 md:text-xs">
          © {currentYear} Patrick Ordoñez
        </p>
        <nav className="flex flex-wrap gap-6" aria-label="Redes">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className={`group inline-flex items-center gap-2 font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/65 md:text-xs ${SOCIAL_BRAND_CLASS[link.label]}`}
            >
              <SocialSticker name={link.label} size="sm" />
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
