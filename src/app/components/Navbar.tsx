'use client';

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const year = new Date().getFullYear();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isMenuOpen]);

    const navItems = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Sobre mí', href: '#about' },
        { name: 'Formación', href: '#experience' },
        { name: 'Habilidades', href: '#skills' },
        { name: 'Proyectos', href: '#projects' },
        { name: 'Contacto', href: '#contact' },
    ];

    return (
        <>
        <nav className="relative z-50 max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-4 font-sans">
            <div className="flex justify-between items-center w-full">
                <a href="#hero" className="text-lg md:text-xl font-light tracking-widest text-white hover:text-gray-400 transition-colors duration-300 uppercase">
                    Patrick Ordoñez
                </a>
                <div className="hidden md:flex md:space-x-10 md:items-center">
                    {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        {item.name}
                    </a>
                    ))}
                </div>

                {!isMenuOpen && (
                    <button
                        type="button"
                        className="md:hidden fixed top-5 right-5 z-[1102] flex h-11 w-11 items-center justify-center border border-white/20 bg-black/45 text-white backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.65,0.02,0.28,1)] hover:border-white/35 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        onClick={() => setIsMenuOpen(true)}
                        aria-expanded={false}
                        aria-controls="mobile-menu-panel"
                        aria-label="Abrir menú"
                    >
                        <HiOutlineMenuAlt3 className="h-6 w-6" aria-hidden />
                    </button>
                )}
            </div>
        </nav>

        {/* Portal a document.body: el Navbar vive dentro del Hero (z-10); sin portal el contenido
            hermano del hero se pinta encima del panel y parece “transparente”. */}
        {mounted
            ? createPortal(
                  <>
                      <div
                          className={`fixed inset-0 z-[1100] bg-black/80 transition-opacity duration-500 ease-out md:hidden ${
                              isMenuOpen
                                  ? 'pointer-events-auto opacity-100'
                                  : 'pointer-events-none opacity-0'
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
                                  ? 'translate-x-0'
                                  : 'translate-x-full pointer-events-none'
                          }`}
                          style={{ backgroundColor: '#000000' }}
                          onClick={(e) => e.stopPropagation()}
                      >
                          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black px-6 pt-6 pb-5 md:px-8">
                              <span className="text-[9px] font-light tracking-[0.4em] uppercase text-white/40">
                                  Navegación
                              </span>
                              <button
                                  type="button"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 bg-black text-white transition-all duration-300 hover:border-white/40 hover:bg-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                  aria-label="Cerrar menú"
                              >
                                  <IoMdClose className="h-6 w-6" aria-hidden />
                              </button>
                          </div>
                          <nav
                              className="flex flex-1 flex-col overflow-y-auto bg-black px-8 py-6"
                              aria-label="Móvil"
                          >
                              <ul className="flex flex-col">
                                  {navItems.map((item, index) => (
                                      <li
                                          key={item.name}
                                          className="border-b border-white/10 last:border-b-0"
                                      >
                                          <a
                                              href={item.href}
                                              className={`block bg-black py-5 text-[10px] tracking-[0.28em] uppercase text-gray-400 transition-all duration-500 hover:pl-1 hover:text-white ${
                                                  isMenuOpen
                                                      ? 'opacity-100 translate-x-0'
                                                      : 'opacity-0 translate-x-3'
                                              }`}
                                              style={{
                                                  transitionDelay: isMenuOpen
                                                      ? `${80 + index * 45}ms`
                                                      : '0ms',
                                              }}
                                              onClick={() => setIsMenuOpen(false)}
                                          >
                                              {item.name}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </nav>
                          <div className="mt-auto shrink-0 border-t border-white/10 bg-black px-8 py-6">
                              <p className="text-[9px] font-light tracking-[0.25em] uppercase text-white/30">
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
