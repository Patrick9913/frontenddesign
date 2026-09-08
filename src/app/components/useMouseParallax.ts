"use client";

import { useMemo, useSyncExternalStore } from "react";

type Pointer = { x: number; y: number };

const ZERO: Pointer = { x: 0, y: 0 };

let cached: Pointer = ZERO;
let target: Pointer = ZERO;
let frame = 0;
let listeners = new Set<() => void>();
let started = false;
let orientationBound = false;
let permissionAsked = false;

function emit() {
  listeners.forEach((l) => l());
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tick() {
  const x = cached.x + (target.x - cached.x) * 0.08;
  const y = cached.y + (target.y - cached.y) * 0.08;

  if (Math.abs(x - cached.x) > 0.0001 || Math.abs(y - cached.y) > 0.0001) {
    cached = { x, y };
    emit();
  }

  frame = requestAnimationFrame(tick);
}

function onOrientation(e: DeviceOrientationEvent) {
  // beta ~90 con el teléfono vertical; gamma = inclinación izquierda/derecha
  const gamma = e.gamma ?? 0;
  const beta = e.beta ?? 90;
  target = {
    x: clamp(gamma / 28, -1, 1),
    y: clamp((beta - 90) / 28, -1, 1),
  };
}

async function bindOrientation() {
  if (orientationBound || typeof window === "undefined") return;

  const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };

  try {
    if (typeof DOE.requestPermission === "function") {
      if (permissionAsked) return;
      permissionAsked = true;
      const result = await DOE.requestPermission();
      if (result !== "granted") return;
    }

    window.addEventListener("deviceorientation", onOrientation, true);
    orientationBound = true;
  } catch {
    // Sin permiso o sin soporte: el parallax de mouse sigue si existe.
  }
}

function ensureLoop() {
  if (started || typeof window === "undefined") return;
  started = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const touchPrimary = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  if (!touchPrimary) {
    const onMove = (e: MouseEvent) => {
      target = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const onLeave = () => {
      target = ZERO;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
  } else {
    // iOS exige gesto del usuario para el giroscopio
    const requestOnGesture = () => {
      void bindOrientation();
      window.removeEventListener("touchstart", requestOnGesture);
      window.removeEventListener("click", requestOnGesture);
    };
    window.addEventListener("touchstart", requestOnGesture, {
      passive: true,
      once: true,
    });
    window.addEventListener("click", requestOnGesture, { once: true });

    // Android / otros: suele funcionar sin permiso
    void bindOrientation();
  }

  frame = requestAnimationFrame(tick);
}

function subscribe(listener: () => void) {
  ensureLoop();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cached;
}

function getServerSnapshot() {
  return ZERO;
}

/** Parallax suave: mouse en desktop, giroscopio en móvil. */
export function useMouseParallax(strength = 1) {
  const pointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(
    () => ({
      x: pointer.x * strength,
      y: pointer.y * strength,
    }),
    [pointer, strength]
  );
}

export function parallaxStyle(x: number, y: number, depth: number) {
  return {
    transform: `translate3d(${x * depth}px, ${y * depth}px, 0)`,
  } as const;
}
