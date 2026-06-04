"use client";

import { useEffect, useId, useState, type MouseEvent } from "react";
import { getHeroScrollPhases, HERO_SCROLL_COMPLETE } from "./moon-scene/useHeroScroll";
import { getGameStartVisuals } from "./moon-scene/useHeroGameStart";

type HeroExploreCalloutProps = {
  scrollProgress: number;
  reducedMotion?: boolean;
  gameStartProgress?: number;
  loading?: boolean;
  onStartGame?: () => void;
};

/** Origen aproximado del cluster de luces en la vista final del lado oscuro. */
const LIGHT_ORIGIN = { x: 36, y: 56 };
const LABEL_ANCHOR = { x: 10, y: 82 };

const BRANCH_PATHS = [
  "M 36 56 C 33.5 53.5 31 51.5 28.5 50.5",
  "M 36 56 C 37.8 54.2 39.2 52.8 40.5 51.8",
  "M 36 56 C 35 59 34 61.5 33 63.5",
] as const;

const MAIN_PATH = `M ${LIGHT_ORIGIN.x} ${LIGHT_ORIGIN.y} C 32 58.5 27 64 24 68 S 20 72 ${LABEL_ANCHOR.x} ${LABEL_ANCHOR.y}`;

function branchOffset(reveal: number, delay: number) {
  return Math.max(0, 1 - (reveal - delay) * 2.8);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function usePreyGlitchBurst(active: boolean) {
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    if (!active) {
      setBursting(false);
      return;
    }

    let waitId = 0;
    let burstId = 0;
    let followUpId = 0;
    let cancelled = false;

    const clearAll = () => {
      window.clearTimeout(waitId);
      window.clearTimeout(burstId);
      window.clearTimeout(followUpId);
    };

    const runBurst = (durationMs: number, onDone: () => void) => {
      setBursting(true);
      burstId = window.setTimeout(() => {
        setBursting(false);
        onDone();
      }, durationMs);
    };

    const scheduleNext = () => {
      if (cancelled) return;

      waitId = window.setTimeout(() => {
        if (cancelled) return;

        runBurst(randomBetween(380, 780), () => {
          if (cancelled) return;

          if (Math.random() < 0.22) {
            followUpId = window.setTimeout(() => {
              if (cancelled) return;
              runBurst(randomBetween(180, 320), scheduleNext);
            }, randomBetween(70, 160));
            return;
          }

          scheduleNext();
        });
      }, randomBetween(2800, 6800));
    };

    scheduleNext();

    return () => {
      cancelled = true;
      clearAll();
      setBursting(false);
    };
  }, [active]);

  return bursting;
}

export function HeroExploreCallout({
  scrollProgress,
  reducedMotion = false,
  gameStartProgress = 0,
  loading = false,
  onStartGame,
}: HeroExploreCalloutProps) {
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

  const glitchBurst = usePreyGlitchBurst(
    !reducedMotion &&
      !loading &&
      gameStartProgress <= 0 &&
      reveal > 0.55 &&
      phase2Raw >= 0.55
  );

  if (reveal <= 0.01 || phase2Raw < 0.55) return null;

  const mainOffset = reducedMotion ? 0 : branchOffset(reveal, 0.22);
  const labelOpacity = reducedMotion ? 1 : Math.min(1, Math.max(0, (reveal - 0.55) / 0.35));
  const preyOpacity = reducedMotion ? 1 : Math.min(1, Math.max(0, (reveal - 0.35) / 0.4));
  const startVisuals = getGameStartVisuals(gameStartProgress, loading);
  const decorFade = startVisuals.decorVisible ? 1 : Math.max(0, 1 - gameStartProgress * 14);

  const handleStart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onStartGame?.();
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[25]"
      style={{ opacity: reveal }}
      aria-hidden={reveal < 0.4}
    >
      {startVisuals.decorVisible ? (
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: decorFade }}
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
      ) : null}

      <div
        className={`pointer-events-none absolute right-[12%] top-1/2 md:right-[14%] ${gameStartProgress > 0.05 ? "z-[31]" : ""}`}
        style={{
          opacity: preyOpacity * startVisuals.titleOpacity,
          transform: reducedMotion
            ? "translateY(-50%)"
            : `translateY(calc(-50% + ${(1 - preyOpacity) * 18}px))`,
        }}
        aria-hidden
      >
        <div className="prey-title-stretch text-right">
          <p
            className={`prey-title-glitch font-sans text-[clamp(2.2rem,6vw,4.5rem)] font-extralight uppercase leading-none tracking-[0.42em] text-white ${reducedMotion ? "prey-title-glitch--static" : ""} ${glitchBurst ? "prey-title-glitch--burst" : ""} ${startVisuals.intenseGlitch ? "prey-title-glitch--intense" : ""}`}
            data-text="Prey"
          >
            Prey
          </p>
        </div>
      </div>

      {gameStartProgress <= 0.01 ? (
        <button
          type="button"
          onClick={handleStart}
          className="hero-explore-label pointer-events-auto absolute bottom-[18%] left-[7%] border border-amber-100/20 bg-black/45 px-5 py-3.5 backdrop-blur-sm transition-colors hover:border-amber-100/40 hover:bg-black/60 md:bottom-[16%] md:left-[8%]"
          style={{
            opacity: labelOpacity,
            transform: reducedMotion ? undefined : `translateY(${(1 - labelOpacity) * 12}px)`,
          }}
        >
          <span className="font-mono text-[10px] font-light uppercase tracking-[0.32em] text-amber-100/90">
            Nueva Partida
          </span>
        </button>
      ) : null}
    </div>
  );
}
