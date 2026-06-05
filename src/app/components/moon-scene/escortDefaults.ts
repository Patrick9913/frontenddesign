import * as THREE from "three";
import { MOON_RADIUS } from "./moonSceneConstants";

/** Centro del disco del superláser en espacio local (modelo centrado y escalado). */
export const SUPERLASER_DISH_LOCAL = new THREE.Vector3(0.0027, -1.3138, 0.5222);

export const DEFAULT_ESCORT_STANDOFF = MOON_RADIUS * 0.26;
export const DEFAULT_ESCORT_LATERAL = MOON_RADIUS * 0.17;

const basisScratch = {
  forward: new THREE.Vector3(),
  right: new THREE.Vector3(),
};

function getSuperlaserBasis() {
  const { forward, right } = basisScratch;
  forward.copy(SUPERLASER_DISH_LOCAL).normalize();

  right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
  if (right.lengthSq() < 1e-6) {
    right.crossVectors(forward, new THREE.Vector3(0, 0, 1));
  }
  right.normalize();

  return basisScratch;
}

export function getDefaultEscortPosition(
  lateralSign: -1 | 1,
  target = new THREE.Vector3()
): [number, number, number] {
  const { forward, right } = getSuperlaserBasis();
  target
    .copy(forward)
    .multiplyScalar(SUPERLASER_DISH_LOCAL.length() + DEFAULT_ESCORT_STANDOFF)
    .addScaledVector(right, DEFAULT_ESCORT_LATERAL * lateralSign);

  return [target.x, target.y, target.z];
}

export const DEFAULT_DESTROYER_0_POSITION = getDefaultEscortPosition(-1);
export const DEFAULT_DESTROYER_1_POSITION = getDefaultEscortPosition(1);
