"use client";

import { getHeroScrollPhases, easeOutCubic } from "./moon-scene/useHeroScroll";
import { HERO_INTRO_COPY } from "../content/heroContent";

type HeroIntroPanelProps = {
  scrollProgress: number;
  reducedMotion?: boolean;
};

function revealProgress(phase1Raw: number, start = 0.38, end = 0.92) {
  if (end <= start) return 1;
  return easeOutCubic((phase1Raw - start) / (end - start));
}

export function HeroIntroPanel({ scrollProgress, reducedMotion = false }: HeroIntroPanelProps) {
  const { phase1Raw, phase2Raw } = getHeroScrollPhases(scrollProgress);
  const reveal = reducedMotion ? 1 : revealProgress(phase1Raw);
  const fadeOut = reducedMotion ? 1 : 1 - easeOutCubic(Math.min(1, phase2Raw / 0.32));
  const opacity = Math.min(1, Math.max(0, reveal * fadeOut));
  const translateY = (1 - reveal) * 48;

  if (opacity <= 0.001 && !reducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end px-8 md:px-16 lg:px-24"
      aria-hidden={opacity < 0.05}
    >
      <div
        className="pointer-events-auto w-full max-w-md text-left md:max-w-lg lg:max-w-xl"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: reducedMotion ? "none" : undefined,
        }}
      >
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-8">
          <span className="font-mono text-[10px] font-light uppercase tracking-[0.25em] text-white/45 md:text-xs">
            {HERO_INTRO_COPY.index}
          </span>
          <span className="text-[10px] font-light uppercase tracking-[0.25em] text-white/45 md:text-xs">
            {HERO_INTRO_COPY.overline}
          </span>
        </div>

        <h1 className="text-4xl font-light leading-[1.05] tracking-[-0.02em] text-[#F0F0F0] md:text-5xl lg:text-6xl">
          {HERO_INTRO_COPY.name}
        </h1>

        <p className="mt-4 text-sm font-light uppercase tracking-[0.22em] text-white/55 md:mt-5 md:text-base">
          {HERO_INTRO_COPY.role}
        </p>

        <div className="mt-6 h-px w-8 bg-white/[0.08] md:mt-8 md:w-12" aria-hidden />

        <p className="mt-6 max-w-sm text-sm font-light leading-[1.75] tracking-wide text-[#F0F0F0]/85 md:mt-8 md:text-base">
          {HERO_INTRO_COPY.tagline}
        </p>

        <p className="mt-5 font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/35 md:mt-6">
          {HERO_INTRO_COPY.stack}
        </p>

        <a
          href={HERO_INTRO_COPY.ctaHref}
          className="mt-8 inline-flex items-center gap-3 border border-white/15 px-5 py-3 text-[10px] font-light uppercase tracking-[0.24em] text-white/70 transition-colors hover:border-white/30 hover:text-white md:mt-10"
        >
          {HERO_INTRO_COPY.cta}
          <span aria-hidden>↓</span>
        </a>
      </div>
    </div>
  );
}
