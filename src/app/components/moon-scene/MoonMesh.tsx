"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useQualitySettings } from "../hero-scene/useQualityProfile";
import { MOON_CENTER, MOON_RADIUS } from "./moonSceneConstants";
import { getMoonNormalScale, loadMoonPbrTextures } from "./moonPbrTextures";
import { getCachedMoonSphereGeometry, getMoonSphereSegments } from "./moonSphereGeometry";
import { applyHardTerminator } from "./planetTerminator";
import { useSceneTuning } from "./SceneTuningContext";
import { getPlanetLightDirection } from "./sunLighting";
import { StationActivityLights } from "./StationActivityLights";
import { useSunLightContext } from "./SunLightContext";

type MoonMeshProps = {
  reducedMotion: boolean;
};

type MoonPbrMaps = Awaited<ReturnType<typeof loadMoonPbrTextures>>;

export function MoonMesh({ reducedMotion }: MoonMeshProps) {
  const { gl } = useThree();
  const { quality, settings } = useQualitySettings();
  const { moonDisplacement, moonNormalIntensity } = useSceneTuning();
  const { registerMaterial } = useSunLightContext();
  const meshRef = useRef<THREE.Mesh>(null);
  const lightDirection = useRef(new THREE.Vector3());
  const mapsRef = useRef<MoonPbrMaps | null>(null);
  const [maps, setMaps] = useState<MoonPbrMaps | null>(null);

  const segments = getMoonSphereSegments(quality, moonDisplacement);
  const normalScale = getMoonNormalScale(quality) * moonNormalIntensity;
  const anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
  const geometryKey = `${segments.widthSegments}x${segments.heightSegments}`;

  const geometry = useMemo(
    () =>
      getCachedMoonSphereGeometry(
        MOON_RADIUS,
        segments.widthSegments,
        segments.heightSegments,
      ),
    [segments.widthSegments, segments.heightSegments],
  );

  useEffect(() => {
    let cancelled = false;

    loadMoonPbrTextures(anisotropy)
      .then((loaded) => {
        if (cancelled) {
          loaded.colorMap.dispose();
          loaded.normalMap.dispose();
          loaded.roughnessMap.dispose();
          loaded.displacementMap.dispose();
          return;
        }
        mapsRef.current?.colorMap.dispose();
        mapsRef.current?.normalMap.dispose();
        mapsRef.current?.roughnessMap.dispose();
        mapsRef.current?.displacementMap.dispose();
        mapsRef.current = loaded;
        setMaps(loaded);
      })
      .catch(() => {
        if (!cancelled) setMaps(null);
      });

    return () => {
      cancelled = true;
      mapsRef.current?.colorMap.dispose();
      mapsRef.current?.normalMap.dispose();
      mapsRef.current?.roughnessMap.dispose();
      mapsRef.current?.displacementMap.dispose();
      mapsRef.current = null;
    };
  }, [anisotropy]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !maps) return;
    const material = mesh.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) return;

    material.map = maps.colorMap;
    material.normalMap = moonNormalIntensity > 0.01 ? maps.normalMap : null;
    material.roughnessMap = maps.roughnessMap;
    material.displacementMap = moonDisplacement > 0.001 ? maps.displacementMap : null;
    material.displacementScale = moonDisplacement;
    material.displacementBias = 0;
    material.normalScale.set(normalScale, normalScale);
    material.flatShading = false;
    material.metalness = 0;
    material.roughness = 1;
    material.envMapIntensity = settings.fleetEnvMapIntensity * 0.18;
    getPlanetLightDirection(MOON_CENTER, lightDirection.current);
    applyHardTerminator(material, "moon-mesh-pbr-v4", lightDirection.current, "uMoonLightDir");
    material.needsUpdate = true;

    return registerMaterial({
      material,
      planetCenter: MOON_CENTER,
      uniformName: "uMoonLightDir",
    });
  }, [
    maps,
    moonDisplacement,
    moonNormalIntensity,
    normalScale,
    registerMaterial,
    settings.fleetEnvMapIntensity,
  ]);

  if (!maps) {
    return (
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#4a4a50" roughness={0.94} metalness={0} flatShading={false} />
      </mesh>
    );
  }

  return (
    <group>
      <mesh ref={meshRef} key={geometryKey} geometry={geometry}>
        <meshStandardMaterial
          map={maps.colorMap}
          normalMap={moonNormalIntensity > 0.01 ? maps.normalMap : undefined}
          roughnessMap={maps.roughnessMap}
          displacementMap={moonDisplacement > 0.001 ? maps.displacementMap : undefined}
          displacementScale={moonDisplacement}
          displacementBias={0}
          normalScale={new THREE.Vector2(normalScale, normalScale)}
          flatShading={false}
          metalness={0}
          roughness={1}
        />
      </mesh>
      <StationActivityLights reducedMotion={reducedMotion} />
    </group>
  );
}
