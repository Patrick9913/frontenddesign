import * as THREE from "three";

export type MoonSphereSegments = {
  widthSegments: number;
  heightSegments: number;
};

/** Segmentos adaptativos: más densidad cuando hay displacement para cráteres reales. */
export function getMoonSphereSegments(
  quality: "low" | "medium" | "high" | "ultra",
  displacement: number,
): MoonSphereSegments {
  const latBase =
    quality === "ultra" ? 144 : quality === "high" ? 112 : quality === "medium" ? 80 : 56;
  const lonBase = latBase * 2;

  if (displacement <= 0.001) {
    return {
      widthSegments: lonBase,
      heightSegments: latBase,
    };
  }

  const displacementBoost = 1 + THREE.MathUtils.clamp(displacement / 0.06, 0, 1.35);
  return {
    widthSegments: Math.min(512, Math.round(lonBase * displacementBoost)),
    heightSegments: Math.min(256, Math.round(latBase * displacementBoost)),
  };
}

export function createMoonSphereGeometry(
  radius: number,
  widthSegments: number,
  heightSegments: number,
) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  geometry.computeVertexNormals();
  if ("computeTangents" in geometry && typeof geometry.computeTangents === "function") {
    geometry.computeTangents();
  }
  return geometry;
}

const geometryCache = new Map<string, THREE.BufferGeometry>();

export function getCachedMoonSphereGeometry(
  radius: number,
  widthSegments: number,
  heightSegments: number,
) {
  const key = `${radius}-${widthSegments}x${heightSegments}`;
  const cached = geometryCache.get(key);
  if (cached) return cached;

  const geometry = createMoonSphereGeometry(radius, widthSegments, heightSegments);
  geometryCache.set(key, geometry);
  return geometry;
}

export function getMoonSphereDetail(
  quality: "low" | "medium" | "high" | "ultra",
  displacement: number,
) {
  const { heightSegments } = getMoonSphereSegments(quality, displacement);
  return heightSegments;
}
