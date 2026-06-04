"use client";

import { useEffect, useId, useState } from "react";
import { getHeroScrollPhases, HERO_SCROLL_COMPLETE } from "./moon-scene/useHeroScroll";

type HeroExploreCalloutProps = {
  scrollProgress: number;
  reducedMotion?: boolean;
};

/** Origen aproximado del cluster de luces en la vista final del lado oscuro. */
const LIGHT_ORIGIN = { x: 36, y: 56 };
const LABEL_ANCHOR = { x: 22, y: 74 };

const BRANCH_PATHS = [
  "M 36 56 C 33.5 53.5 31 51.5 28.5 50.5",
  "M 36 56 C 37.8 54.2 39.2 52.8 40.5 51.8",
  "M 36 56 C 35 59 34 61.5 33 63.5",
] as const;

const MAIN_PATH = `M ${LIGHT_ORIGIN.x} ${LIGHT_ORIGIN.y} C 32 58.5 27 64 24 68 S 20 72 ${LABEL_ANCHOR.x} ${LABEL_ANCHOR.y}`;

function branchOffset(reveal: number, delay: number) {
  return Math.max(0, 1 - (reveal - delay) * 2.8);
}

export function HeroExploreCallout({ scrollProgress, reducedMotion = false }: HeroExploreCalloutProps) {
  const gradientId = useId().replace(/:/g, "");
  const [entered, setEntered] = useState(false);
  const { phase2Raw } = getHeroScrollPhases(scrollProgress);
  const complete = scrollProgress >= HERO_SCROLL_COMPLETE;
  const reveal = reducedMotion
    ? complete
      ? 1
      : 0
    : Math.min(1, Math.max(0, (scrollProgress - (HERO_SCROLL_COMPLETE - 0.1)) / 0.14));

  useEffect(() => {
    if (reveal > 0.35 && !entered) setEntered(true);
    if (reveal <= 0.05) setEntered(false);
  }, [entered, reveal]);

  if (reveal <= 0.01 || phase2Raw < 0.55) return null;

  const mainOffset = reducedMotion ? 0 : branchOffset(reveal, 0.22);
  const labelOpacity = reducedMotion ? 1 : Math.min(1, Math.max(0, (reveal - 0.55) / 0.35));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[25]"
      style={{ opacity: reveal }}
      aria-hidden={reveal < 0.4}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb070" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffd8aa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fff4e8" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {BRANCH_PATHS.map((path, index) => (
          <path
            key={path}
            d={path}
            pathLength={1}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={0.14 - index * 0.02}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={reducedMotion ? 0 : branchOffset(reveal, 0.08 + index * 0.06)}
            opacity={0.45 + index * 0.12}
          />
        ))}

        <path
          d={MAIN_PATH}
          pathLength={1}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={0.18}
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={mainOffset}
          className={entered && !reducedMotion ? "hero-explore-line-glow" : undefined}
        />

        <circle
          cx={LIGHT_ORIGIN.x}
          cy={LIGHT_ORIGIN.y}
          r={0.55}
          fill="#ffb878"
          opacity={0.18 + reveal * 0.35}
          className={entered && !reducedMotion ? "hero-explore-origin-pulse" : undefined}
        />
        <circle cx={LIGHT_ORIGIN.x} cy={LIGHT_ORIGIN.y} r={0.22} fill="#ffe8c8" opacity={0.5 + reveal * 0.4} />

        {!reducedMotion && reveal > 0.65 ? (
          <circle r={0.2} fill="#fff8f0" opacity={0.85}>
            <animateMotion dur="2.8s" repeatCount="indefinite" path={MAIN_PATH} />
          </circle>
        ) : null}
      </svg>

      <a
        href="#about"
        className="hero-explore-label pointer-events-auto absolute flex flex-col gap-2 border border-amber-100/20 bg-black/45 px-5 py-3.5 backdrop-blur-sm transition-colors hover:border-amber-100/40 hover:bg-black/60"
        style={{
          left: `${LABEL_ANCHOR.x - 4}%`,
          top: `${LABEL_ANCHOR.y - 5}%`,
          opacity: labelOpacity,
          transform: reducedMotion ? undefined : `translateY(${(1 - labelOpacity) * 12}px)`,
        }}
      >
        <span className="font-mono text-[10px] font-light uppercase tracking-[0.38em] text-amber-100/90">
          Explorar
        </span>
        <span className="font-mono text-[9px] font-light uppercase tracking-[0.28em] text-amber-100/35">
          Señales activas · continuar
        </span>
      </a>
    </div>
  );
}
