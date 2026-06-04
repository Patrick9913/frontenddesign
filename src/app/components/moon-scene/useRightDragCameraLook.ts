"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const LOOK_SENSITIVITY = 0.0022;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

function syncEulerFromCamera(camera: THREE.PerspectiveCamera, euler: THREE.Euler) {
  euler.setFromQuaternion(camera.quaternion, "YXZ");
}

function applyEulerToCamera(camera: THREE.PerspectiveCamera, euler: THREE.Euler) {
  euler.x = THREE.MathUtils.clamp(euler.x, -PITCH_LIMIT, PITCH_LIMIT);
  camera.quaternion.setFromEuler(euler);
}

/** Botón derecho + arrastre para rotar la cámara (cursor siempre visible). */
export function useRightDragCameraLook(enabled: boolean, reducedMotion: boolean) {
  const { camera, gl } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const synced = useRef(false);

  useEffect(() => {
    if (!enabled || reducedMotion) {
      dragging.current = false;
      synced.current = false;
      return;
    }

    const cam = camera as THREE.PerspectiveCamera;
    if (!synced.current) {
      syncEulerFromCamera(cam, euler.current);
      synced.current = true;
    }

    const canvas = gl.domElement;

    const applyLookDelta = (clientX: number, clientY: number) => {
      const deltaX = clientX - lastPointer.current.x;
      const deltaY = clientY - lastPointer.current.y;
      lastPointer.current = { x: clientX, y: clientY };
      euler.current.y -= deltaX * LOOK_SENSITIVITY;
      euler.current.x -= deltaY * LOOK_SENSITIVITY;
      applyEulerToCamera(cam, euler.current);
    };

    const stopDrag = () => {
      if (!dragging.current) return;
      dragging.current = false;
      canvas.style.cursor = "";
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      applyLookDelta(event.clientX, event.clientY);
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
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      applyLookDelta(event.clientX, event.clientY);
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
      dragging.current = false;
      if (document.body.style.cursor === "grabbing") {
        document.body.style.cursor = "";
      }
      canvas.style.cursor = "";
    };
  }, [camera, enabled, gl, reducedMotion]);

  return null;
}
