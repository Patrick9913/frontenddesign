import * as THREE from "three";
import { offsetToSpherical, sphericalToOffset } from "./useMoonOrbitControl";

export const SUN_POSITION: [number, number, number] = [8.5, 0.45, 3.2];
export const MOON_CENTER = new THREE.Vector3(-0.5, 0, 0);
export const MOON_RADIUS = 1.55;
export const MOON_POSITION: [number, number, number] = [-0.5, 0, 0];

const sunWorld = new THREE.Vector3(...SUN_POSITION);
const worldUp = new THREE.Vector3(0, 1, 0);

/**
 * Distancia cámara ↔ centro lunar en la vista final (eje Luna→Sol invertido).
 * Más alto = luna más pequeña y más margen para ver el sol en el borde.
 */
export const DARK_SIDE_CAMERA_DISTANCE = 5.75;

/** Desplazamiento lateral en planta (perpendicular al eje Luna–Sol). 0 = alineación perfecta. */
export const DARK_SIDE_PLAN_OFFSET = 0.28;

/** FOV fijo al final — no bajar para evitar zoom que oculte el sol. */
export const DARK_SIDE_FOV = 40;

/**
 * Recorte del arco orbital (inicio del tramo visible).
 * Calibrado con scroll debug — ver ORBIT_PATH_END.
 */
export const ORBIT_PATH_TRIM = 0.58;

/** Fin del arco (encuadre deseado). phase2≈0.573 → pathT≈0.821 en el debug. */
export const ORBIT_PATH_END = 0.8207;

export function getMoonSunDirection(target = new THREE.Vector3()) {
  return target.copy(sunWorld).sub(MOON_CENTER).normalize();
}

export type DarkSideView = {
  camera: THREE.Vector3;
  /** Mira a través de la luna hacia el sol (flecha roja en planta). */
  lookAt: THREE.Vector3;
  fov: number;
};

/**
 * Vista final desde planta:
 *   Cámara ──→ Luna ──→ Sol   (misma línea; solo se mueve la cámara).
 */
export function computeDarkSideView(out?: DarkSideView): DarkSideView {
  const sunDir = getMoonSunDirection(new THREE.Vector3());
  const tangent = new THREE.Vector3().crossVectors(sunDir, worldUp).normalize();
  const view = out ?? {
    camera: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
    fov: DARK_SIDE_FOV,
  };

  view.camera
    .copy(MOON_CENTER)
    .addScaledVector(sunDir, -DARK_SIDE_CAMERA_DISTANCE)
    .addScaledVector(tangent, DARK_SIDE_PLAN_OFFSET);

  view.lookAt.copy(sunWorld);
  view.fov = DARK_SIDE_FOV;
  return view;
}

const darkSideView = computeDarkSideView();

export const DARK_SIDE_CAMERA = darkSideView.camera;
export const DARK_SIDE_LOOK_AT = darkSideView.lookAt;

function lerpAngle(from: number, to: number, t: number) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * t;
}

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

/** Parámetro 0–1 sobre el arco esférico recortado (TRIM → END). */
export function getArcPathT(arcProgress: number) {
  const t = clamp01(arcProgress);
  return ORBIT_PATH_TRIM + (ORBIT_PATH_END - ORBIT_PATH_TRIM) * t;
}

/** Mezcla del lookAt proporcional al punto del arco (0 = fase 1, 1 = sol). */
export function getArcLookBlend(arcProgress: number) {
  const pathT = getArcPathT(arcProgress);
  return (pathT - ORBIT_PATH_TRIM) / (1 - ORBIT_PATH_TRIM);
}

/**
 * Recorrido orbital recortado: TRIM → END (no llega al extremo geométrico completo).
 */
export function getArcCameraPosition(
  startOffset: THREE.Vector3,
  endOffset: THREE.Vector3,
  t: number,
  target = new THREE.Vector3()
) {
  const pathT = getArcPathT(t);
  const start = offsetToSpherical(startOffset);
  const end = offsetToSpherical(endOffset);
  const azimuth = lerpAngle(start.azimuth, end.azimuth, pathT);
  const elevation = THREE.MathUtils.lerp(start.elevation, end.elevation, pathT);
  const radius = THREE.MathUtils.lerp(start.radius, end.radius, pathT);
  return target.copy(sphericalToOffset(radius, azimuth, elevation)).add(MOON_CENTER);
}

/** Punto de inicio del arco recortado (donde empieza la fase 2 en planta). */
export function getTrimmedArcStartPosition(
  startOffset: THREE.Vector3,
  endOffset: THREE.Vector3,
  target = new THREE.Vector3()
) {
  return getArcCameraPosition(startOffset, endOffset, 0, target);
}

/** Offset lunar al terminar la fase 1 (antes de la órbita). */
export function getPhase1EndCameraOffset(
  cameraX: number,
  cameraZFar: number,
  target = new THREE.Vector3()
) {
  return target.set(cameraX, 0, cameraZFar).sub(MOON_CENTER);
}

export function getDarkSideCameraOffset(target = new THREE.Vector3()) {
  return target.copy(DARK_SIDE_CAMERA).sub(MOON_CENTER);
}

export function getDarkSideViewPreset() {
  return darkSideView;
}
