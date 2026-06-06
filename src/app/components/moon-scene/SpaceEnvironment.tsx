"use client";

import { Environment } from "@react-three/drei";

type SpaceEnvironmentProps = {
  enabled?: boolean;
  intensity?: number;
};

export function SpaceEnvironment({ enabled = false, intensity = 0.25 }: SpaceEnvironmentProps) {
  if (!enabled) return null;

  return (
    <Environment
      preset="night"
      background={false}
      environmentIntensity={intensity}
    />
  );
}
