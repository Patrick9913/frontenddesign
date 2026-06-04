"use client";

import { getHeroScrollPhases } from "./moon-scene/useHeroScroll";

type HeroDarkSideHintProps = {
  scrollProgress: number;
};

export function HeroDarkSideHint({ scrollProgress }: HeroDarkSideHintProps) {
  const { phase2 } = getHeroScrollPhases(scrollProgress);
  const opacity = Math.min(1, Math.max(0, (phase2 - 0.42) / 0.45));

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center px-8 md:bottom-16"
      style={{ opacity }}
      aria-hidden
    >
      <p className="max-w-md text-center font-mono text-[10px] font-light uppercase tracking-[0.34em] text-amber-100/25">
        Señales débiles · algo respira bajo la superficie
      </p>
    </div>
  );
}
