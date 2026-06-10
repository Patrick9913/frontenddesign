"use client";

import type { CSSProperties } from "react";
import { PanelPreviewChrome } from "./PanelPreviewChrome";

const MILESTONES = [
  { year: "2022", label: "UBA — Ciencia de Datos" },
  { year: "2023", label: "Frontend autodidacta" },
  { year: "2024", label: "React / Next.js" },
  { year: "2025", label: "Portfolio inmersivo" },
] as const;

const COPY = {
  title: "TRAYECTORIA",
  subtitle: "ACADÉMICA",
  desc:
    "Formación en la UBA y aprendizaje continuo en ecosistema técnico, UX y desarrollo web moderno.",
} as const;

export function ExperiencePanelPreview() {
  return (
    <PanelPreviewChrome
      rootClass="experience-panel-preview"
      title={COPY.title}
      subtitle={COPY.subtitle}
      desc={COPY.desc}
      decor={
        <div className="experience-panel-timeline" aria-hidden>
          <div className="experience-panel-timeline-axis" />
          {MILESTONES.map((item, index) => (
            <div
              key={item.year}
              className="experience-panel-milestone"
              style={{ "--milestone-i": index } as CSSProperties}
            >
              <span className="experience-panel-milestone-dot" />
              <span className="experience-panel-milestone-year">{item.year}</span>
              <span className="experience-panel-milestone-label">{item.label}</span>
            </div>
          ))}
        </div>
      }
    />
  );
}
