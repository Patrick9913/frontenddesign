"use client";

import type { CSSProperties } from "react";
import { PanelPreviewFooter } from "./panelPreviews/PanelPreviewChrome";

type ConstellationNode = {
  label: string;
  ring: 1 | 2 | 3;
  angle: number;
};

const CONSTELLATION_NODES: ConstellationNode[] = [
  { label: "React", ring: 1, angle: 10 },
  { label: "Next.js", ring: 1, angle: 70 },
  { label: "TypeScript", ring: 1, angle: 140 },
  { label: "Tailwind", ring: 1, angle: 220 },
  { label: "Node.js", ring: 2, angle: 25 },
  { label: "Firebase", ring: 2, angle: 95 },
  { label: "Jest", ring: 2, angle: 165 },
  { label: "Git", ring: 2, angle: 250 },
  { label: "Docker", ring: 2, angle: 310 },
  { label: "Vercel", ring: 3, angle: 40 },
  { label: "Storybook", ring: 3, angle: 130 },
  { label: "MongoDB", ring: 3, angle: 210 },
  { label: "ESLint", ring: 3, angle: 300 },
];

const RING_CLASS: Record<ConstellationNode["ring"], string> = {
  1: "constellation-ring--inner",
  2: "constellation-ring--mid",
  3: "constellation-ring--outer",
};

export function SkillsConstellationPreview() {
  const rings: ConstellationNode["ring"][] = [1, 2, 3];

  return (
    <div className="panel-preview skills-constellation-preview relative h-full w-full overflow-hidden bg-gradient-to-b from-[#050505] to-[#000000]">
      <div className="constellation-parallax-wrap absolute inset-0">
        <div className="constellation-field" aria-hidden />

        {rings.map((ring) => (
          <div
            key={ring}
            className={`constellation-ring ${RING_CLASS[ring]}`}
            aria-hidden
          >
            {CONSTELLATION_NODES.filter((node) => node.ring === ring).map((node) => (
              <span
                key={node.label}
                className="constellation-node"
                style={{ "--node-angle": `${node.angle}deg` } as CSSProperties}
              >
                <span className="constellation-node-label">{node.label}</span>
              </span>
            ))}
          </div>
        ))}

        <div className="constellation-core" aria-hidden>
          <span className="constellation-core-ring" />
          <span className="constellation-core-dot" />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
        <div className="panel-preview-parallax-stage constellation-copy max-w-md">
          <span className="panel-preview-layer panel-preview-layer--deep mb-4 block font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
            Preview
          </span>
          <h2 className="panel-preview-layer panel-preview-layer--back text-3xl font-light uppercase leading-[1.05] tracking-[-0.02em] text-white/25 md:text-4xl">
            STACK
          </h2>
          <h2 className="panel-preview-layer panel-preview-layer--mid -mt-1 text-3xl font-medium uppercase leading-[1.05] tracking-[-0.02em] md:text-4xl">
            <span className="text-white/45">TÉCNICO</span>
          </h2>
          <div className="panel-preview-layer panel-preview-layer--front mt-5">
            <div className="mb-4 h-px w-8 bg-white/[0.08]" aria-hidden />
            <p className="text-xs font-light leading-[1.75] tracking-wide text-white/45 md:text-sm">
              Tecnologías en órbita — el ecosistema que uso para construir interfaces fluidas y
              escalables.
            </p>
          </div>
        </div>

        <PanelPreviewFooter />
      </div>
    </div>
  );
}
