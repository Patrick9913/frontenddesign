"use client";

import { useEffect, useRef } from "react";

const PROXIMITY_RADIUS = 108;
const PULL_STRENGTH = 5;

export function useConstellationProximity(radius = PROXIMITY_RADIUS) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLSpanElement>());
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const frameRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchPrimary = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || touchPrimary) return;

    const resetLabel = (el: HTMLSpanElement) => {
      el.style.setProperty("--proximity", "0");
      el.style.setProperty("--pull-x", "0");
      el.style.setProperty("--pull-y", "0");
    };

    const updateProximity = () => {
      const { x, y, inside } = mouseRef.current;

      labelRefs.current.forEach((el) => {
        if (!inside) {
          resetLabel(el);
          return;
        }

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - dist / radius);

        el.style.setProperty("--proximity", proximity.toFixed(3));

        if (proximity > 0.02) {
          const pull = proximity * PULL_STRENGTH;
          const len = dist || 1;
          el.style.setProperty("--pull-x", ((dx / len) * pull).toFixed(2));
          el.style.setProperty("--pull-y", ((dy / len) * pull).toFixed(2));
        } else {
          el.style.setProperty("--pull-x", "0");
          el.style.setProperty("--pull-y", "0");
        }
      });

      frameRef.current = requestAnimationFrame(updateProximity);
    };

    const handleMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, inside: true };
    };

    const handleLeave = () => {
      mouseRef.current.inside = false;
      labelRefs.current.forEach(resetLabel);
    };

    root.addEventListener("mousemove", handleMove, { passive: true });
    root.addEventListener("mouseleave", handleLeave);
    frameRef.current = requestAnimationFrame(updateProximity);

    return () => {
      root.removeEventListener("mousemove", handleMove);
      root.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frameRef.current);
      labelRefs.current.forEach(resetLabel);
    };
  }, [radius]);

  const registerLabel = (label: string) => (el: HTMLSpanElement | null) => {
    if (el) labelRefs.current.set(label, el);
    else labelRefs.current.delete(label);
  };

  return { rootRef, registerLabel };
}
