"use client";

import { useEffect, useState, type RefObject } from "react";

export const HERO_SCROLL_VH = 340;
export const HERO_PHASE1_END = 0.4;
/** Scroll del hero considerado completo (vista final bloqueada). */
export const HERO_PHASE2_COMPLETE = 0.2175;
export const HERO_SCROLL_COMPLETE =
  HERO_PHASE1_END + HERO_PHASE2_COMPLETE * (1 - HERO_PHASE1_END);

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

export function easeInOutQuint(t: number) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
}

export function getHeroScrollPhases(scrollProgress: number) {
  const global = clamp(scrollProgress, 0, 1);
  const phase1Raw = clamp(global / HERO_PHASE1_END, 0, 1);
  const phase2Raw = clamp((global - HERO_PHASE1_END) / (1 - HERO_PHASE1_END), 0, 1);
  const phase2Progress = clamp(phase2Raw / HERO_PHASE2_COMPLETE, 0, 1);

  return {
    global,
    phase1: easeInOutQuint(phase1Raw),
    phase2: easeInOutQuint(phase2Progress),
    phase1Raw,
    phase2Raw,
    phase2Locked: phase2Raw >= HERO_PHASE2_COMPLETE,
  };
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
