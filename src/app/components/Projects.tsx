"use client";

import { useState, useEffect, useCallback } from "react";
import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { ProjectsSectionDecor } from "./expanded/SectionDecors";

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
    <ExpandedSection
      id="projects"
      decor={<ProjectsSectionDecor />}
      index={SECTION_INDEX}
      overline={COPY.overline}
      title={COPY.title}
      accent={COPY.accent}
    >
      <ExpandedContentPanel>
        <div key={currentIndex} className="project-content-in grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <div className="order-2 flex flex-col lg:order-1 lg:col-span-5">
            <div className="mb-6 flex items-baseline justify-between gap-4 md:mb-8">
              <span className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50 md:text-xs">
                {current.id}
              </span>
              <span className="font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/25 md:text-xs">
                {current.subtitle}
              </span>
            </div>

            <h3 className="mb-6 text-3xl font-light leading-[1.1] tracking-[-0.02em] text-[#F0F0F0] md:mb-8 md:text-4xl lg:text-5xl">
              {current.title}
            </h3>

            <p className="mb-8 max-w-lg text-sm font-light leading-[1.75] tracking-wide text-white/50 md:mb-10 md:text-base">
              {current.description}
            </p>

            <ul className="mb-10 flex flex-wrap gap-2 md:mb-12 md:gap-3" role="list">
              {current.technologies.map((tech) => (
                <li key={tech}>
                  <span className="expanded-tech-tag">{tech}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:gap-6">
              <a
                href={current.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-4 bg-[#F0F0F0] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-500 hover:opacity-90 md:text-xs"
              >
                Ver Código
                <span className="text-base transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
              <a
                href={current.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-4 border border-white/20 bg-transparent px-8 py-4 text-[10px] font-light uppercase tracking-[0.2em] text-white/50 transition-[color,border-color] duration-500 hover:border-white/40 hover:text-[#F0F0F0] md:text-xs"
              >
                Ver Demo
                <span className="text-base" aria-hidden>
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <div className="projects-panel-window projects-panel-window--front expanded-project-frame relative overflow-hidden">
              <div className="projects-panel-window-bar">
                <span />
                <span />
                <span />
                <span className="projects-panel-window-title">{current.title.toLowerCase().replace(/\s+/g, "-")}</span>
              </div>
              <img
                src={current.image}
                alt={current.title}
                className="h-56 w-full object-cover object-top grayscale transition-[filter,transform] duration-500 hover:scale-[1.02] hover:grayscale-0 motion-reduce:scale-100 motion-reduce:grayscale-0 sm:h-72 md:h-80 lg:h-[420px]"
              />
            </div>
          </div>
        </div>

        <nav
          className="mt-12 flex flex-col gap-8 border-t border-white/[0.08] pt-8 md:mt-16 md:flex-row md:items-center md:justify-between"
          aria-label="Navegación de demos"
        >
          <span className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50 md:text-xs">
            {current.id} / {String(total).padStart(2, "0")}
          </span>

          <div className="flex items-center justify-between gap-8 md:justify-end md:gap-12">
            <button
              type="button"
              onClick={prev}
              className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/40 transition-colors duration-500 hover:text-[#F0F0F0] md:text-xs"
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
                  className={`h-px transition-all duration-500 ${
                    index === currentIndex ? "w-10 bg-[#F0F0F0]" : "w-6 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/40 transition-colors duration-500 hover:text-[#F0F0F0] md:text-xs"
              aria-label="Siguiente demo"
            >
              Siguiente →
            </button>
          </div>
        </nav>
      </ExpandedContentPanel>
    </ExpandedSection>
  );
};

export default Projects;
