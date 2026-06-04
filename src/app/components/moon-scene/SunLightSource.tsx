"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { IncandescentSun } from "./IncandescentSun";
import { MOON_CENTER } from "./moonSceneConstants";
import { SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY, SUN_POSITION } from "./sunLighting";
import { useSunLightContext } from "./SunLightContext";

/**
 * Sol unificado: luz direccional Three.js + disco incandescente en el mismo origen.
 * Sin sombras para no penalizar GPU (terminador duro en shader de planetas).
 */
export function SunLightSource({ reducedMotion }: { reducedMotion: boolean }) {
  const { lightRef } = useSunLightContext();
  const targetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    const light = lightRef.current;
    const target = targetRef.current;
    if (!light || !target) return;
    light.target = target;
    target.position.copy(MOON_CENTER);
    target.updateMatrixWorld();
  }, [lightRef]);

  return (
    <group position={SUN_POSITION}>
      <directionalLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={SUN_LIGHT_INTENSITY}
        color={SUN_LIGHT_COLOR}
        castShadow={false}
      />
      <object3D ref={targetRef} />
      <IncandescentSun reducedMotion={reducedMotion} />
    </group>
  );
}
