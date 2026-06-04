import * as THREE from "three";

/** El Sol vive en el centro de la escena; toda la luz sale desde aquí. */
export const SUN_POSITION: [number, number, number] = [0, 0, 0];

export const sunWorld = new THREE.Vector3(...SUN_POSITION);

/** Intensidad de la única luz direccional de escena (sin sombras). */
export const SUN_LIGHT_INTENSITY = 7.5;
export const SUN_LIGHT_COLOR = "#ffffff";

/**
 * Dirección hacia el Sol (hacia la luz) en espacio mundo.
 * Independiente de la cámara — el terminador no gira al orbitar.
 */
const planetScratch = new THREE.Vector3();

export function getPlanetLightDirection(
  planetCenter: THREE.Vector3 | [number, number, number],
  target = new THREE.Vector3()
) {
  const planet =
    planetCenter instanceof THREE.Vector3
      ? planetCenter
      : planetScratch.set(planetCenter[0], planetCenter[1], planetCenter[2]);

  return target.copy(sunWorld).sub(planet).normalize();
}
