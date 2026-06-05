"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getDestroyerRuntime, useFleetCommand } from "./fleetCommandContext";
const PLANE_SIZE = 28;
const localScratch = new THREE.Vector3();
const raycastScratch = {
  raycaster: new THREE.Raycaster(),
  hit: new THREE.Vector3(),
  local: new THREE.Vector3(),
};

type FleetStrategyPreviewProps = {
  enabled: boolean;
  commandPlaneRef: React.RefObject<THREE.Mesh | null>;
};

export function FleetStrategyPreview({
  enabled,
  commandPlaneRef,
}: FleetStrategyPreviewProps) {
  const { camera, pointer } = useThree();
  const { selectedId, runtime, setCommandPreview } = useFleetCommand();
  const previewKeyRef = useRef<string | null>(null);
  const positions = useMemo(() => new Float32Array(6), []);

  const previewLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: "#7ee8ff",
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      toneMapped: false,
    });
    return new THREE.Line(geo, mat);
  }, [positions]);

  useEffect(() => {
    if (!enabled || selectedId === null) {
      setCommandPreview(null);
    }
  }, [enabled, selectedId, setCommandPreview]);

  useFrame(() => {
    if (!enabled || selectedId === null) {
      previewLine.visible = false;
      return;
    }

    const plane = commandPlaneRef.current;
    if (!plane) return;

    previewLine.visible = true;

    const { raycaster, hit, local } = raycastScratch;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(plane, false);

    const unitPos = getDestroyerRuntime(runtime, selectedId).position;

    if (hits.length > 0) {
      local.copy(hits[0].point);
      plane.worldToLocal(local);
      const previewKey = `${local.x.toFixed(2)}:${local.y.toFixed(2)}:${local.z.toFixed(2)}`;
      if (previewKeyRef.current !== previewKey) {
        previewKeyRef.current = previewKey;
        setCommandPreview([local.x, local.y, local.z]);
      }
      positions[0] = unitPos[0];
      positions[1] = unitPos[1];
      positions[2] = unitPos[2];
      positions[3] = local.x;
      positions[4] = local.y;
      positions[5] = local.z;
    } else {
      if (previewKeyRef.current !== null) {
        previewKeyRef.current = null;
        setCommandPreview(null);
      }
      positions[0] = unitPos[0];
      positions[1] = unitPos[1];
      positions[2] = unitPos[2];
      positions[3] = unitPos[0];
      positions[4] = unitPos[1];
      positions[5] = unitPos[2];
    }

    previewLine.geometry.attributes.position.needsUpdate = true;
    previewLine.geometry.computeBoundingSphere();
  });

  if (!enabled || selectedId === null) return null;

  return <primitive object={previewLine} renderOrder={9} />;
}

export function FleetCommandPlaneMesh({
  enabled,
  planeRef,
  onIssueOrder,
}: {
  enabled: boolean;
  planeRef: React.RefObject<THREE.Mesh | null>;
  onIssueOrder: (destination: [number, number, number]) => void;
}) {
  if (!enabled) return null;

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
      onClick={(event) => {
        event.stopPropagation();
        localScratch.copy(event.point);
        event.object.worldToLocal(localScratch);
        onIssueOrder([localScratch.x, localScratch.y, localScratch.z]);
      }}
    >
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
