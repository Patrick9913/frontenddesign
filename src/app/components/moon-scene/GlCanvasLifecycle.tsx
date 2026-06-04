"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/** Sincroniza el estado de postprocesado con el ciclo de vida del contexto WebGL. */
export function GlCanvasLifecycle({ onGlReady }: { onGlReady: (ready: boolean) => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    onGlReady(true);

    const onLost = () => onGlReady(false);
    const onRestored = () => onGlReady(true);

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      onGlReady(false);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, onGlReady]);

  return null;
}
