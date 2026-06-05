"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MOON_RADIUS } from "./moonSceneConstants";
import {
  mysteryLightSurfacePosition,
  STATION_ACTIVITY_LIGHTS,
  type MysteryLightSpec,
} from "./moonDarkSideLights";

function ActivityLightPoint({
  direction,
  color,
  size,
  pulse,
  delay,
  visibility = 1,
  reducedMotion,
}: MysteryLightSpec & { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => mysteryLightSurfacePosition(direction, MOON_RADIUS), [direction]);
  const quaternion = useMemo(() => {
    const normal = new THREE.Vector3(...direction).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [direction]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const flicker = reducedMotion
      ? 1
      : 0.55 +
        Math.sin(clock.elapsedTime * pulse + delay) * 0.22 +
        Math.sin(clock.elapsedTime * pulse * 2.4 + delay * 1.7) * 0.12;
    meshRef.current.scale.setScalar(size * flicker);
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = visibility * flicker;
  });

  if (visibility <= 0.001) return null;

  return (
    <mesh ref={meshRef} position={position} quaternion={quaternion} renderOrder={2}>
      <circleGeometry args={[1, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={visibility}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function StationActivityLights({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      {STATION_ACTIVITY_LIGHTS.map((light) => (
        <ActivityLightPoint
          key={`${light.direction.join("-")}-${light.delay}-${light.color}`}
          {...light}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}
