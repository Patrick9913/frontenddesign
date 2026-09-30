"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import {
  detectNavSection,
  type NavSectionId,
} from "./scrollToSection";

const NAV_ITEMS: { name: string; href: string; sectionId: NavSectionId }[] = [
  { name: "Inicio", href: "#home", sectionId: "home" },
  { name: "Sobre mí", href: "#about", sectionId: "about" },
  { name: "Proyectos", href: "#works", sectionId: "works" },
  { name: "Contacto", href: "#contact", sectionId: "contact" },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>("home");
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        setActiveSection(detectNavSection());
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const sectionId = href.replace("#", "");
    window.dispatchEvent(
      new CustomEvent("nav-to-section", { detail: { sectionId } })
    );
    setIsMenuOpen(false);
  };

  const linkClass = (sectionId: NavSectionId) => {
    const active = activeSection === sectionId;
    return `relative text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 md:text-xs ${
      active
        ? "text-white"
        : "text-white/60 hover:text-white"
    }`;
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] font-sans transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-[#050505]/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-4 md:px-16 lg:px-24">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="text-base font-light uppercase tracking-widest text-white transition-colors duration-300 hover:text-white/80 md:text-lg"
          >
            Patrick Ordoñez
          </a>

          <div className="hidden items-center gap-8 lg:gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={linkClass(item.sectionId)}
              >
                {item.name}
                {activeSection === item.sectionId ? (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-[#6eb0d4]/80 via-[#a992d4]/60 to-transparent" />
                ) : null}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#9ef0b8] transition-all duration-300 hover:border-[#25D366]/70 hover:bg-[#25D366]/20 hover:text-white"
            >
              Hablemos
            </a>
          </div>

          <div className="h-12 w-12 md:hidden" aria-hidden />
        </nav>
      </header>

      {mounted
        ? createPortal(
            <>
              {!isMenuOpen ? (
                <button
                  type="button"
                  className="fixed top-5 right-5 z-[1102] flex h-12 w-12 items-center justify-center border border-white/10 bg-[#050505]/80 text-white backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.65,0.02,0.28,1)] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 md:hidden"
                  onClick={() => setIsMenuOpen(true)}
                  aria-expanded={false}
                  aria-controls="mobile-menu-panel"
                  aria-label="Abrir menú"
                >
                  <HiOutlineMenuAlt3 className="h-6 w-6" aria-hidden />
                </button>
              ) : null}

              <div
                className={`fixed inset-0 z-[1100] bg-black/80 transition-opacity duration-500 ease-out md:hidden ${
                  isMenuOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden={!isMenuOpen}
              />

              <div
                id="mobile-menu-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
                className={`fixed top-0 right-0 z-[1101] flex h-full w-[min(100%,18rem)] flex-col border-l border-white/10 font-sans shadow-[0_0_48px_-12px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.65,0.02,0.28,1)] md:hidden isolate ${
                  isMenuOpen
                    ? "translate-x-0"
                    : "pointer-events-none translate-x-full"
                }`}
                style={{ backgroundColor: "#050505" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 pb-5 pt-6">
                  <span className="text-[11px] font-light uppercase tracking-[0.4em] text-white/60">
                    Navegación
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    aria-label="Cerrar menú"
                  >
                    <IoMdClose className="h-6 w-6" aria-hidden />
                  </button>
                </div>
                <nav
                  className="flex flex-1 flex-col overflow-y-auto px-8 py-6"
                  aria-label="Móvil"
                >
                  <ul className="flex flex-col">
                    {NAV_ITEMS.map((item, index) => (
                      <li
                        key={item.name}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <a
                          href={item.href}
                          className={`block py-6 text-xs tracking-[0.28em] uppercase transition-all duration-500 hover:pl-1 ${
                            activeSection === item.sectionId
                              ? "text-[#8ec4e8]"
                              : "text-white/70 hover:text-white"
                          } ${
                            isMenuOpen
                              ? "translate-x-0 opacity-100"
                              : "translate-x-3 opacity-0"
                          }`}
                          style={{
                            transitionDelay: isMenuOpen
                              ? `${80 + index * 45}ms`
                              : "0ms",
                          }}
                          onClick={(e) => handleNavClick(e, item.href)}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className="mt-8 border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-center text-[10px] uppercase tracking-[0.22em] text-[#9ef0b8]"
                  >
                    Hablemos
                  </a>
                </nav>
                <div className="mt-auto shrink-0 border-t border-white/10 px-8 py-6">
                  <p className="text-[11px] font-light uppercase tracking-[0.25em] text-white/50">
                    Portfolio · {year}
                  </p>
                </div>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
};

export default Navbar;
