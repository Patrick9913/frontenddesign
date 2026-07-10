import React from "react";
import { Navbar } from "./Navbar";

const SECTION_INDEX = "[ 00 ]";

const COPY = {
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
      className="relative min-h-full h-full w-full flex flex-col bg-transparent text-[#F0F0F0] overflow-hidden font-sans"
    >
      <div className="absolute inset-0 z-[1] bg-black/40" aria-hidden />

      <div className="relative z-10 w-full pt-4">
        <Navbar />
      </div>

      <div className="relative z-10 flex-grow flex items-center w-full px-8 md:px-16 lg:px-24 py-8 md:py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end lg:items-center">
          {/* Columna principal — contenido editorial */}
          <div className="lg:col-span-7 xl:col-span-12 flex flex-col">
            <header className="mb-8 md:mb-10">
              <div className="mb-6 md:mb-8">
                <span className="font-mono text-xs font-light tracking-[0.25em] uppercase text-white/50">
                  {SECTION_INDEX}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] text-[#F0F0F0] leading-[0.92] mb-6 md:mb-8">
                {COPY.title.line1}
                <br />
                <span className="font-medium text-white/65">{COPY.title.accent}</span>
              </h1>

              <div className="w-8 md:w-12 h-px bg-white/[0.08]" aria-hidden />
            </header>

            <p className="text-base md:text-lg font-light text-white/50 leading-[1.75] tracking-wide max-w-xl mb-10 md:mb-14">
              {COPY.body}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center xl:hidden gap-4 sm:gap-6 pt-6 border-t border-white/[0.08]">
              <a
                href="#projects"
                className="group inline-flex w-full sm:w-fit items-center justify-center gap-4 px-8 py-5 min-h-[44px] bg-[#F0F0F0] text-black text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90"
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
                className="inline-flex w-full sm:w-fit items-center justify-center gap-4 px-8 py-5 min-h-[44px] border border-white/20 bg-transparent text-xs font-light tracking-[0.2em] uppercase text-white/50 rounded-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/40"
              >
                Contactar
                <span className="text-base" aria-hidden>
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Columna lateral — redes (ocultas en xl: ya están en la barra derecha) + scroll */}
          <aside className="lg:col-span-4 lg:col-start-9 flex flex-row lg:flex-col justify-between lg:justify-end items-end gap-12 lg:gap-16 lg:min-h-[280px] xl:hidden">
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
                  className="font-mono text-xs font-light tracking-[0.2em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] min-h-[44px] flex items-center"
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
