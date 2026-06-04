"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ORBIT_SENSITIVITY_AZIMUTH = 0.0042;
const ORBIT_SENSITIVITY_ELEVATION = 0.0032;
const ORBIT_ELEVATION_LIMIT = 1.15;
const ORBIT_RETURN_LERP = 0.065;

export type MoonOrbitOffset = {
  azimuth: number;
  elevation: number;
};

export type PlanetOrbitTarget = "moon" | "mars" | null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function offsetToSpherical(offset: THREE.Vector3) {
  const radius = Math.max(offset.length(), 0.001);
  const azimuth = Math.atan2(offset.x, offset.z);
  const elevation = Math.asin(clamp(offset.y / radius, -1, 1));
  return { radius, azimuth, elevation };
}

export function sphericalToOffset(radius: number, azimuth: number, elevation: number) {
  const cosElevation = Math.cos(elevation);
  return new THREE.Vector3(
    radius * cosElevation * Math.sin(azimuth),
    radius * Math.sin(elevation),
    radius * cosElevation * Math.cos(azimuth)
  );
}

export function usePlanetOrbitControl(reducedMotion: boolean, target: PlanetOrbitTarget) {
  const { gl } = useThree();
  const offset = useRef<MoonOrbitOffset>({ azimuth: 0, elevation: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const activeTarget = useRef<PlanetOrbitTarget>(target);

  useEffect(() => {
    if (activeTarget.current !== target) {
      activeTarget.current = target;
      offset.current.azimuth = 0;
      offset.current.elevation = 0;
      dragging.current = false;
    }
  }, [target]);

  useEffect(() => {
    if (reducedMotion || target === null) return;

    const canvas = gl.domElement;

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const applyDragDelta = (clientX: number, clientY: number) => {
      const deltaX = clientX - lastPointer.current.x;
      const deltaY = clientY - lastPointer.current.y;
      lastPointer.current = { x: clientX, y: clientY };

      offset.current.azimuth -= deltaX * ORBIT_SENSITIVITY_AZIMUTH;
      offset.current.elevation = clamp(
        offset.current.elevation + deltaY * ORBIT_SENSITIVITY_ELEVATION,
        -ORBIT_ELEVATION_LIMIT,
        ORBIT_ELEVATION_LIMIT
      );
    };

    const startDrag = (clientX: number, clientY: number) => {
      dragging.current = true;
      lastPointer.current = { x: clientX, y: clientY };
      canvas.style.cursor = "grabbing";
    };

    const stopDrag = () => {
      if (!dragging.current) return;
      dragging.current = false;
      canvas.style.cursor = "default";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      startDrag(event.clientX, event.clientY);
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      applyDragDelta(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      stopDrag();
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      startDrag(event.clientX, event.clientY);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      applyDragDelta(event.clientX, event.clientY);
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      stopDrag();
    };

    canvas.addEventListener("contextmenu", onContextMenu, { capture: true });
    canvas.addEventListener("pointerdown", onPointerDown, { capture: true });
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", stopDrag);
    canvas.addEventListener("mousedown", onMouseDown, { capture: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("contextmenu", onContextMenu, { capture: true });
      canvas.removeEventListener("pointerdown", onPointerDown, { capture: true });
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", stopDrag);
      canvas.removeEventListener("mousedown", onMouseDown, { capture: true });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.style.cursor = "default";
    };
  }, [gl, reducedMotion, target]);

  useFrame(() => {
    if (dragging.current || reducedMotion || target === null) return;

    offset.current.azimuth = THREE.MathUtils.lerp(offset.current.azimuth, 0, ORBIT_RETURN_LERP);
    offset.current.elevation = THREE.MathUtils.lerp(offset.current.elevation, 0, ORBIT_RETURN_LERP);
  });

  return offset;
}

/** @deprecated Usa usePlanetOrbitControl con target explícito. */
export function useMoonOrbitControl(reducedMotion: boolean) {
  return usePlanetOrbitControl(reducedMotion, "moon");
}
