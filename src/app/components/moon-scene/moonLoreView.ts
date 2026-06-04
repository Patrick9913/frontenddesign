import * as THREE from "three";
import { MOON_CENTER, MOON_RADIUS, getMoonSunDirection } from "./moonCameraPath";

/** Encuadre al activar el dossier: hemisferio oscuro y luces anómalas. */
export function computeMoonLoreView(out?: {
  camera: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}) {
  const sunDir = getMoonSunDirection(new THREE.Vector3());
  const view = out ?? {
    camera: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
    fov: 34,
  };

  view.camera
    .copy(MOON_CENTER)
    .addScaledVector(sunDir, -3.75)
    .add(new THREE.Vector3(0, 0.38, 0.22));

  view.lookAt
    .copy(MOON_CENTER)
    .addScaledVector(sunDir, -MOON_RADIUS * 1.08);

  view.fov = 34;
  return view;
}

const moonLoreView = computeMoonLoreView();

export const MOON_LORE_CAMERA = moonLoreView.camera;
export const MOON_LORE_LOOK_AT = moonLoreView.lookAt;
export const MOON_LORE_FOV = moonLoreView.fov;
