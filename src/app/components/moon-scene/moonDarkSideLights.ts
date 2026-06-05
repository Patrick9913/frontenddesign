export type MysteryLightSpec = {
  /** Dirección unitaria en espacio local del grupo lunar (hemisferio oscuro → X negativo). */
  direction: [number, number, number];
  color: string;
  size: number;
  pulse: number;
  delay: number;
  /** Opacidad base (1 = plena). */
  visibility?: number;
};

const SURFACE_EPSILON = 0.004;

export function mysteryLightSurfacePosition(
  direction: [number, number, number],
  moonRadius: number
): [number, number, number] {
  const [x, y, z] = direction;
  const length = Math.hypot(x, y, z) || 1;
  const r = moonRadius + SURFACE_EPSILON;
  return [(x / length) * r, (y / length) * r, (z / length) * r];
}

/** Luces en el hemisferio oscuro, distribuidas sobre la superficie esférica. */
export const MYSTERY_LIGHTS: MysteryLightSpec[] = [
  { direction: [-0.94, -0.22, 0.26], color: "#ffd0a0", size: 0.014, pulse: 1.1, delay: 0.2 },
  { direction: [-0.91, -0.36, 0.2], color: "#ffb070", size: 0.012, pulse: 0.85, delay: 1.4 },
  { direction: [-0.93, -0.31, -0.18], color: "#ffc888", size: 0.011, pulse: 1.35, delay: 0.8 },
  { direction: [-0.89, -0.28, -0.36], color: "#ffe0b8", size: 0.012, pulse: 0.95, delay: 2.1 },
  { direction: [-0.96, -0.14, -0.22], color: "#ffbc78", size: 0.01, pulse: 1.5, delay: 1.7 },
  { direction: [-0.87, -0.4, 0.28], color: "#ffa860", size: 0.009, pulse: 1.2, delay: 3.2 },
  { direction: [-0.92, -0.48, 0.06], color: "#ffd8aa", size: 0.011, pulse: 0.7, delay: 0.5 },
  { direction: [-0.88, -0.44, -0.16], color: "#ffcc90", size: 0.01, pulse: 1.05, delay: 2.8 },
  { direction: [-0.95, -0.52, -0.04], color: "#ffb878", size: 0.009, pulse: 1.25, delay: 1.2 },
  { direction: [-0.9, -0.46, 0.22], color: "#ffe8c8", size: 0.009, pulse: 0.8, delay: 3.6 },
  { direction: [-0.86, -0.33, 0.4], color: "#ffae68", size: 0.008, pulse: 1.4, delay: 2.4 },
  { direction: [-0.94, -0.38, -0.32], color: "#ffc080", size: 0.008, pulse: 1.15, delay: 4.1 },
  { direction: [-0.85, -0.42, 0.12], color: "#ffd4a4", size: 0.008, pulse: 0.9, delay: 0.9 },
  { direction: [-0.91, -0.55, 0.1], color: "#ff9858", size: 0.007, pulse: 1.3, delay: 3.9 },
  { direction: [-0.89, -0.5, -0.24], color: "#ffbe80", size: 0.007, pulse: 1.0, delay: 1.6 },
  { direction: [-0.93, -0.26, 0.28], color: "#ffe4b0", size: 0.007, pulse: 1.45, delay: 2.6 },
  { direction: [-0.9, -0.58, 0.14], color: "#ffaa62", size: 0.008, pulse: 1.05, delay: 4.4 },
  { direction: [-0.84, -0.47, -0.28], color: "#ffc890", size: 0.009, pulse: 0.88, delay: 1.9 },
  { direction: [-0.97, -0.34, 0.08], color: "#ffd8a8", size: 0.007, pulse: 1.22, delay: 3.1 },
  { direction: [-0.88, -0.24, -0.42], color: "#ffb068", size: 0.008, pulse: 1.38, delay: 0.4 },
  { direction: [-0.91, -0.62, -0.12], color: "#ffe8c0", size: 0.007, pulse: 0.92, delay: 2.2 },
];

/** Luces de actividad en hangares, trinchera, ventanas y zona del superláser. */
export const ACTIVITY_LIGHTS: MysteryLightSpec[] = [
  // Anillo ecuatorial / trinchera
  { direction: [0.18, -0.08, 0.96], color: "#ffd090", size: 0.009, pulse: 1.15, delay: 0.3 },
  { direction: [-0.22, 0.06, 0.95], color: "#ffc078", size: 0.008, pulse: 0.95, delay: 1.8 },
  { direction: [-0.58, -0.14, 0.8], color: "#ffe0a8", size: 0.01, pulse: 1.25, delay: 2.5 },
  { direction: [0.42, 0.12, 0.89], color: "#ffb860", size: 0.008, pulse: 1.05, delay: 3.4 },
  { direction: [-0.72, 0.18, 0.66], color: "#ffd4a0", size: 0.009, pulse: 0.82, delay: 4.2 },
  { direction: [0.65, -0.2, 0.72], color: "#ffbc70", size: 0.007, pulse: 1.32, delay: 1.1 },
  // Polo norte / sur — torretas y antenas
  { direction: [0.12, 0.92, 0.36], color: "#a8d4ff", size: 0.007, pulse: 1.4, delay: 0.7 },
  { direction: [-0.28, 0.88, 0.38], color: "#88c8ff", size: 0.006, pulse: 1.1, delay: 2.9 },
  { direction: [0.08, -0.9, 0.42], color: "#ffb878", size: 0.008, pulse: 0.9, delay: 3.7 },
  { direction: [-0.18, -0.87, -0.44], color: "#ffc888", size: 0.007, pulse: 1.18, delay: 1.5 },
  // Zona superláser — actividad verde tenue
  { direction: [0.04, -0.91, 0.4], color: "#5dff9a", size: 0.011, pulse: 1.55, delay: 0.6, visibility: 0.85 },
  { direction: [-0.14, -0.88, 0.36], color: "#48ee88", size: 0.009, pulse: 1.2, delay: 2.1, visibility: 0.75 },
  { direction: [0.16, -0.86, 0.32], color: "#7affb8", size: 0.008, pulse: 0.78, delay: 3.3, visibility: 0.7 },
  { direction: [-0.08, -0.94, 0.28], color: "#3ae878", size: 0.007, pulse: 1.35, delay: 4.5, visibility: 0.65 },
  // Hemisferio iluminado — ventanas y hangares (más tenues)
  { direction: [0.84, 0.18, 0.5], color: "#fff0d8", size: 0.006, pulse: 1.05, delay: 0.9, visibility: 0.42 },
  { direction: [0.78, -0.24, 0.58], color: "#ffe8c8", size: 0.005, pulse: 1.28, delay: 2.4, visibility: 0.38 },
  { direction: [0.71, 0.32, 0.62], color: "#c8e8ff", size: 0.005, pulse: 0.88, delay: 3.8, visibility: 0.35 },
  { direction: [0.88, -0.08, 0.46], color: "#ffd8a8", size: 0.006, pulse: 1.15, delay: 1.3, visibility: 0.4 },
  { direction: [0.62, -0.38, 0.68], color: "#ffcc88", size: 0.005, pulse: 1.42, delay: 4.8, visibility: 0.36 },
  // Cuadrantes laterales — tráfico de patrullas
  { direction: [-0.35, 0.62, 0.7], color: "#ffb060", size: 0.008, pulse: 1.08, delay: 2.0 },
  { direction: [0.28, 0.58, -0.76], color: "#ffc880", size: 0.007, pulse: 1.22, delay: 3.5 },
  { direction: [-0.48, -0.52, -0.7], color: "#ffd098", size: 0.008, pulse: 0.95, delay: 1.7 },
  { direction: [0.52, -0.48, -0.68], color: "#ffaa58", size: 0.007, pulse: 1.3, delay: 4.0 },
  // Alertas / señales rojas esporádicas
  { direction: [-0.66, 0.08, 0.74], color: "#ff5544", size: 0.005, pulse: 2.1, delay: 0.2, visibility: 0.55 },
  { direction: [0.38, 0.44, -0.8], color: "#ff4433", size: 0.004, pulse: 1.85, delay: 2.7, visibility: 0.5 },
  { direction: [-0.82, -0.42, 0.38], color: "#ff6655", size: 0.005, pulse: 2.4, delay: 4.3, visibility: 0.48 },
];

export const STATION_ACTIVITY_LIGHTS: MysteryLightSpec[] = [...MYSTERY_LIGHTS, ...ACTIVITY_LIGHTS];
