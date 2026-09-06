"use client";

import React from "react";
import { CARDS } from "./cardStackData";
import { SocialSticker, SOCIAL_BRAND_CLASS, type SocialName } from "./SocialSticker";

interface FloatingSidebarsProps {
  activeSection: number;
}

const NAV_ITEMS = CARDS.map((card) => ({
  id: card.id,
  label: card.label,
  index: card.index,
}));

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

export const FloatingSidebars = ({ activeSection }: FloatingSidebarsProps) => {
  const handleNavClick = (id: string) => {
    window.dispatchEvent(
      new CustomEvent("nav-to-section", { detail: { sectionId: id } })
    );
  };

  return (
    <>
      {/* Lateral Izquierdo - Accesos rápidos de la Navbar */}
      <aside 
        className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 select-none font-sans"
        aria-label="Navegación lateral rápida"
      >
        <div className="flex flex-col gap-5 border-l border-white/10 pl-5">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-baseline gap-3 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none"
              >
                <span className={`font-mono text-[9px] font-light tracking-wider transition-colors duration-500 ${
                  isActive ? "text-white font-semibold" : "text-white/55 group-hover:text-white/85"
                }`}>
                  {item.index}
                </span>
                <span className={`text-[10px] tracking-[0.22em] uppercase transition-all duration-500 ${
                  isActive
                    ? "text-white font-medium border-b border-white pb-0.5"
                    : "text-white/70 group-hover:text-white pb-0.5 border-b border-transparent"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Lateral Derecho - Vínculos Sociales */}
      <aside 
        className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-8 items-end select-none font-sans"
        aria-label="Enlaces sociales flotantes"
      >
        <div className="flex flex-col gap-6 border-r border-white/10 pr-5 items-end">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group flex items-center gap-3 ${SOCIAL_BRAND_CLASS[link.label]}`}
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-white/70 group-hover:text-inherit transition-colors duration-200 border-b border-transparent group-hover:border-current pb-0.5">
                {link.label}
              </span>
              <SocialSticker name={link.label} />
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default FloatingSidebars;
