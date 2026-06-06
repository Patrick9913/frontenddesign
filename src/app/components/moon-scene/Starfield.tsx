"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type StarfieldProps = {
  count?: number;
  radius?: number;
  starSize?: number;
  opacity?: number;
  reducedMotion?: boolean;
};

export function Starfield({
  count = 2400,
  radius = 140,
  starSize = 0.09,
  opacity = 0.72,
  reducedMotion = false,
}: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.35 + Math.random() * 0.65);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.35 + Math.random() * 1.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.004;
    pointsRef.current.rotation.x += delta * 0.0012;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        color="#d8e2f0"
        size={starSize}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
