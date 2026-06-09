"use client";

import React from "react";

interface FloatingSidebarsProps {
  activeSection: number;
  expandedCardId: string | null;
}

const NAV_ITEMS = [
  { id: "hero", label: "Inicio", index: "00" },
  { id: "about", label: "Sobre mí", index: "01" },
  { id: "experience", label: "Formación", index: "02" },
  { id: "skills", label: "Habilidades", index: "03" },
  { id: "projects", label: "Proyectos", index: "04" },
  { id: "contact", label: "Contacto", index: "05" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Patrick9913", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
    external: true,
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com", external: false },
];

export const FloatingSidebars = ({ activeSection, expandedCardId }: FloatingSidebarsProps) => {
  // Ocultamos los paneles flotantes laterales en la vista expandida
  if (expandedCardId) return null;

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
        <div className="flex flex-col gap-5 border-l border-black/10 pl-5">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="group flex items-baseline gap-3 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none"
              >
                <span className={`font-mono text-[9px] font-light tracking-wider transition-colors duration-500 ${
                  isActive ? "text-black font-semibold" : "text-black/30 group-hover:text-black/70"
                }`}>
                  {item.index}
                </span>
                <span className={`text-[10px] tracking-[0.22em] uppercase transition-all duration-500 ${
                  isActive 
                    ? "text-black font-medium border-b border-black/40 pb-0.5" 
                    : "text-black/40 group-hover:text-black/80 pb-0.5 border-b border-transparent"
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
        <div className="flex flex-col gap-6 border-r border-black/10 pr-5 items-end">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col items-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-black/45 group-hover:text-black transition-colors duration-500 border-b border-transparent group-hover:border-black/35 pb-0.5">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default FloatingSidebars;
