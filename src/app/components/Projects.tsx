"use client";

import { useState, useEffect, useCallback } from "react";
import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { ProjectsSectionDecor } from "./expanded/SectionDecors";

const COPY = {
  title: "PROYECTOS",
  accent: "SELECCIONADOS",
} as const;

type ProjectItem = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  image?: string;
  github?: string;
  live?: string;
};

const PROJECTS: ProjectItem[] = [
  {
    id: "01",
    title: "Grupo Sheina",
    subtitle: "Plataforma de gestión",
    period: "2025 — Actualidad",
    description:
      "Plataforma gastronómica: menús, seguimiento logístico de transportes en tiempo real, fichas de stock y arqueos. Operación diaria de cocina, logística y administración en una sola interfaz.",
    live: "https://gruposheina-five.vercel.app/views/login",
  },
  {
    id: "02",
    title: "Colegio Wolfsohn",
    subtitle: "Gestión de comedor",
    period: "2025 — Actualidad",
    description:
      "Sistema interno de gestión de comedor: cargas, seguimiento y operación diaria. Misma familia que Sheina: una plataforma de uso cotidiano para el equipo de la institución.",
  },
  {
    id: "03",
    title: "BNS Abogados",
    subtitle: "Sitio web · Estudio jurídico",
    period: "2025 — Actualidad",
    description:
      "Sitio del estudio BNS Abogados (CABA). Asesoría legal para empresas: derecho societario, laboral y comercial. Arquitectura clara, orientada a confianza y consulta.",
    live: "https://bnsabogados.vercel.app/",
  },
  {
    id: "04",
    title: "Aditamentos Piazza",
    subtitle: "Sitio + plataforma de gestión",
    period: "2025 — Actualidad",
    description:
      "Sitio comercial y plataforma de gestión operativa y administrativa para empresa metalúrgica. Presencia web y operación interna unificadas.",
  },
  {
    id: "05",
    title: "Municipalidad de Calingasta",
    subtitle: "Sitio + plataforma interna",
    period: "2024 — Actualidad",
    description:
      "Sitio institucional y plataforma interna de gestión para el municipio. Trámites y operación diaria en una interfaz pensada para uso interno.",
  },
  {
    id: "06",
    title: "Escuela Margarita",
    subtitle: "Portal institucional",
    period: "2025 — Actualidad",
    description:
      "Web para institución educativa: oferta académica, historia y contacto administrable.",
    image: "/escuela.png",
    github: "https://github.com/Patrick9913/margaweb",
    live: "https://margaweb.vercel.app/",
  },
];

export const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = PROJECTS.length;

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

  const current = PROJECTS[currentIndex];
  const slug = current.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <ExpandedSection
      id="projects"
      decor={<ProjectsSectionDecor />}
      title={COPY.title}
      accent={COPY.accent}
    >
      <ExpandedContentPanel>
        <div key={currentIndex} className="project-content-in grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <div className="order-2 flex flex-col lg:order-1 lg:col-span-5">
            <div className="mb-6 flex items-baseline justify-between gap-4 md:mb-8">
              <span className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/65 md:text-xs">
                {current.id} · {current.subtitle}
              </span>
              <span className="font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/50 md:text-xs">
                {current.period}
              </span>
            </div>

            <h3 className="mb-6 text-3xl font-light leading-[1.1] tracking-[-0.02em] text-[#F0F0F0] md:mb-8 md:text-4xl lg:text-5xl">
              {current.title}
            </h3>

            <p className="mb-10 max-w-lg text-sm font-light leading-[1.75] tracking-wide text-white/75 md:mb-12 md:text-base">
              {current.description}
            </p>

            {current.github || current.live ? (
              <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:gap-6">
                {current.github ? (
                  <a
                    href={current.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center gap-4 bg-[#F0F0F0] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-500 hover:opacity-90 md:text-xs"
                  >
                    Ver código
                    <span className="text-base transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </a>
                ) : null}
                {current.live ? (
                  <a
                    href={current.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-4 border border-white/20 bg-transparent px-8 py-4 text-[10px] font-light uppercase tracking-[0.2em] text-white/75 transition-[color,border-color] duration-500 hover:border-white/40 hover:text-[#F0F0F0] md:text-xs"
                  >
                    Ver sitio
                    <span className="text-base" aria-hidden>
                      ↗
                    </span>
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="border-t border-white/[0.08] pt-6 font-mono text-[10px] font-light uppercase tracking-[0.18em] text-white/45 md:text-xs">
                Proyecto entregado · demo a pedido
              </p>
            )}
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <div className="projects-panel-window projects-panel-window--front expanded-project-frame relative overflow-hidden">
              <div className="projects-panel-window-bar">
                <span />
                <span />
                <span />
                <span className="projects-panel-window-title">{slug}</span>
              </div>
              {current.image ? (
                <img
                  src={current.image}
                  alt={current.title}
                  className="h-56 w-full object-cover object-top grayscale transition-[filter,transform] duration-500 hover:scale-[1.02] hover:grayscale-0 motion-reduce:scale-100 motion-reduce:grayscale-0 sm:h-72 md:h-80 lg:h-[420px]"
                />
              ) : (
                <div className="flex h-56 w-full flex-col justify-end bg-[#0a0a0a] px-8 py-8 sm:h-72 md:h-80 lg:h-[420px]">
                  <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {current.subtitle}
                  </span>
                  <span className="text-2xl font-light uppercase tracking-[-0.02em] text-white/80 md:text-4xl">
                    {current.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav
          className="mt-12 flex flex-col gap-8 border-t border-white/[0.08] pt-8 md:mt-16 md:flex-row md:items-center md:justify-between"
          aria-label="Navegación de proyectos"
        >
          <span className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/65 md:text-xs">
            {current.id} / {String(total).padStart(2, "0")}
          </span>

          <div className="flex items-center justify-between gap-8 md:justify-end md:gap-12">
            <button
              type="button"
              onClick={prev}
              className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/65 transition-colors duration-500 hover:text-[#F0F0F0] md:text-xs"
              aria-label="Proyecto anterior"
            >
              ← Anterior
            </button>

            <div className="flex items-center gap-3" role="tablist" aria-label="Seleccionar proyecto">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Ir a ${project.title}`}
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
              className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/65 transition-colors duration-500 hover:text-[#F0F0F0] md:text-xs"
              aria-label="Siguiente proyecto"
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
