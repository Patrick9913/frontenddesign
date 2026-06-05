"use client";

import { Outlines, useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MOON_CENTER, MOON_RADIUS } from "./moonSceneConstants";
import { applyHardTerminator } from "./planetTerminator";
import { type DestroyerId, useSceneTuning } from "./SceneTuningContext";
import { getPlanetLightDirection } from "./sunLighting";
import { useSunLightContext } from "./SunLightContext";
import { StationActivityLights } from "./StationActivityLights";

const DEATH_STAR_URL = "/models/death_star_-_star_wars(1).glb";
const DESTROYER_URL = "/models/star_destroyer.glb";

/** Escala base del modelo; el panel multiplica con `scale`. */
const BASE_DESTROYER_LENGTH = MOON_RADIUS * 2 * (1 / 18);
export const DEATH_STAR_DIAMETER = MOON_RADIUS * 2;
export const STAR_DESTROYER_LENGTH = BASE_DESTROYER_LENGTH;

const deg = (d: number) => THREE.MathUtils.degToRad(d);

const escortOrientScratch = {
  outward: new THREE.Vector3(),
  wing: new THREE.Vector3(),
  port: new THREE.Vector3(),
  matrix: new THREE.Matrix4(),
};

const dragScratch = {
  plane: new THREE.Plane(),
  intersection: new THREE.Vector3(),
  worldPos: new THREE.Vector3(),
  localPos: new THREE.Vector3(),
  offset: new THREE.Vector3(),
  ray: new THREE.Ray(),
  ndc: new THREE.Vector2(),
};

function orientDestroyer(group: THREE.Object3D, position: THREE.Vector3) {
  const { outward, wing, port, matrix } = escortOrientScratch;

  outward.copy(position).normalize();

  wing.crossVectors(new THREE.Vector3(0, 1, 0), outward);
  if (wing.lengthSq() < 1e-6) {
    wing.crossVectors(new THREE.Vector3(0, 0, 1), outward);
  }
  wing.normalize();

  port.crossVectors(outward, wing).normalize();

  matrix.makeBasis(port, wing, outward);
  group.quaternion.setFromRotationMatrix(matrix);
}

function centerAndScaleToMaxDim(root: THREE.Object3D, targetMaxDim: number) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  root.scale.setScalar(targetMaxDim / maxDim);

  box.setFromObject(root);
  root.position.sub(box.getCenter(new THREE.Vector3()));
}

function tuneFleetMaterial(material: THREE.MeshStandardMaterial) {
  material.metalness = THREE.MathUtils.clamp(material.metalness, 0.18, 0.72);
  material.roughness = THREE.MathUtils.clamp(material.roughness, 0.28, 0.82);
  material.envMapIntensity = 0.32;
}

function LitFleetModel({
  model,
  cacheKey,
}: {
  model: THREE.Object3D;
  cacheKey: string;
}) {
  const { registerMaterial } = useSunLightContext();
  const lightDirection = useRef(new THREE.Vector3());

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const material = child.material;
      if (!(material instanceof THREE.MeshStandardMaterial)) return;

      tuneFleetMaterial(material);
      getPlanetLightDirection(MOON_CENTER, lightDirection.current);
      applyHardTerminator(material, cacheKey, lightDirection.current, "uMoonLightDir");
      material.needsUpdate = true;

      cleanups.push(
        registerMaterial({
          material,
          planetCenter: MOON_CENTER,
          uniformName: "uMoonLightDir",
        })
      );
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [cacheKey, model, registerMaterial]);

  return <primitive object={model} />;
}

function StarDestroyerEscort({
  destroyerId,
}: {
  destroyerId: DestroyerId;
}) {
  const escortRef = useRef<THREE.Group>(null);
  const parentRef = useRef<THREE.Group>(null);
  const draggingRef = useRef(false);
  const { scene } = useGLTF(DESTROYER_URL);
  const { camera, gl } = useThree();
  const {
    destroyers,
    layoutEditEnabled,
    selectedDestroyerId,
    setDestroyerPositionTuple,
    setSelectedDestroyerId,
  } = useSceneTuning();

  const tuning = destroyers[destroyerId];
  const selected = selectedDestroyerId === destroyerId;

  const model = useMemo(() => {
    const clone = scene.clone(true);
    centerAndScaleToMaxDim(clone, BASE_DESTROYER_LENGTH * tuning.scale);
    return clone;
  }, [scene, tuning.scale]);

  useFrame(() => {
    if (!escortRef.current || draggingRef.current) return;

    escortRef.current.position.set(tuning.position[0], tuning.position[1], tuning.position[2]);
    orientDestroyer(escortRef.current, escortRef.current.position);
  });

  const projectPointerToLocal = (clientX: number, clientY: number) => {
    const parent = parentRef.current;
    const escort = escortRef.current;
    if (!parent || !escort) return null;

    const rect = gl.domElement.getBoundingClientRect();
    dragScratch.ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    dragScratch.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    dragScratch.ray.direction
      .set(dragScratch.ndc.x, dragScratch.ndc.y, 0.5)
      .unproject(camera)
      .sub(dragScratch.ray.origin)
      .normalize();

    escort.getWorldPosition(dragScratch.worldPos);
    camera.getWorldDirection(dragScratch.offset).normalize();
    dragScratch.plane.setFromNormalAndCoplanarPoint(dragScratch.offset, dragScratch.worldPos);

    if (!dragScratch.ray.intersectPlane(dragScratch.plane, dragScratch.intersection)) {
      return null;
    }

    parent.worldToLocal(dragScratch.localPos.copy(dragScratch.intersection));
    return dragScratch.localPos;
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!layoutEditEnabled) return;
    event.stopPropagation();

    setSelectedDestroyerId(destroyerId);
    draggingRef.current = true;
    gl.domElement.style.cursor = "grabbing";

    const local = projectPointerToLocal(event.clientX, event.clientY);
    if (local && escortRef.current) {
      dragScratch.offset
        .copy(escortRef.current.position)
        .sub(local);
    }
  };

  useEffect(() => {
    if (!layoutEditEnabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const local = projectPointerToLocal(event.clientX, event.clientY);
      if (!local) return;

      local.add(dragScratch.offset);
      setDestroyerPositionTuple(destroyerId, [local.x, local.y, local.z]);

      if (escortRef.current) {
        escortRef.current.position.copy(local);
        orientDestroyer(escortRef.current, escortRef.current.position);
      }
    };

    const handlePointerUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      gl.domElement.style.cursor = layoutEditEnabled ? "grab" : "default";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [destroyerId, gl.domElement, layoutEditEnabled, setDestroyerPositionTuple]);

  return (
    <group ref={parentRef}>
      <group
        ref={escortRef}
        onPointerDown={handlePointerDown}
        onPointerOver={(event) => {
          if (!layoutEditEnabled) return;
          event.stopPropagation();
          gl.domElement.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (draggingRef.current) return;
          gl.domElement.style.cursor = "default";
        }}
      >
        <LitFleetModel model={model} cacheKey="destroyer-cinematic-v1" />
        {layoutEditEnabled ? (
          <mesh renderOrder={8}>
            <sphereGeometry args={[BASE_DESTROYER_LENGTH * tuning.scale * 0.55, 12, 12]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        ) : null}
        {selected && layoutEditEnabled ? (
          <mesh>
            <sphereGeometry args={[BASE_DESTROYER_LENGTH * tuning.scale * 0.62, 16, 16]} />
            <Outlines
              color="#66ccff"
              thickness={0.012}
              screenspace
              opacity={0.55}
              angle={Math.PI}
              transparent
              toneMapped={false}
            />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}

type DeathStarFleetProps = {
  selectable: boolean;
  onSelect?: () => void;
  reducedMotion: boolean;
};

export function DeathStarFleet({ selectable, onSelect, reducedMotion }: DeathStarFleetProps) {
  const { gl } = useThree();
  const { deathStarRotationDeg } = useSceneTuning();
  const { scene } = useGLTF(DEATH_STAR_URL);
  const [hovered, setHovered] = useState(false);
  const showOutline = selectable && hovered;
  const deathStarRotation = useMemo(
    (): [number, number, number] => [
      deg(deathStarRotationDeg[0]),
      deg(deathStarRotationDeg[1]),
      deg(deathStarRotationDeg[2]),
    ],
    [deathStarRotationDeg]
  );

  const deathStar = useMemo(() => {
    const clone = scene.clone(true);
    centerAndScaleToMaxDim(clone, DEATH_STAR_DIAMETER);
    return clone;
  }, [scene]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!selectable) return;
    event.stopPropagation();
    setHovered(true);
    gl.domElement.style.cursor = "pointer";
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(false);
    gl.domElement.style.cursor = "default";
  };

  return (
    <group>
      <group rotation={deathStarRotation}>
        <group
          onClick={(event) => {
            if (!selectable) return;
            event.stopPropagation();
            onSelect?.();
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <LitFleetModel model={deathStar} cacheKey="death-star-cinematic-v1" />
          {showOutline ? (
            <mesh>
              <sphereGeometry args={[MOON_RADIUS * 1.02, 48, 48]} />
              <Outlines
                color="#fff8f2"
                thickness={0.0075}
                screenspace
                opacity={0.34}
                angle={Math.PI}
                transparent
                toneMapped={false}
              />
            </mesh>
          ) : null}
        </group>

        <StarDestroyerEscort destroyerId={0} />
        <StarDestroyerEscort destroyerId={1} />
        <StationActivityLights reducedMotion={reducedMotion} />
      </group>
    </group>
  );
}

useGLTF.preload(DEATH_STAR_URL);
useGLTF.preload(DESTROYER_URL);
