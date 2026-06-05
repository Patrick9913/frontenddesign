import { MOON_RADIUS } from "./moonSceneConstants";

/** Posición por defecto en espacio de escena (independiente de la Death Star). */
export function getDefaultDestroyerPosition(index: number): [number, number, number] {
  const ring = Math.floor(index / 2);
  const lateralSign = index % 2 === 0 ? -1 : 1;
  const standoff = MOON_RADIUS * (0.78 + ring * 0.32);
  const lateral = MOON_RADIUS * (0.42 + (index % 4) * 0.06) * lateralSign;
  const altitude = (index % 3) * 0.08 - 0.08;
  return [lateral, altitude, standoff];
}

export const DEFAULT_DESTROYER_0_POSITION = getDefaultDestroyerPosition(0);
export const DEFAULT_DESTROYER_1_POSITION = getDefaultDestroyerPosition(1);
