"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type QualityProfile = "high" | "low";

function detectQuality(): QualityProfile {
  if (typeof window === "undefined") return "high";
  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return isMobile || reducedMotion ? "low" : "high";
}

export function useQualityProfile(): QualityProfile {
  const [quality, setQuality] = useState<QualityProfile>(detectQuality);

  useEffect(() => {
    setQuality(detectQuality());

    const onResize = () => {
      const next = detectQuality();
      setQuality((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return quality;
}

const stableGlConfig = {
  antialias: false,
  alpha: false,
  depth: true,
  stencil: false,
  powerPreference: "high-performance" as WebGLPowerPreference,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
};

if (typeof window !== "undefined") {
  stableGlConfig.antialias = detectQuality() === "high";
}

/** Atributos WebGL fijados al cargar el módulo en cliente — alpha explícito para postprocessing. */
export function getStableGlConfig() {
  return stableGlConfig;
}
