import React from "react";
import { Navbar } from "./Navbar";

const SECTION_INDEX = "[ 00 ]";

const COPY = {
  overline: "Portfolio",
  title: {
    line1: "FRONT END",
    accent: "DEVELOPER",
  },
  body:
    "Especializado en React, Next.js y TypeScript. Creando interfaces inmersivas, esculpiendo componentes y diseñando experiencias de usuario dinámicas con profunda atención al detalle y la estética visual.",
} as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Patrick9913", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
    external: true,
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com", external: false },
] as const;

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col bg-black text-[#F0F0F0] overflow-hidden font-sans"
    >
      {/* Imagen de fondo: escala de grises, sin gradientes decorativos */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale opacity-45"
        style={{ backgroundImage: "url('/secondback.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 z-0 bg-black/78" aria-hidden />

      <div className="relative z-10 w-full pt-4">
        <Navbar />
      </div>

      <div className="relative z-10 flex-grow flex items-center w-full px-8 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end lg:items-center">
          {/* Columna principal — contenido editorial */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <header className="mb-10 md:mb-14">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 md:mb-10">
                <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
                  {SECTION_INDEX}
                </span>
                <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
                  {COPY.overline}
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[-0.03em] text-[#F0F0F0] leading-[0.95] mb-8 md:mb-10">
                {COPY.title.line1}
                <br />
                <span className="font-medium text-white/50">{COPY.title.accent}</span>
              </h1>

              <div className="w-8 md:w-12 h-px bg-white/[0.08]" aria-hidden />
            </header>

            <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide max-w-xl mb-10 md:mb-14">
              {COPY.body}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-6 border-t border-white/[0.08]">
              <a
                href="#projects"
                className="group inline-flex w-fit items-center gap-4 px-8 py-4 bg-[#F0F0F0] text-black text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90"
              >
                Explorar Proyectos
                <span
                  className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-4 px-8 py-4 border border-white/20 bg-transparent text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 rounded-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/40"
              >
                Contactar
                <span className="text-base" aria-hidden>
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Columna lateral — redes + indicador de scroll */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:col-start-9 xl:col-start-10 flex flex-row lg:flex-col justify-between lg:justify-end items-end gap-12 lg:gap-16 lg:min-h-[280px]">
            <nav
              className="flex flex-row lg:flex-col gap-6 lg:gap-8"
              aria-label="Redes sociales"
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex flex-col items-center gap-6">
              <div className="w-px h-16 bg-white/[0.08] relative overflow-hidden">
                <div className="hero-scroll-indicator w-full h-1/2 bg-white/50 absolute top-0 left-0" />
              </div>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.3em] font-light text-white/40"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Scroll
              </span>
            </div>
          </aside>
        </div>
      </div>

      <div
        className="relative z-10 w-full h-px bg-white/[0.08]"
        aria-hidden
      />
    </section>
  );
};

export default Hero;
