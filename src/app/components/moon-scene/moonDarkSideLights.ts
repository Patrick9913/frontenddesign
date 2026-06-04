export type MysteryLightSpec = {
  /** Dirección unitaria en espacio local del grupo lunar (hemisferio oscuro → X negativo). */
  direction: [number, number, number];
  color: string;
  size: number;
  pulse: number;
  delay: number;
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
];
