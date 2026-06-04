"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "./useHeroScroll";

const TRANSITION_MS = 7600;

export function useHeroMarsTravel() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [returning, setReturning] = useState(false);
  const rafRef = useRef(0);

  const runTransition = useCallback((from: number, to: number, onDone: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startedAt = performance.now();
    const duration = TRANSITION_MS * Math.abs(to - from);

    const tick = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const next = from + (to - from) * raw;
      setProgress(next);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (active && !returning && progress >= 1) return;
    if (active && progress > 0 && progress < 1) return;

    setReturning(false);
    setActive(true);
    runTransition(progress, 1, () => setProgress(1));
  }, [active, progress, returning, runTransition]);

  const returnToMoon = useCallback(() => {
    if (!active || progress <= 0) return;
    if (returning) return;

    setReturning(true);
    runTransition(progress, 0, () => {
      setProgress(0);
      setActive(false);
      setReturning(false);
    });
  }, [active, progress, returning, runTransition]);

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

  const atMars = active && !returning && progress >= 0.999;
  const inTransit = active && progress > 0.001 && progress < 0.999;

  return {
    progress,
    easedProgress: easeInOutCubic(progress),
    active,
    returning,
    atMars,
    inTransit,
    start,
    returnToMoon,
    complete: progress >= 1,
  };
}
