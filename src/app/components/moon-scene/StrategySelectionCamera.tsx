"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MOON_POSITION } from "./moonSceneConstants";
import { getDestroyerRuntime, useFleetCommand } from "./fleetCommandContext";
import type { DestroyerId } from "./SceneTuningContext";
import { useSceneTuning } from "./SceneTuningContext";

const FOCUS_FOV_REDUCTION = 6;
const FOCUS_PULL = 0.12;
const FOCUS_STOP_DISTANCE = 0.06;

const worldScratch = {
  unitLocal: new THREE.Vector3(),
  unitWorld: new THREE.Vector3(),
  pullTarget: new THREE.Vector3(),
};

export function StrategySelectionCamera({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const { selectedId, runtime } = useFleetCommand();
  const { cameraFov } = useSceneTuning();
  const focusPositionRef = useRef<THREE.Vector3 | null>(null);
  const trackedSelectionRef = useRef<DestroyerId | null>(null);

  useFrame((_, delta) => {
    if (!enabled) return;

    const cam = camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.exp(-4.2 * delta);
    const { unitLocal, unitWorld, pullTarget } = worldScratch;

    if (selectedId !== trackedSelectionRef.current) {
      trackedSelectionRef.current = selectedId;

      if (selectedId === null) {
        focusPositionRef.current = null;
      } else {
        const unitRuntime = getDestroyerRuntime(runtime, selectedId);
        unitLocal.set(
          unitRuntime.position[0],
          unitRuntime.position[1],
          unitRuntime.position[2]
        );
        unitWorld.copy(unitLocal);
        unitWorld.x += MOON_POSITION[0];
        unitWorld.y += MOON_POSITION[1];
        unitWorld.z += MOON_POSITION[2];
        focusPositionRef.current = cam.position.clone().lerp(unitWorld, FOCUS_PULL);
      }
    }

    if (selectedId === null) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, cameraFov, damp);
      cam.updateProjectionMatrix();
      return;
    }

    const focusPosition = focusPositionRef.current;
    if (focusPosition) {
      const distance = cam.position.distanceTo(focusPosition);
      if (distance > FOCUS_STOP_DISTANCE) {
        cam.position.lerp(focusPosition, damp);
      } else {
        cam.position.copy(focusPosition);
      }
    }

    const targetFov = cameraFov - FOCUS_FOV_REDUCTION;
    if (Math.abs(cam.fov - targetFov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, damp);
    } else {
      cam.fov = targetFov;
    }
    cam.updateProjectionMatrix();
  });

  return null;
}
