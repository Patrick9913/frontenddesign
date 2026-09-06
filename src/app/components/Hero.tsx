import React from "react";

const COPY = {
  title: {
    line1: "FRONT END",
    accent: "DEVELOPER",
  },
  body: "React, Next.js y TypeScript. Interfaces con detalle, no ruido.",
} as const;

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100dvh-4.75rem)] w-full flex flex-col bg-transparent text-[#F0F0F0] overflow-hidden font-sans scroll-mt-24"
    >
      <div className="absolute inset-0 z-[1] bg-black/40" aria-hidden />

      <div className="relative z-10 flex-grow flex items-center w-full px-8 md:px-16 lg:px-24 xl:px-36 py-8 md:py-12">
        <div className="w-full max-w-7xl mx-auto">
          <header className="mb-8 md:mb-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] text-[#F0F0F0] leading-[0.92] mb-6 md:mb-8">
              {COPY.title.line1}
              <br />
              <span className="font-medium text-white/85">{COPY.title.accent}</span>
            </h1>
            <div className="w-8 md:w-12 h-px bg-white/[0.08]" aria-hidden />
          </header>

          <p className="text-base md:text-lg font-light text-white/75 leading-[1.75] tracking-wide max-w-xl mb-10 md:mb-14">
            {COPY.body}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-6 border-t border-white/[0.08]">
            <a
              href="#projects"
              className="group inline-flex w-full sm:w-fit items-center justify-center gap-4 px-8 py-5 min-h-[44px] bg-[#F0F0F0] text-black text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90"
            >
              Ver proyectos
              <span
                className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>

            <a
              href="#contact"
              className="inline-flex w-full sm:w-fit items-center justify-center gap-4 px-8 py-5 min-h-[44px] border border-white/20 bg-transparent text-xs font-light tracking-[0.2em] uppercase text-white/75 rounded-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/40"
            >
              Contactar
              <span className="text-base" aria-hidden>
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden md:flex items-center gap-4 px-8 pb-8 md:px-16 lg:px-24 xl:px-36">
        <div className="w-px h-10 bg-white/[0.08] relative overflow-hidden">
          <div className="hero-scroll-indicator w-full h-1/2 bg-white/50 absolute top-0 left-0" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-light text-white/60">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
