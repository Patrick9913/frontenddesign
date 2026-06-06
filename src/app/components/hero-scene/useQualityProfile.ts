"use client";

import { useContext } from "react";
import * as THREE from "three";
import { QualityProfileContext } from "./QualityProfileContext";
import {
  detectDefaultQuality,
  getQualitySettings,
  resolveInitialQuality,
  type QualityProfile,
  type QualitySettings,
} from "./qualitySettings";

export type { QualityProfile, QualitySettings } from "./qualitySettings";
export {
  getQualitySettings,
  isLegacyHighQuality,
  QUALITY_DESCRIPTIONS,
  QUALITY_LABELS,
} from "./qualitySettings";
export { QualityProfileProvider, useQualityProfileContext } from "./QualityProfileContext";

function useOptionalQualityContext() {
  return useContext(QualityProfileContext);
}

export function useQualityProfile(): QualityProfile {
  const ctx = useOptionalQualityContext();
  return ctx?.quality ?? detectDefaultQuality();
}

export function useQualitySettings(): {
  quality: QualityProfile;
  settings: QualitySettings;
  setQuality: (quality: QualityProfile) => void;
} {
  const ctx = useOptionalQualityContext();
  const quality = ctx?.quality ?? detectDefaultQuality();
  const settings = ctx?.settings ?? getQualitySettings(quality);
  const setQuality = ctx?.setQuality ?? (() => undefined);

  return { quality, settings, setQuality };
}

const stableGlBase = {
  alpha: false,
  depth: true,
  stencil: false,
  powerPreference: "high-performance" as WebGLPowerPreference,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
};

/** Atributos WebGL — antialias según preset guardado al cargar el módulo. */
export function getStableGlConfig() {
  const settings = getQualitySettings(resolveInitialQuality());
  return {
    ...stableGlBase,
    antialias: settings.canvasAntialias,
  };
}
