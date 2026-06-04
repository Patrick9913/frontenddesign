"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const SUN_DISC_SIZE = 3.1;

const FLARE_SPECS = [
  { x: 0, y: -0.42, size: 0.055, color: "#fff8f0", opacity: 0.07 },
  { x: 0.02, y: -0.72, size: 0.038, color: "#fffaf5", opacity: 0.045 },
  { x: 0.01, y: -1.02, size: 0.028, color: "#ffffff", opacity: 0.03 },
] as const;

const sunVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunFragmentShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 p = vUv - 0.5;
  float dist = length(p);
  float angle = atan(p.y, p.x);

  float rayA = pow(max(0.0, cos(angle * 22.0 + uTime * 0.1)), 18.0);
  float rayB = pow(max(0.0, cos(angle * 11.0 - uTime * 0.07)), 12.0) * 0.45;
  float rayC = pow(max(0.0, sin(angle * 44.0 + uTime * 0.14)), 24.0) * 0.22;

  float rayMask = smoothstep(0.34, 0.02, dist);
  float rays = (rayA + rayB + rayC) * rayMask;

  float core = exp(-dist * dist * 160.0);
  float innerGlow = exp(-dist * dist * 32.0) * 0.75;
  float outerGlow = exp(-dist * dist * 14.0) * 0.18;

  vec3 coreCol = vec3(1.0, 1.0, 1.0) * 5.5;
  vec3 glowCol = vec3(1.0, 0.99, 0.97);
  vec3 rayCol = vec3(1.0, 0.98, 0.95);

  vec3 color = coreCol * core;
  color += glowCol * innerGlow;
  color += glowCol * outerGlow * 0.45;
  color += rayCol * rays * 1.35;

  float alpha = clamp(core * 3.2 + innerGlow * 0.7 + outerGlow * 0.22 + rays * 0.35, 0.0, 1.0);
  alpha *= smoothstep(0.36, 0.05, dist);

  gl_FragColor = vec4(color, alpha);
}
`;

function LensFlareGhost({
  x,
  y,
  size,
  color,
  opacity,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}) {
  return (
    <mesh position={[x, y, -0.02]} renderOrder={11}>
      <circleGeometry args={[size, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function IncandescentSun({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const sunUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;
    }

    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh renderOrder={9}>
        <planeGeometry args={[SUN_DISC_SIZE, SUN_DISC_SIZE]} />
        <shaderMaterial
          ref={shaderRef}
          uniforms={sunUniforms}
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          transparent
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {FLARE_SPECS.map((flare, index) => (
        <LensFlareGhost key={`${flare.x}-${flare.y}-${index}`} {...flare} />
      ))}
    </group>
  );
}
