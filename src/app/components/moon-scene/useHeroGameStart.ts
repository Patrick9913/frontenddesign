"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "./useHeroScroll";

export const GAME_START = {
  darkenEnd: 0.24,
  titleHoldStart: 0.18,
  titleFadeStart: 0.72,
  titleFadeEnd: 0.86,
  loadingStart: 0.86,
} as const;

const TRANSITION_MS = 6400;

export function getGameStartVisuals(progress: number, loading: boolean) {
  const darken = loading ? 1 : easeInOutCubic(Math.min(1, progress / GAME_START.darkenEnd));
  const titleOpacity =
    progress < GAME_START.titleFadeStart
      ? 1
      : loading
        ? 0
        : Math.max(
            0,
            1 -
              (progress - GAME_START.titleFadeStart) /
                (GAME_START.titleFadeEnd - GAME_START.titleFadeStart)
          );
  const intenseGlitch =
    progress >= GAME_START.titleHoldStart && progress < GAME_START.titleFadeEnd && !loading;
  const showLoading = loading || progress >= GAME_START.loadingStart;
  const loadingOpacity = loading
    ? 1
    : easeInOutCubic(Math.min(1, (progress - GAME_START.loadingStart) / 0.08));
  const decorVisible = progress < 0.08;

  return {
    darken,
    titleOpacity,
    intenseGlitch,
    showLoading,
    loadingOpacity,
    decorVisible,
  };
}

export function useHeroGameStart() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const rafRef = useRef(0);

  const start = useCallback(() => {
    if (active) return;
    setActive(true);
    setProgress(0);
    setLoading(false);

    const startedAt = performance.now();

    const tick = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / TRANSITION_MS);
      setProgress(raw);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setLoading(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [active]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  const visuals = getGameStartVisuals(progress, loading);

  return {
    progress,
    easedProgress: easeInOutCubic(progress),
    active,
    loading,
    start,
    visuals,
  };
}
