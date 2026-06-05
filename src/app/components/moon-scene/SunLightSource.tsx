"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { IncandescentSun } from "./IncandescentSun";
import { MOON_CENTER } from "./moonSceneConstants";
import { useSceneTuning } from "./SceneTuningContext";
import { SUN_LIGHT_COLOR, SUN_LIGHT_INTENSITY } from "./sunLighting";
import { useSunLightContext } from "./SunLightContext";

/**
 * Sol visual en sunOffset; target de la direccional en MOON_CENTER (mundo)
 * para que la dirección de luz cambie al mover el sol.
 */
export function SunLightSource({ reducedMotion }: { reducedMotion: boolean }) {
  const { lightRef } = useSunLightContext();
  const { sunOffset } = useSceneTuning();
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
    <>
      <object3D ref={targetRef} position={[MOON_CENTER.x, MOON_CENTER.y, MOON_CENTER.z]} />
      <group position={sunOffset}>
        <directionalLight
          ref={lightRef}
          position={[0, 0, 0]}
          intensity={SUN_LIGHT_INTENSITY}
          color={SUN_LIGHT_COLOR}
          castShadow={false}
        />
        <IncandescentSun reducedMotion={reducedMotion} />
      </group>
    </>
  );
}
