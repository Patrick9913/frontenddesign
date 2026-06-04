"use client";

import React from "react";
import { getSectionMeta } from "../../scene/sections";

const FORMATION = [
  {
    id: "01",
    title: "Ciencia de Datos",
    institution: "Universidad de Buenos Aires (UBA)",
    period: "Actualidad",
    description:
      "Formación académica enfocada en el pensamiento lógico, análisis estructural y desarrollo algorítmico profundo.",
  },
  {
    id: "02",
    title: "Desarrollo de Software",
    institution: "Coderhouse",
    period: "Completado",
    description:
      "Cursos intensivos enfocados en desarrollo web y programación sobre el ecosistema moderno.",
  },
  {
    id: "03",
    title: "Formación Autodidacta",
    institution: "Desarrollo Visual y Técnico",
    period: "Múltiples años",
    description:
      "Exploración independiente en tecnologías, UX y diseño de interfaces durante años de práctica.",
  },
] as const;

type ExperiencePanelProps = {
  progress: number;
};

export function ExperiencePanel({ progress }: ExperiencePanelProps) {
  const meta = getSectionMeta("experience");
  const reveal = Math.min(1, Math.max(0, progress));

  return (
    <div
      className="pointer-events-none w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24"
      style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 48}px)` }}
    >
      <header className="mb-12 md:mb-16">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.index}
          </span>
          <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.label}
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase">
          TRAYECTORIA
          <br />
          <span className="font-medium text-white/50">ACADÉMICA</span>
        </h2>
        <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-6 md:mt-8" aria-hidden />
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8"
        style={{ pointerEvents: reveal > 0.3 ? "auto" : "none" }}
      >
        {FORMATION.map((item, index) => (
          <article
            key={item.id}
            className={`border-t border-white/[0.08] pt-8 md:pt-10 ${
              index > 0 ? "md:border-l md:border-white/[0.08] md:pl-8" : ""
            }`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">{item.id}</span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/25">{item.period}</span>
            </div>
            <h3 className="text-lg md:text-xl font-light text-[#F0F0F0] mb-2">{item.title}</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-4">{item.institution}</p>
            <p className="text-sm font-light text-white/50 leading-[1.75]">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
