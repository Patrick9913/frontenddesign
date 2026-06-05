"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useFleetCommand } from "./fleetCommandContext";
import type { DestroyerId } from "./SceneTuningContext";

const PLANE_SIZE = 28;
const MARKER_INNER = 0.18;
const MARKER_OUTER = 0.34;

type FleetCommandPlaneProps = {
  enabled: boolean;
};

export function FleetCommandPlane({ enabled }: FleetCommandPlaneProps) {
  const { selectedId, issueMoveOrder } = useFleetCommand();

  if (!enabled || selectedId === null) return null;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
      onClick={(event) => {
        event.stopPropagation();
        const destination: [number, number, number] = [
          event.point.x,
          event.point.y,
          event.point.z,
        ];
        issueMoveOrder(selectedId, destination);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

function DestinationMarker({
  destroyerId,
  destination,
}: {
  destroyerId: DestroyerId;
  destination: [number, number, number];
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 1.6;
  });

  return (
    <group position={destination}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}>
        <ringGeometry args={[MARKER_INNER, MARKER_OUTER, 40]} />
        <meshBasicMaterial
          color={destroyerId % 2 === 0 ? "#66ccff" : "#9ad9ff"}
          transparent
          opacity={0.72}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
        <ringGeometry args={[MARKER_OUTER * 1.08, MARKER_OUTER * 1.16, 40]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

type FleetDestinationMarkersProps = {
  enabled: boolean;
};

export function FleetDestinationMarkers({ enabled }: FleetDestinationMarkersProps) {
  const { runtime } = useFleetCommand();

  if (!enabled) return null;

  return (
    <>
      {Object.entries(runtime).map(([id, entry]) =>
        entry.destination ? (
          <DestinationMarker
            key={id}
            destroyerId={Number(id)}
            destination={entry.destination}
          />
        ) : null
      )}
    </>
  );
}
