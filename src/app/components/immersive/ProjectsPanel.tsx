"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useScene } from "../../scene/SceneContext";
import { getSectionMeta } from "../../scene/sections";

const DEMOS = [
  {
    id: "01",
    title: "Estudio Jurídico",
    subtitle: "Landing Page",
    description: "Sitio profesional con arquitectura limpia orientada a conversión y confianza.",
    image: "/juridico.png",
    live: "https://landingmodelthree.vercel.app/",
    github: "https://github.com/Patrick9913/landingmodelthree",
  },
  {
    id: "02",
    title: "Street Collection",
    subtitle: "E-commerce",
    description: "Tienda urbana con catálogo interactivo y diseño minimalista product-led.",
    image: "/ecommerce.png",
    live: "https://landingmodeltwo.vercel.app/",
    github: "https://github.com/Patrick9913/landingmodeltwo",
  },
  {
    id: "03",
    title: "ConsultoraPro",
    subtitle: "Business Landing",
    description: "Landing corporativa con jerarquía visual clara y narrativa de servicios.",
    image: "/consultora.png",
    live: "https://landingmodelone.vercel.app/",
    github: "https://github.com/Patrick9913/landingmodelone",
  },
  {
    id: "04",
    title: "Escuela de Música",
    subtitle: "Institucional",
    description: "Sitio institucional con enfoque en programas, calendario y captación de alumnos.",
    image: "/escuela.png",
    live: "#",
    github: "https://github.com/Patrick9913",
  },
] as const;

type ProjectsPanelProps = {
  progress: number;
};

export function ProjectsPanel({ progress }: ProjectsPanelProps) {
  const { setActiveProjectIndex } = useScene();
  const [currentIndex, setCurrentIndex] = useState(0);
  const meta = getSectionMeta("projects");
  const reveal = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    setActiveProjectIndex(currentIndex);
  }, [currentIndex, setActiveProjectIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + DEMOS.length) % DEMOS.length);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % DEMOS.length);
  }, []);

  const current = DEMOS[currentIndex];

  return (
    <div
      className="pointer-events-none w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24"
      style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 48}px)` }}
    >
      <header className="mb-10 md:mb-14">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.index}
          </span>
          <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.label}
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] uppercase leading-[1.05]">
          DEMOS
          <br />
          <span className="font-medium text-white/50">REPRESENTATIVAS</span>
        </h2>
      </header>

      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-white/[0.08] pt-10"
        style={{ pointerEvents: reveal > 0.2 ? "auto" : "none" }}
      >
        <div className="lg:col-span-5">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">{current.id}</span>
          <h3 className="mt-4 text-2xl md:text-3xl font-light text-[#F0F0F0]">{current.title}</h3>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/30">{current.subtitle}</p>
          <p className="mt-6 text-sm font-light text-white/50 leading-[1.75] max-w-md">{current.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={current.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#F0F0F0] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-black hover:opacity-90"
            >
              Ver Demo →
            </a>
            <a
              href={current.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white/50 hover:border-white/40"
            >
              Código ↗
            </a>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-white/[0.08] overflow-hidden">
            <img src={current.image} alt={current.title} className="w-full h-56 md:h-72 object-cover object-top grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
          <nav className="mt-6 flex items-center justify-between" aria-label="Demos">
            <button type="button" onClick={prev} className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white">
              ← Anterior
            </button>
            <span className="font-mono text-[10px] text-white/30">
              {current.id} / {String(DEMOS.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={next} className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white">
              Siguiente →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export { DEMOS as PROJECT_DEMOS };
