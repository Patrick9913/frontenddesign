import * as THREE from "three";
import { MOON_SUN_DISTANCE } from "./moonCameraPath";
import { SUN_POSITION, getPlanetLightDirection, sunWorld } from "./sunLighting";
import { easeInOutCubic } from "./useHeroScroll";

export { SUN_POSITION };

/** Marte ~9× más lejos que la Luna respecto al Sol. */
export const MARS_SUN_DISTANCE = MOON_SUN_DISTANCE * 9.2;
const MARS_AXIS_UNIT = new THREE.Vector3(83.5, 8.05, -21.2).normalize();
export const MARS_CENTER = MARS_AXIS_UNIT.clone().multiplyScalar(MARS_SUN_DISTANCE);
export const MARS_RADIUS = 1.98;
export const MARS_POSITION: [number, number, number] = [
  MARS_CENTER.x,
  MARS_CENTER.y,
  MARS_CENTER.z,
];

/** Distancia cámara ↔ centro marciano en la vista final. */
export const MARS_VIEW_CAMERA_DISTANCE = 6.35;

export const MARS_VIEW_FOV = 39;

const worldUp = new THREE.Vector3(0, 1, 0);

export function getMarsSunDirection(target = new THREE.Vector3()) {
  return getPlanetLightDirection(MARS_CENTER, target);
}

export type MarsView = {
  camera: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
};

export function computeMarsView(out?: MarsView): MarsView {
  const sunDir = getMarsSunDirection(new THREE.Vector3());
  const tangent = new THREE.Vector3().crossVectors(sunDir, worldUp).normalize();
  const view = out ?? {
    camera: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
    fov: MARS_VIEW_FOV,
  };

  view.camera
    .copy(MARS_CENTER)
    .addScaledVector(sunDir, -MARS_VIEW_CAMERA_DISTANCE)
    .addScaledVector(tangent, 0.22)
    .addScaledVector(worldUp, 0.35);

  view.lookAt.copy(MARS_CENTER);
  view.fov = MARS_VIEW_FOV;
  return view;
}

const marsView = computeMarsView();

export const MARS_VIEW_CAMERA = marsView.camera;
export const MARS_VIEW_LOOK_AT = marsView.lookAt;

const travelStart = new THREE.Vector3();
const travelEnd = new THREE.Vector3();
const travelMid = new THREE.Vector3();
const travelLook = new THREE.Vector3();

/**
 * Trayectoria en arco desde la vista del lado oscuro lunar hasta el encuadre en Marte.
 */
export function getMarsTravelCamera(
  darkSideCamera: THREE.Vector3,
  progress: number,
  target = new THREE.Vector3()
) {
  const t = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  travelStart.copy(darkSideCamera);
  travelEnd.copy(MARS_VIEW_CAMERA);
  travelMid.copy(travelStart).lerp(travelEnd, 0.5).add(new THREE.Vector3(-6, 22, 10));

  const inv = 1 - t;
  return target
    .copy(travelStart)
    .multiplyScalar(inv * inv)
    .add(travelMid.clone().multiplyScalar(2 * inv * t))
    .add(travelEnd.clone().multiplyScalar(t * t));
}

export function getMarsTravelLookAt(
  darkSideLookAt: THREE.Vector3,
  progress: number,
  target = new THREE.Vector3()
) {
  const t = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  const lookBlend = THREE.MathUtils.smoothstep(t, 0.22, 1);
  travelLook.copy(darkSideLookAt).lerp(MARS_VIEW_LOOK_AT, lookBlend);
  return target.copy(travelLook);
}

export function getMarsTravelFov(progress: number) {
  const t = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  return THREE.MathUtils.lerp(40, MARS_VIEW_FOV, t);
}
