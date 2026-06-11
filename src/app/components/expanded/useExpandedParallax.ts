"use client";

import { useEffect, useRef } from "react";

const FOLLOW = 0.075;

export function useExpandedParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchPrimary = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || touchPrimary) return;

    let px = 0;
    let py = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId = 0;

    const handleMove = (event: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const tick = () => {
      px += (targetX - px) * FOLLOW;
      py += (targetY - py) * FOLLOW;
      root.style.setProperty("--panel-px", px.toFixed(4));
      root.style.setProperty("--panel-py", py.toFixed(4));
      frameId = requestAnimationFrame(tick);
    };

    root.addEventListener("mousemove", handleMove, { passive: true });
    frameId = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frameId);
      root.style.removeProperty("--panel-px");
      root.style.removeProperty("--panel-py");
    };
  }, []);

  return ref;
}
