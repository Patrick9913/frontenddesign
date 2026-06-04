"use client";

import React from "react";
import { useScene } from "../../scene/SceneContext";
import { getSectionMeta } from "../../scene/sections";

const TECHNOLOGIES_BY_AREA = [
  { id: "01", area: "Frontend", techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { id: "02", area: "Backend y Datos", techs: ["Node.js", "Firebase", "MongoDB"] },
  { id: "03", area: "Testing", techs: ["Jest", "ESLint", "Storybook"] },
  { id: "04", area: "Workflow", techs: ["Git/GitHub", "Docker", "Vercel"] },
] as const;

type SkillsPanelProps = {
  progress: number;
};

export function SkillsPanel({ progress }: SkillsPanelProps) {
  const { setActiveSkillIndex } = useScene();
  const meta = getSectionMeta("skills");
  const reveal = Math.min(1, Math.max(0, progress));

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
          STACK
          <br />
          <span className="font-medium text-white/50">TÉCNICO</span>
        </h2>
      </header>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        style={{ pointerEvents: reveal > 0.25 ? "auto" : "none" }}
      >
        {TECHNOLOGIES_BY_AREA.map((group, index) => (
          <button
            key={group.id}
            type="button"
            onMouseEnter={() => setActiveSkillIndex(index)}
            onMouseLeave={() => setActiveSkillIndex(-1)}
            onFocus={() => setActiveSkillIndex(index)}
            onBlur={() => setActiveSkillIndex(-1)}
            className="text-left border border-white/[0.08] p-6 transition-[border-color,background-color] duration-500 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">{group.id}</span>
            <h3 className="mt-3 text-base font-light uppercase tracking-wide text-[#F0F0F0]">{group.area}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.techs.map((tech) => (
                <li
                  key={tech}
                  className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/40 border border-white/[0.08] px-2 py-1"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
