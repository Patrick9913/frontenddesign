"use client";

import { useEffect, useState, type RefObject } from "react";

/** Altura de scroll para la secuencia cinematográfica (intro + flota). */
export const HERO_SCROLL_VH = 140;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutCubic(t: number) {
  return 1 - (1 - clamp(t, 0, 1)) ** 3;
}

export function easeInOutCubic(t: number) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

export function useHeroScroll(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const scrollable = Math.max(section.offsetHeight - vh, 1);
      const scrolled = clamp(-section.getBoundingClientRect().top, 0, scrollable);
      setProgress(scrolled / scrollable);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return progress;
}
