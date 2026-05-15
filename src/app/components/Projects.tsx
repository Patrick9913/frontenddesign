"use client";

import React, { useState, useEffect, useCallback } from "react";

const SECTION_INDEX = "[ 04 ]";

const COPY = {
  overline: "Demos",
  title: "DEMOS",
  accent: "REPRESENTATIVAS",
} as const;

const DEMOS = [
  {
    id: "01",
    title: "Estudio Jurídico",
    subtitle: "Landing Page Comercial",
    description:
      "Sitio web profesional para estudio jurídico con más de 20 años de experiencia. Arquitectura limpia e informativa diseñada para la conversión y generación de confianza.",
    image: "/juridico.png",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/Patrick9913/landingmodelthree",
    live: "https://landingmodelthree.vercel.app/",
  },
  {
    id: "02",
    title: "Street Collection",
    subtitle: "E-commerce",
    description:
      "Tienda online de ropa urbana con catálogo interactivo, promociones y sistema headless. Diseño minimalista enfocado en la exposición visual del producto.",
    image: "/ecommerce.png",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/Patrick9913/landingmodeltwo",
    live: "https://landingmodeltwo.vercel.app/",
  },
  {
    id: "03",
    title: "ConsultoraPro",
    subtitle: "Business Landing",
    description:
      "Landing page B2B para consultora empresarial especializada en estrategia, optimización de procesos y desarrollo de equipos de alto rendimiento.",
    image: "/consultora.png",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/Patrick9913/landingmodelone",
    live: "https://landingmodelone.vercel.app/",
  },
  {
    id: "04",
    title: "Escuela Margarita",
    subtitle: "Portal Institucional",
    description:
      "Plataforma web para institución educativa centenaria. Incluye información académica, modalidades, historia y contacto administrable.",
    image: "/escuela.png",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/Patrick9913/margaweb",
    live: "https://margaweb.vercel.app/",
  },
] as const;

export const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = DEMOS.length;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [next]);

  const current = DEMOS[currentIndex];

  return (
    <section
      id="projects"
      className="py-32 lg:py-48 bg-black text-[#F0F0F0] font-sans border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <header className="mb-16 md:mb-20 lg:mb-24">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 md:mb-10">
            <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {SECTION_INDEX}
            </span>
            <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {COPY.overline}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase">
            {COPY.title}
            <br />
            <span className="font-medium text-white/50">{COPY.accent}</span>
          </h2>

          <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-8 md:mt-10" aria-hidden />
        </header>

        <div className="border-t border-white/[0.08] pt-12 md:pt-16 lg:pt-20">
          <div
            key={currentIndex}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center project-content-in"
          >
            {/* Info del proyecto */}
            <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
              <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8">
                <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50">
                  {current.id}
                </span>
                <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-white/25">
                  {current.subtitle}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.1] mb-6 md:mb-8">
                {current.title}
              </h3>

              <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide max-w-lg mb-8 md:mb-10">
                {current.description}
              </p>

              <ul className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12" role="list">
                {current.technologies.map((tech) => (
                  <li key={tech}>
                    <span className="inline-block font-mono text-[10px] font-light tracking-[0.15em] uppercase text-white/40 border border-white/[0.08] px-3 py-2">
                      {tech}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 border-t border-white/[0.08]">
                <a
                  href={current.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-4 px-8 py-4 bg-[#F0F0F0] text-black text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90"
                >
                  Ver Código
                  <span
                    className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </a>
                <a
                  href={current.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-4 px-8 py-4 border border-white/20 bg-transparent text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 rounded-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/40"
                >
                  Ver Demo
                  <span className="text-base" aria-hidden>
                    ↗
                  </span>
                </a>
              </div>
            </div>

            {/* Panel visual */}
            <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
              <div className="border border-white/[0.08] overflow-hidden">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-[420px] object-cover object-top grayscale transition-[filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:grayscale-0 hover:scale-[1.02] motion-reduce:grayscale-0 motion-reduce:scale-100"
                />
              </div>
            </div>
          </div>

          {/* Navegación del carrusel */}
          <nav
            className="mt-12 md:mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            aria-label="Navegación de demos"
          >
            <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50">
              {current.id} / {String(total).padStart(2, "0")}
            </span>

            <div className="flex items-center justify-between md:justify-end gap-8 md:gap-12">
              <button
                type="button"
                onClick={prev}
                className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                aria-label="Demo anterior"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-3" role="tablist" aria-label="Seleccionar demo">
                {DEMOS.map((demo, index) => (
                  <button
                    key={demo.id}
                    type="button"
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Ir a ${demo.title}`}
                    onClick={() => goTo(index)}
                    className={`h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index === currentIndex
                        ? "w-10 bg-[#F0F0F0]"
                        : "w-6 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                aria-label="Siguiente demo"
              >
                Siguiente →
              </button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Projects;
