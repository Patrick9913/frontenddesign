"use client";

import { useThree } from "@react-three/fiber";
import {
  EffectComposer,
  type EffectComposerProps,
} from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import type { WebGLRenderer } from "three";

function hasValidGlContext(gl: WebGLRenderer) {
  try {
    const ctx = gl.getContext();
    if (!ctx || typeof ctx.getContextAttributes !== "function") return false;
    return ctx.getContextAttributes() !== null;
  } catch {
    return false;
  }
}

/**
 * Evita el crash de postprocessing cuando getContextAttributes() es null
 * (contexto perdido o renderer aún no listo).
 */
export function SafeEffectComposer(props: EffectComposerProps) {
  const { gl } = useThree();
  const [contextOk, setContextOk] = useState(() => hasValidGlContext(gl));

  useEffect(() => {
    const canvas = gl.domElement;

    const sync = () => setContextOk(hasValidGlContext(gl));

    sync();

    const onLost = () => setContextOk(false);

    canvas.addEventListener("webglcontextrestored", sync);
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      canvas.removeEventListener("webglcontextrestored", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [gl]);

  if (!contextOk) return null;

  return <EffectComposer {...props} />;
}
