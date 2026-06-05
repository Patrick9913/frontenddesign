"use client";

import { Outlines, useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getCinematicPhases, getDestroyerHyperspaceProgress } from "./cinematicPhases";
import { FleetDestinationMarkers } from "./FleetCommandLayer";
import { FleetCommandPlaneMesh, FleetStrategyPreview } from "./FleetStrategyPreview";
import { getDestroyerRuntime, useFleetCommand } from "./fleetCommandContext";
import { HyperspaceStreaks } from "./HyperspaceStreaks";
import { MOON_CENTER, MOON_RADIUS } from "./moonSceneConstants";
import { applyHardTerminator } from "./planetTerminator";
import { type DestroyerId, useSceneTuning } from "./SceneTuningContext";
import { getPlanetLightDirection } from "./sunLighting";
import { useSunLightContext } from "./SunLightContext";
import { StationActivityLights } from "./StationActivityLights";

const DEATH_STAR_URL = "/models/death_star_-_star_wars(1).glb";
const DESTROYER_URL = "/models/star_destroyer.glb";

const DEATH_STAR_RISE_START_Y = -15.5;
const HYPERSPACE_APPROACH_DISTANCE = 52;

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

const hyperspaceScratch = {
  finalPos: new THREE.Vector3(),
  startPos: new THREE.Vector3(),
  approachDir: new THREE.Vector3(),
};

const hoverScratch = {
  home: new THREE.Vector3(),
  delta: new THREE.Vector3(),
  correctedPos: new THREE.Vector3(),
  baseQuat: new THREE.Quaternion(),
  yawQuat: new THREE.Quaternion(),
  pitchQuat: new THREE.Quaternion(),
};

const DESTROYER_MOVE_SPEED = 2.6;
const DESTROYER_ARRIVE_DISTANCE = 0.11;

const DESTROYER_HOVER = {
  maxLateral: 0.38,
  maxVertical: 0.14,
  maxYaw: 0.045,
  maxPitch: 0.028,
  lateralGain: 0.2,
  verticalGain: 0.13,
  yawGain: 0.011,
  pitchGain: 0.009,
  stiffness: 11,
  damping: 7.5,
} as const;

type DestroyerBasis = {
  forward: THREE.Vector3;
  wing: THREE.Vector3;
  port: THREE.Vector3;
};

function getDestroyerBasis(position: THREE.Vector3): DestroyerBasis {
  const { outward, wing, port } = escortOrientScratch;

  outward.copy(position).normalize();

  wing.crossVectors(new THREE.Vector3(0, 1, 0), outward);
  if (wing.lengthSq() < 1e-6) {
    wing.crossVectors(new THREE.Vector3(0, 0, 1), outward);
  }
  wing.normalize();

  port.crossVectors(outward, wing).normalize();

  return {
    forward: outward.clone(),
    wing: wing.clone(),
    port: port.clone(),
  };
}

function orientDestroyer(group: THREE.Object3D, position: THREE.Vector3) {
  const { matrix } = escortOrientScratch;
  const { forward, wing, port } = getDestroyerBasis(position);

  matrix.makeBasis(port, wing, forward);
  group.quaternion.setFromRotationMatrix(matrix);
}

function applyDestroyerCourseCorrection(
  group: THREE.Group,
  homePosition: THREE.Vector3,
  basis: DestroyerBasis,
  offsets: { wing: number; port: number; yaw: number; pitch: number }
) {
  const { correctedPos, baseQuat, yawQuat, pitchQuat } = hoverScratch;

  correctedPos
    .copy(homePosition)
    .addScaledVector(basis.wing, offsets.wing)
    .addScaledVector(basis.port, offsets.port);
  group.position.copy(correctedPos);

  orientDestroyer(group, homePosition);
  baseQuat.copy(group.quaternion);
  yawQuat.setFromAxisAngle(basis.port, offsets.yaw);
  pitchQuat.setFromAxisAngle(basis.wing, offsets.pitch);
  group.quaternion.copy(baseQuat).multiply(yawQuat).multiply(pitchQuat);
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

function ModelSelectionOutline({ model }: { model: THREE.Object3D }) {
  const parts = useMemo(() => {
    model.updateMatrixWorld(true);
    const invModel = new THREE.Matrix4().copy(model.matrixWorld).invert();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const result: Array<{
      geometry: THREE.BufferGeometry;
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
      scale: THREE.Vector3;
    }> = [];

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.geometry) return;
      const localMatrix = child.matrixWorld.clone().premultiply(invModel);
      localMatrix.decompose(position, quaternion, scale);
      result.push({
        geometry: child.geometry,
        position: position.clone(),
        quaternion: quaternion.clone(),
        scale: scale.clone(),
      });
    });

    return result;
  }, [model]);

  return (
    <group>
      {parts.map((part, index) => (
        <mesh
          key={index}
          geometry={part.geometry}
          position={part.position}
          quaternion={part.quaternion}
          scale={part.scale}
          renderOrder={10}
        >
          <meshBasicMaterial visible={false} />
          <Outlines
            color="#8ec8dc"
            thickness={0.0045}
            screenspace
            opacity={0.38}
            angle={Math.PI}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const moveScratch = {
  current: new THREE.Vector3(),
  destination: new THREE.Vector3(),
  toDestination: new THREE.Vector3(),
};

function StarDestroyerEscort({
  destroyerId,
  tuning,
  hyperspaceProgress = 1,
  cinematicMode = false,
  reducedMotion = false,
  strategyEnabled = false,
}: {
  destroyerId: DestroyerId;
  tuning: { position: [number, number, number]; scale: number };
  hyperspaceProgress?: number;
  cinematicMode?: boolean;
  reducedMotion?: boolean;
  strategyEnabled?: boolean;
}) {
  const escortRef = useRef<THREE.Group>(null);
  const parentRef = useRef<THREE.Group>(null);
  const draggingRef = useRef(false);
  const hoverActiveRef = useRef(false);
  const positionInitializedRef = useRef(false);
  const currentPosRef = useRef(new THREE.Vector3());
  const hoverTargetRef = useRef({ wing: 0, port: 0, yaw: 0, pitch: 0 });
  const springRef = useRef({
    wing: 0,
    port: 0,
    yaw: 0,
    pitch: 0,
    wingVel: 0,
    portVel: 0,
    yawVel: 0,
    pitchVel: 0,
  });
  const { scene } = useGLTF(DESTROYER_URL);
  const { camera, gl } = useThree();
  const {
    selectedId,
    runtime,
    selectDestroyer,
    setRuntimePosition,
    clearDestination,
  } = useFleetCommand();
  const {
    layoutEditEnabled,
    selectedDestroyerId,
    setDestroyerPositionTuple,
    setSelectedDestroyerId,
  } = useSceneTuning();
  const destroyerRuntime = getDestroyerRuntime(runtime, destroyerId);
  const selectedForEdit = selectedDestroyerId === destroyerId;
  const selectedForStrategy = strategyEnabled && selectedId === destroyerId;
  const useCinematic = cinematicMode && !layoutEditEnabled;
  const visible = !useCinematic || hyperspaceProgress > 0.015;
  const commandReady = strategyEnabled && !layoutEditEnabled;
  const isMoving = commandReady && destroyerRuntime.destination !== null;
  const hoverPhysicsEnabled =
    commandReady && !reducedMotion && !isMoving && !selectedForStrategy;

  const model = useMemo(() => {
    const clone = scene.clone(true);
    centerAndScaleToMaxDim(clone, BASE_DESTROYER_LENGTH * tuning.scale);
    return clone;
  }, [scene, tuning.scale]);

  const approachDir = useMemo(() => {
    const dir = hyperspaceScratch.approachDir;
    dir.set(0, 0.04, 1).normalize();
    return dir.clone();
  }, []);

  const integrateHoverSpring = (delta: number) => {
    const spring = springRef.current;
    const target = hoverActiveRef.current
      ? hoverTargetRef.current
      : { wing: 0, port: 0, yaw: 0, pitch: 0 };

    const stepAxis = (
      key: "wing" | "port" | "yaw" | "pitch",
      velKey: "wingVel" | "portVel" | "yawVel" | "pitchVel"
    ) => {
      const displacement = spring[key] - target[key];
      const acceleration = -DESTROYER_HOVER.stiffness * displacement - DESTROYER_HOVER.damping * spring[velKey];
      spring[velKey] += acceleration * delta;
      spring[key] += spring[velKey] * delta;
    };

    stepAxis("wing", "wingVel");
    stepAxis("port", "portVel");
    stepAxis("yaw", "yawVel");
    stepAxis("pitch", "pitchVel");
  };

  useFrame((_, delta) => {
    if (!escortRef.current || draggingRef.current) return;

    const { finalPos, startPos } = hyperspaceScratch;
    const { current, destination, toDestination } = moveScratch;

    if (!positionInitializedRef.current && (strategyEnabled || hyperspaceProgress >= 0.98)) {
      currentPosRef.current.set(tuning.position[0], tuning.position[1], tuning.position[2]);
      positionInitializedRef.current = true;
    }

    finalPos.set(tuning.position[0], tuning.position[1], tuning.position[2]);

    if (useCinematic && hyperspaceProgress < 0.98) {
      startPos.copy(finalPos).addScaledVector(approachDir, HYPERSPACE_APPROACH_DISTANCE);
      escortRef.current.position.lerpVectors(startPos, finalPos, hyperspaceProgress);

      const stretch =
        hyperspaceProgress < 0.72
          ? THREE.MathUtils.lerp(7.5, 1, hyperspaceProgress / 0.72)
          : 1;
      escortRef.current.scale.set(1, 1, stretch);
      orientDestroyer(escortRef.current, escortRef.current.position);
      return;
    }

    escortRef.current.scale.set(1, 1, 1);
    if (commandReady) {
      current.copy(currentPosRef.current);
    } else {
      current.set(tuning.position[0], tuning.position[1], tuning.position[2]);
    }
    finalPos.copy(current);

    const order = getDestroyerRuntime(runtime, destroyerId).destination;
    if (commandReady && order) {
      hoverActiveRef.current = false;
      destination.set(order[0], order[1], order[2]);
      toDestination.copy(destination).sub(current);
      const distance = toDestination.length();

      if (distance <= DESTROYER_ARRIVE_DISTANCE) {
        current.copy(destination);
        currentPosRef.current.copy(destination);
        setRuntimePosition(destroyerId, [destination.x, destination.y, destination.z]);
        clearDestination(destroyerId);
      } else {
        current.addScaledVector(
          toDestination.normalize(),
          Math.min(DESTROYER_MOVE_SPEED * delta, distance)
        );
        currentPosRef.current.copy(current);
      }

      escortRef.current.position.copy(current);
      orientDestroyer(escortRef.current, current);
      return;
    }

    if (commandReady) {
      currentPosRef.current.copy(current);
      finalPos.copy(current);
    }

    if (hoverPhysicsEnabled) {
      integrateHoverSpring(delta);
      const basis = getDestroyerBasis(finalPos);
      applyDestroyerCourseCorrection(escortRef.current, finalPos, basis, springRef.current);
      return;
    }

    escortRef.current.position.copy(finalPos);
    orientDestroyer(escortRef.current, finalPos);
  });

  const updateHoverTarget = (worldPoint: THREE.Vector3) => {
    const parent = parentRef.current;
    if (!parent || !hoverPhysicsEnabled) return;

    const { home, delta } = hoverScratch;
    home.copy(hyperspaceScratch.finalPos);
    const basis = getDestroyerBasis(home);

    delta.copy(worldPoint);
    parent.worldToLocal(delta);
    delta.sub(home);

    hoverTargetRef.current.wing = THREE.MathUtils.clamp(
      delta.dot(basis.wing) * DESTROYER_HOVER.lateralGain,
      -DESTROYER_HOVER.maxLateral,
      DESTROYER_HOVER.maxLateral
    );
    hoverTargetRef.current.port = THREE.MathUtils.clamp(
      delta.dot(basis.port) * DESTROYER_HOVER.verticalGain,
      -DESTROYER_HOVER.maxVertical,
      DESTROYER_HOVER.maxVertical
    );
    hoverTargetRef.current.yaw = THREE.MathUtils.clamp(
      hoverTargetRef.current.wing * DESTROYER_HOVER.yawGain,
      -DESTROYER_HOVER.maxYaw,
      DESTROYER_HOVER.maxYaw
    );
    hoverTargetRef.current.pitch = THREE.MathUtils.clamp(
      -hoverTargetRef.current.port * DESTROYER_HOVER.pitchGain,
      -DESTROYER_HOVER.maxPitch,
      DESTROYER_HOVER.maxPitch
    );
  };

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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!commandReady || layoutEditEnabled) return;
    event.stopPropagation();
    selectDestroyer(destroyerId);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!layoutEditEnabled) return;
    event.stopPropagation();

    setSelectedDestroyerId(destroyerId);
    draggingRef.current = true;
    gl.domElement.style.cursor = "grabbing";

    const local = projectPointerToLocal(event.clientX, event.clientY);
    if (local && escortRef.current) {
      dragScratch.offset.copy(escortRef.current.position).sub(local);
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

  if (!visible) return null;

  return (
    <group ref={parentRef}>
      <group
        ref={escortRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (layoutEditEnabled) {
            gl.domElement.style.cursor = "grab";
            return;
          }
          if (commandReady) {
            gl.domElement.style.cursor = "pointer";
          }
          if (hoverPhysicsEnabled) {
            hoverActiveRef.current = true;
            gl.domElement.style.cursor = "crosshair";
            updateHoverTarget(event.point);
          }
        }}
        onPointerMove={(event) => {
          if (!hoverPhysicsEnabled || layoutEditEnabled) return;
          event.stopPropagation();
          hoverActiveRef.current = true;
          updateHoverTarget(event.point);
        }}
        onPointerOut={() => {
          hoverActiveRef.current = false;
          if (draggingRef.current) return;
          gl.domElement.style.cursor = "default";
        }}
      >
        {useCinematic && hyperspaceProgress < 0.92 ? (
          <HyperspaceStreaks progress={hyperspaceProgress} direction={approachDir} />
        ) : null}
        <LitFleetModel model={model} cacheKey="destroyer-cinematic-v1" />
        {selectedForStrategy ? <ModelSelectionOutline model={model} /> : null}
        {layoutEditEnabled || hoverPhysicsEnabled || commandReady ? (
          <mesh renderOrder={8}>
            <sphereGeometry args={[BASE_DESTROYER_LENGTH * tuning.scale * 0.55, 12, 12]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        ) : null}
        {selectedForEdit && layoutEditEnabled ? (
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
  scrollProgress?: number;
  strategyEnabled?: boolean;
};

export function DeathStarFleet({
  selectable,
  onSelect,
  reducedMotion,
  scrollProgress = 0,
  strategyEnabled = false,
}: DeathStarFleetProps) {
  const { gl } = useThree();
  const { selectedId, issueMoveOrder } = useFleetCommand();
  const commandPlaneRef = useRef<THREE.Mesh>(null);
  const { deathStarRotationDeg, destroyers, layoutEditEnabled } = useSceneTuning();
  const { scene } = useGLTF(DEATH_STAR_URL);
  const [hovered, setHovered] = useState(false);
  const deathStarRiseRef = useRef<THREE.Group>(null);

  const cinematic = getCinematicPhases(scrollProgress);
  const cinematicMode = !layoutEditEnabled;
  const showDeathStar = strategyEnabled || !cinematicMode || cinematic.deathStarVisible;
  const showLights =
    strategyEnabled ||
    !cinematicMode ||
    cinematic.deathStarRise > 0.72 ||
    destroyers.some((_, index) => getDestroyerHyperspaceProgress(scrollProgress, index) > 0.2);

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

  useFrame(() => {
    if (!deathStarRiseRef.current || layoutEditEnabled) return;
    if (strategyEnabled) {
      deathStarRiseRef.current.position.y = 0;
      return;
    }
    const { deathStarRise } = getCinematicPhases(scrollProgress);
    deathStarRiseRef.current.position.y = THREE.MathUtils.lerp(
      DEATH_STAR_RISE_START_Y,
      0,
      deathStarRise
    );
  });

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

  if (cinematicMode && !cinematic.fleetRevealed && !strategyEnabled) {
    return null;
  }

  return (
    <group>
      <group rotation={deathStarRotation}>
        {showDeathStar ? (
          <group ref={deathStarRiseRef}>
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
          </group>
        ) : null}
        {showLights ? <StationActivityLights reducedMotion={reducedMotion} /> : null}
      </group>

      <group>
        {destroyers.map((destroyer, index) => (
          <StarDestroyerEscort
            key={destroyer.id}
            destroyerId={destroyer.id}
            tuning={destroyer}
            hyperspaceProgress={
              strategyEnabled ? 1 : getDestroyerHyperspaceProgress(scrollProgress, index)
            }
            cinematicMode={strategyEnabled ? false : cinematicMode}
            reducedMotion={reducedMotion}
            strategyEnabled={strategyEnabled}
          />
        ))}
        <FleetCommandPlaneMesh
          enabled={strategyEnabled && !layoutEditEnabled && selectedId !== null}
          planeRef={commandPlaneRef}
          onIssueOrder={(destination) => {
            if (selectedId === null) return;
            issueMoveOrder(selectedId, destination);
          }}
        />
        <FleetStrategyPreview
          enabled={strategyEnabled && !layoutEditEnabled}
          commandPlaneRef={commandPlaneRef}
        />
        <FleetDestinationMarkers enabled={strategyEnabled} />
      </group>
    </group>
  );
}

useGLTF.preload(DEATH_STAR_URL);
useGLTF.preload(DESTROYER_URL);
