"use client";

import { getCinematicPhases } from "./moon-scene/cinematicPhases";

type CinematicIntroTextProps = {
  scrollProgress: number;
  reducedMotion?: boolean;
};

export function CinematicIntroText({
  scrollProgress,
  reducedMotion = false,
}: CinematicIntroTextProps) {
  const { introOpacity } = getCinematicPhases(scrollProgress);
  const opacity = reducedMotion ? 0 : introOpacity;

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[18] flex items-center justify-center px-8"
      aria-hidden={opacity < 0.08}
    >
      <div
        className="max-w-2xl text-center"
        style={{
          opacity,
          transform: `translateY(${(1 - opacity) * 18}px)`,
          transition: reducedMotion ? "none" : undefined,
        }}
      >
        <p className="font-mono text-[10px] font-light uppercase tracking-[0.42em] text-white/35 md:text-xs">
          Portfolio inmersivo
        </p>
        <h1 className="mt-5 text-3xl font-light tracking-[-0.02em] text-[#F0F0F0] md:text-5xl lg:text-6xl">
          Experiencia Cinematográfica
        </h1>
        <p className="mt-4 font-mono text-xs font-light uppercase tracking-[0.28em] text-white/45 md:text-sm">
          Desarrollada por mi
        </p>
        <div className="mx-auto mt-10 h-px w-12 bg-white/15" aria-hidden />
      </div>
    </div>
  );
}
