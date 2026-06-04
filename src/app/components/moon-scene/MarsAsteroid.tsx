"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ASTEROID_COLOR_URL, ASTEROID_NORMAL_URL } from "./asteroidTextures";

const MODEL_URL = "/models/asteroide.glb";

/** Radio orbital alrededor del centro de Marte (unidades escena). */
const ORBIT_RADIUS = 4.6;
/** Velocidad angular de la órbita (rad/s). ~90 s por vuelta. */
const ORBIT_SPEED = 0.07;
/** Inclinación del plano orbital respecto al ecuador local. */
const ORBIT_INCLINATION = 0.42;
/** Amplitud del “flote” vertical. */
const FLOAT_AMPLITUDE = 0.22;
const FLOAT_SPEED = 0.22;
/** Giro sobre sí mismo (rad/s). */
const SPIN_SPEED = 0.04;
/** Tamaño máximo del modelo en unidades escena. */
const TARGET_SIZE = 0.42;

function configureTexture(texture: THREE.Texture, colorSpace?: THREE.ColorSpace) {
  if (colorSpace) texture.colorSpace = colorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
}

function centerAndScaleModel(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = TARGET_SIZE / maxDim;
  root.scale.setScalar(scale);

  box.setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
}

function applyRockMaterial(
  root: THREE.Object3D,
  colorMap: THREE.Texture,
  normalMap: THREE.Texture
) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = false;
    child.receiveShadow = false;
    child.material = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap,
      normalScale: new THREE.Vector2(0.95, 0.95),
      roughness: 0.9,
      metalness: 0.02,
      color: "#ffffff",
      envMapIntensity: 0,
    });
  });
}

type MarsAsteroidProps = {
  reducedMotion?: boolean;
  visible?: boolean;
};

export function MarsAsteroid({ reducedMotion = false, visible = true }: MarsAsteroidProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const [colorMap, normalMap] = useTexture([ASTEROID_COLOR_URL, ASTEROID_NORMAL_URL]);

  useEffect(() => {
    configureTexture(colorMap, THREE.SRGBColorSpace);
    configureTexture(normalMap);
  }, [colorMap, normalMap]);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    applyRockMaterial(clone, colorMap, normalMap);
    centerAndScaleModel(clone);
    return clone;
  }, [scene, colorMap, normalMap]);

  useFrame(({ clock }, delta) => {
    if (!orbitRef.current || !visible) return;

    const t = reducedMotion ? 0 : clock.elapsedTime;
    const angle = t * ORBIT_SPEED;
    const wobble = reducedMotion ? 0 : Math.sin(t * FLOAT_SPEED) * FLOAT_AMPLITUDE;

    orbitRef.current.position.set(
      Math.cos(angle) * ORBIT_RADIUS,
      wobble + Math.sin(angle) * ORBIT_RADIUS * ORBIT_INCLINATION * 0.35,
      Math.sin(angle) * ORBIT_RADIUS
    );

    if (spinRef.current && !reducedMotion) {
      spinRef.current.rotation.y += delta * SPIN_SPEED;
      spinRef.current.rotation.x = Math.sin(t * 0.12) * 0.08;
      spinRef.current.rotation.z = Math.cos(t * 0.1) * 0.06;
    }
  });

  if (!visible) return null;

  return (
    <group ref={orbitRef}>
      <group ref={spinRef}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
useTexture.preload([ASTEROID_COLOR_URL, ASTEROID_NORMAL_URL]);
