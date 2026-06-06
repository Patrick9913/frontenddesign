export type QualityProfile = "low" | "medium" | "high" | "ultra";

export const QUALITY_STORAGE_KEY = "patrick-hero-graphics-quality";

export const QUALITY_LABELS: Record<QualityProfile, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  ultra: "Ultra",
};

export const QUALITY_DESCRIPTIONS: Record<QualityProfile, string> = {
  low: "Rendimiento máximo",
  medium: "Equilibrado",
  high: "Detalle y efectos completos",
  ultra: "Máxima fidelidad visual",
};

export type QualitySettings = {
  dpr: [number, number];
  canvasAntialias: boolean;
  multisampling: number;
  starCount: number;
  starSize: number;
  starOpacity: number;
  environment: boolean;
  environmentIntensity: number;
  fleetEnvMapIntensity: number;
  exposure: number;
  bloomThreshold: number;
  bloomSmoothing: number;
  bloomIntensityScale: number;
  bloomRadius: number;
  chromatic: boolean;
  noise: boolean;
  noiseOpacity: number;
  vignetteDarkness: number;
  vignetteOffset: number;
};

const QUALITY_SETTINGS: Record<QualityProfile, QualitySettings> = {
  low: {
    dpr: [1, 1],
    canvasAntialias: false,
    multisampling: 0,
    starCount: 900,
    starSize: 0.07,
    starOpacity: 0.58,
    environment: false,
    environmentIntensity: 0,
    fleetEnvMapIntensity: 0.18,
    exposure: 1.08,
    bloomThreshold: 0.78,
    bloomSmoothing: 0.72,
    bloomIntensityScale: 0.62,
    bloomRadius: 0.42,
    chromatic: false,
    noise: false,
    noiseOpacity: 0,
    vignetteDarkness: 0.58,
    vignetteOffset: 0.32,
  },
  medium: {
    dpr: [1, 1.35],
    canvasAntialias: false,
    multisampling: 0,
    starCount: 1800,
    starSize: 0.085,
    starOpacity: 0.66,
    environment: false,
    environmentIntensity: 0,
    fleetEnvMapIntensity: 0.26,
    exposure: 1.14,
    bloomThreshold: 0.64,
    bloomSmoothing: 0.82,
    bloomIntensityScale: 0.82,
    bloomRadius: 0.58,
    chromatic: true,
    noise: false,
    noiseOpacity: 0,
    vignetteDarkness: 0.62,
    vignetteOffset: 0.3,
  },
  high: {
    dpr: [1, 2],
    canvasAntialias: true,
    multisampling: 0,
    starCount: 2800,
    starSize: 0.09,
    starOpacity: 0.72,
    environment: true,
    environmentIntensity: 0.22,
    fleetEnvMapIntensity: 0.34,
    exposure: 1.22,
    bloomThreshold: 0.55,
    bloomSmoothing: 0.88,
    bloomIntensityScale: 1,
    bloomRadius: 0.7,
    chromatic: true,
    noise: true,
    noiseOpacity: 0.018,
    vignetteDarkness: 0.65,
    vignetteOffset: 0.28,
  },
  ultra: {
    dpr: [1, 2.5],
    canvasAntialias: true,
    multisampling: 4,
    starCount: 5200,
    starSize: 0.095,
    starOpacity: 0.78,
    environment: true,
    environmentIntensity: 0.38,
    fleetEnvMapIntensity: 0.48,
    exposure: 1.28,
    bloomThreshold: 0.48,
    bloomSmoothing: 0.92,
    bloomIntensityScale: 1.18,
    bloomRadius: 0.82,
    chromatic: true,
    noise: true,
    noiseOpacity: 0.022,
    vignetteDarkness: 0.68,
    vignetteOffset: 0.26,
  },
};

export function isQualityProfile(value: string): value is QualityProfile {
  return value === "low" || value === "medium" || value === "high" || value === "ultra";
}

export function getQualitySettings(quality: QualityProfile): QualitySettings {
  return QUALITY_SETTINGS[quality];
}

export function detectDefaultQuality(): QualityProfile {
  if (typeof window === "undefined") return "high";
  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isMobile || reducedMotion) return "low";
  return "high";
}

export function readStoredQuality(): QualityProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(QUALITY_STORAGE_KEY);
    if (stored && isQualityProfile(stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveInitialQuality(): QualityProfile {
  return readStoredQuality() ?? detectDefaultQuality();
}

/** Compatibilidad con escenas que solo distinguen bajo vs resto. */
export function isLegacyHighQuality(quality: QualityProfile): boolean {
  return quality !== "low";
}
