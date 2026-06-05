"use client";

import { useMemo } from "react";
import * as THREE from "three";

type HyperspaceStreaksProps = {
  progress: number;
  direction: THREE.Vector3;
  length?: number;
};

const streakScratch = new THREE.Vector3();

export function HyperspaceStreaks({
  progress,
  direction,
  length = 18,
}: HyperspaceStreaksProps) {
  const streaks = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => ({
      offset: (index / 14 - 0.5) * 0.55,
      depth: 0.4 + (index % 5) * 0.12,
      width: 0.012 + (index % 3) * 0.004,
    }));
  }, []);

  if (progress <= 0.02 || progress >= 0.96) return null;

  const intensity =
    progress < 0.55
      ? THREE.MathUtils.smoothstep(progress, 0.02, 0.55)
      : 1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.96);

  return (
    <group>
      {streaks.map((streak, index) => {
        streakScratch.copy(direction).multiplyScalar(-length * streak.depth * (1 - progress * 0.35));
        const lateral = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
        streakScratch.addScaledVector(lateral, streak.offset);

        return (
          <mesh key={index} position={streakScratch} quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            direction.clone().normalize()
          )}>
            <boxGeometry args={[streak.width, streak.width, length * (0.55 + progress * 0.8)]} />
            <meshBasicMaterial
              color="#9fd4ff"
              transparent
              opacity={intensity * (0.22 + streak.depth * 0.18)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
