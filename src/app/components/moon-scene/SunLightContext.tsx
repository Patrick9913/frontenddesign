"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MARS_CENTER } from "./marsCameraPath";
import { MOON_CENTER } from "./moonSceneConstants";
import { useSceneTuning } from "./SceneTuningContext";
import { getPlanetLightDirection, SUN_LIGHT_INTENSITY, updateSunWorldPosition } from "./sunLighting";

export type SunLightMaterialEntry = {
  material: THREE.MeshStandardMaterial;
  planetCenter: THREE.Vector3;
  uniformName: string;
};

type SunLightContextValue = {
  registerMaterial: (entry: SunLightMaterialEntry) => () => void;
  lightRef: RefObject<THREE.DirectionalLight | null>;
};

const SunLightContext = createContext<SunLightContextValue | null>(null);

const lightTargetScratch = new THREE.Vector3();
const lightDirScratch = new THREE.Vector3();

/**
 * Una sola pasada por frame: target de la direccional + uniformes del terminador.
 * Sin shadow maps (el terminador en shader es más barato y mantiene el look).
 */
export function SunLightProvider({
  children,
  marsTravelProgress = 0,
}: {
  children: ReactNode;
  marsTravelProgress?: number;
}) {
  const { sunOffset } = useSceneTuning();
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const entriesRef = useRef<SunLightMaterialEntry[]>([]);

  const value = useMemo<SunLightContextValue>(
    () => ({
      lightRef,
      registerMaterial(entry) {
        entriesRef.current.push(entry);
        return () => {
          const list = entriesRef.current;
          const index = list.indexOf(entry);
          if (index >= 0) list.splice(index, 1);
        };
      },
    }),
    []
  );

  useFrame(() => {
    updateSunWorldPosition(sunOffset[0], sunOffset[1], sunOffset[2]);

    const light = lightRef.current;
    if (light) {
      light.position.set(sunOffset[0], sunOffset[1], sunOffset[2]);

      const marsBlend = THREE.MathUtils.clamp(marsTravelProgress * 1.15, 0, 1);
      lightTargetScratch.copy(MOON_CENTER).lerp(MARS_CENTER, marsBlend);
      light.target.position.copy(lightTargetScratch);
      light.target.updateMatrixWorld();
    }

    const entries = entriesRef.current;
    for (let i = 0; i < entries.length; i += 1) {
      const { material, planetCenter, uniformName } = entries[i];
      getPlanetLightDirection(planetCenter, lightDirScratch);
      const shader = material.userData.shader as
        | { uniforms: Record<string, { value: THREE.Vector3 }> }
        | undefined;
      if (shader?.uniforms[uniformName]) {
        shader.uniforms[uniformName].value.copy(lightDirScratch);
      }
    }
  });

  return <SunLightContext.Provider value={value}>{children}</SunLightContext.Provider>;
}

export function useSunLightContext() {
  const ctx = useContext(SunLightContext);
  if (!ctx) {
    throw new Error("useSunLightContext debe usarse dentro de SunLightProvider");
  }
  return ctx;
}

/** Intensidad y color compartidos por la luz real y materiales estándar (p. ej. asteroide). */
export { SUN_LIGHT_INTENSITY };
export { sunWorld } from "./sunLighting";
