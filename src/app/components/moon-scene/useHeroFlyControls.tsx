"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MOVE_SPEED = 20;
const VERTICAL_SPEED = 14;
const LOOK_SENSITIVITY = 0.0022;
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const forwardScratch = new THREE.Vector3();
const rightScratch = new THREE.Vector3();
const moveScratch = new THREE.Vector3();

type FlyKeys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

const emptyKeys = (): FlyKeys => ({
  forward: false,
  back: false,
  left: false,
  right: false,
  up: false,
  down: false,
});

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function applyKeyState(keys: FlyKeys, code: string, pressed: boolean) {
  switch (code) {
    case "KeyW":
      keys.forward = pressed;
      break;
    case "KeyS":
      keys.back = pressed;
      break;
    case "KeyA":
      keys.left = pressed;
      break;
    case "KeyD":
      keys.right = pressed;
      break;
    case "Space":
      keys.up = pressed;
      break;
    case "ControlLeft":
    case "ControlRight":
      keys.down = pressed;
      break;
    default:
      break;
  }
}

function syncEulerFromCamera(camera: THREE.PerspectiveCamera, euler: THREE.Euler) {
  euler.setFromQuaternion(camera.quaternion, "YXZ");
}

function applyEulerToCamera(camera: THREE.PerspectiveCamera, euler: THREE.Euler) {
  euler.x = THREE.MathUtils.clamp(euler.x, -PITCH_LIMIT, PITCH_LIMIT);
  camera.quaternion.setFromEuler(euler);
}

/**
 * Navegación libre: WASD, Space/Ctrl vertical, botón derecho + arrastre para mirar.
 * El cursor permanece siempre visible (sin pointer lock).
 */
export function HeroFlyControls({
  enabled,
  reducedMotion,
  onRequestExit,
}: {
  enabled: boolean;
  reducedMotion: boolean;
  onRequestExit?: () => void;
}) {
  const { camera, gl } = useThree();
  const keys = useRef<FlyKeys>(emptyKeys());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const viewSynced = useRef(false);
  const lookDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || reducedMotion) {
      keys.current = emptyKeys();
      viewSynced.current = false;
      lookDragging.current = false;
      gl.domElement.style.cursor = "";
      return;
    }

    const cam = camera as THREE.PerspectiveCamera;
    syncEulerFromCamera(cam, euler.current);
    viewSynced.current = true;

    const canvas = gl.domElement;
    canvas.style.cursor = "default";

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if (event.code === "Escape") {
        onRequestExit?.();
        return;
      }

      if (
        event.code === "KeyW" ||
        event.code === "KeyA" ||
        event.code === "KeyS" ||
        event.code === "KeyD" ||
        event.code === "Space" ||
        event.code === "ControlLeft" ||
        event.code === "ControlRight"
      ) {
        event.preventDefault();
        applyKeyState(keys.current, event.code, true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      applyKeyState(keys.current, event.code, false);
    };

    const onBlur = () => {
      keys.current = emptyKeys();
      lookDragging.current = false;
      canvas.style.cursor = "default";
    };

    const applyLookDelta = (clientX: number, clientY: number) => {
      const deltaX = clientX - lastPointer.current.x;
      const deltaY = clientY - lastPointer.current.y;
      lastPointer.current = { x: clientX, y: clientY };

      euler.current.y -= deltaX * LOOK_SENSITIVITY;
      euler.current.x -= deltaY * LOOK_SENSITIVITY;
      applyEulerToCamera(cam, euler.current);
    };

    const stopLookDrag = () => {
      if (!lookDragging.current) return;
      lookDragging.current = false;
      canvas.style.cursor = "default";
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      lookDragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!lookDragging.current) return;
      event.preventDefault();
      applyLookDelta(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      stopLookDrag();
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      lookDragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!lookDragging.current) return;
      event.preventDefault();
      applyLookDelta(event.clientX, event.clientY);
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      stopLookDrag();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    canvas.addEventListener("contextmenu", onContextMenu, { capture: true });
    canvas.addEventListener("pointerdown", onPointerDown, { capture: true });
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", stopLookDrag);
    canvas.addEventListener("mousedown", onMouseDown, { capture: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      canvas.removeEventListener("contextmenu", onContextMenu, { capture: true });
      canvas.removeEventListener("pointerdown", onPointerDown, { capture: true });
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", stopLookDrag);
      canvas.removeEventListener("mousedown", onMouseDown, { capture: true });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      keys.current = emptyKeys();
      lookDragging.current = false;
      canvas.style.cursor = "";
    };
  }, [camera, enabled, gl, onRequestExit, reducedMotion]);

  useFrame((_, delta) => {
    if (!enabled || reducedMotion) return;

    const cam = camera as THREE.PerspectiveCamera;
    if (!viewSynced.current) {
      syncEulerFromCamera(cam, euler.current);
      viewSynced.current = true;
    }

    const k = keys.current;
    moveScratch.set(0, 0, 0);

    cam.getWorldDirection(forwardScratch);
    forwardScratch.y = 0;
    if (forwardScratch.lengthSq() > 1e-6) {
      forwardScratch.normalize();
    } else {
      forwardScratch.set(0, 0, -1);
    }

    rightScratch.crossVectors(forwardScratch, WORLD_UP).normalize();

    if (k.forward) moveScratch.add(forwardScratch);
    if (k.back) moveScratch.sub(forwardScratch);
    if (k.right) moveScratch.add(rightScratch);
    if (k.left) moveScratch.sub(rightScratch);

    const horizontalLen = moveScratch.length();
    if (horizontalLen > 0) {
      moveScratch.multiplyScalar((MOVE_SPEED * delta) / horizontalLen);
      cam.position.add(moveScratch);
    }

    if (k.up) cam.position.y += VERTICAL_SPEED * delta;
    if (k.down) cam.position.y -= VERTICAL_SPEED * delta;
  });

  return null;
}
