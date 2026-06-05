"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { getStableGlConfig, useQualityProfile, type QualityProfile } from "../hero-scene/useQualityProfile";
import { useScenePointer } from "../hero-scene/useScenePointer";
import { GlCanvasLifecycle } from "./GlCanvasLifecycle";
import { SafeEffectComposer } from "./SafeEffectComposer";
import { getCinematicPhases } from "./cinematicPhases";
import { DeathStarFleet } from "./DeathStarFleet";
import { Starfield } from "./Starfield";
import { MOON_CENTER, MOON_POSITION } from "./moonSceneConstants";
import { DEFAULT_CAMERA_FOV, useSceneTuning } from "./SceneTuningContext";
import { StrategySelectionCamera } from "./StrategySelectionCamera";
import { HeroFlyControls } from "./useHeroFlyControls";
import { SunLightProvider } from "./SunLightContext";
import { SunLightSource } from "./SunLightSource";

const CINEMATIC_CAMERA = new THREE.Vector3(MOON_CENTER.x, MOON_CENTER.y - 0.8, MOON_CENTER.z + 8.2);
const CINEMATIC_LOOK_AT = MOON_CENTER.clone();
const CINEMATIC_FOV = 40;

function SceneExposure({ target = 1.22 }: { target?: number }) {
  const { gl } = useThree();
  useFrame(() => {
    gl.toneMappingExposure = THREE.MathUtils.lerp(gl.toneMappingExposure, target, 0.06);
  });
  return null;
}

function MoonSceneContent({
  quality,
  reducedMotion,
  scrollProgress,
  flyMode = false,
  photoMode = false,
  onFlyModeExit,
  effectsEnabled = true,
}: {
  quality: QualityProfile;
  reducedMotion: boolean;
  scrollProgress: number;
  flyMode?: boolean;
  photoMode?: boolean;
  onFlyModeExit?: () => void;
  effectsEnabled?: boolean;
}) {
  const pointer = useScenePointer();
  const flyNavigation = flyMode && !reducedMotion;
  const { cameraFov, chromaticOffset, chromaticIntensity, chromaticModulation } = useSceneTuning();
  const cameraFovShift = cameraFov - DEFAULT_CAMERA_FOV;
  const applyCameraFov = (baseFov: number) => baseFov + cameraFovShift;
  const smoothedLook = useRef(CINEMATIC_LOOK_AT.clone());
  const cinematicCamScratch = useRef(CINEMATIC_CAMERA.clone());

  const cinematic = getCinematicPhases(scrollProgress);
  const bloomIntensity = 0.42 + cinematic.hyperspaceFlash * 1.35;
  const chromaScale =
    (1 + cinematic.hyperspaceFlash * 0.85) * Math.max(0, chromaticIntensity);
  const chromaOffset: [number, number] = [
    chromaticOffset[0] * chromaScale,
    chromaticOffset[1] * chromaScale,
  ];
  const bloomThreshold = 0.55;

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.exp(-4.8 * delta);

    if (flyNavigation) return;

    const pullBack = cinematic.deathStarRise * 0.9;
    const px = reducedMotion ? 0 : pointer.current.x * 0.02;
    const py = reducedMotion ? 0 : pointer.current.y * 0.012;

    cinematicCamScratch.current.copy(CINEMATIC_CAMERA);
    cinematicCamScratch.current.z += pullBack;
    cinematicCamScratch.current.x += px;
    cinematicCamScratch.current.y += py;

    cam.position.lerp(cinematicCamScratch.current, damp);
    cam.fov = THREE.MathUtils.lerp(cam.fov, applyCameraFov(CINEMATIC_FOV), damp);
    cam.updateProjectionMatrix();
    smoothedLook.current.lerp(CINEMATIC_LOOK_AT, damp);
    cam.lookAt(smoothedLook.current);
  });

  return (
    <SunLightProvider marsTravelProgress={0}>
      <HeroFlyControls
        enabled={flyNavigation}
        reducedMotion={reducedMotion}
        onRequestExit={onFlyModeExit}
      />
      <StrategySelectionCamera enabled={flyNavigation && !photoMode} />
      <SceneExposure target={1.22} />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0} />
      <SunLightSource reducedMotion={reducedMotion} />
      <group position={[MOON_CENTER.x, MOON_CENTER.y, MOON_CENTER.z]}>
        <Starfield reducedMotion={reducedMotion} />
      </group>

      <Suspense fallback={null}>
        <group position={MOON_POSITION}>
          <DeathStarFleet
            selectable={false}
            reducedMotion={reducedMotion}
            scrollProgress={scrollProgress}
            strategyEnabled={flyMode && !photoMode}
          />
        </group>
      </Suspense>

      {effectsEnabled && quality === "high" ? (
        <SafeEffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={bloomThreshold}
            luminanceSmoothing={0.88}
            intensity={bloomIntensity}
            mipmapBlur
            radius={0.7}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={chromaOffset}
            radialModulation
            modulationOffset={chromaticModulation}
          />
          <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.018} />
          <Vignette offset={0.28} darkness={0.65} eskil={false} />
        </SafeEffectComposer>
      ) : effectsEnabled ? (
        <SafeEffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.72}
            intensity={bloomIntensity * 0.75}
            mipmapBlur
            radius={0.45}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[chromaOffset[0] * 0.85, chromaOffset[1] * 0.85]}
            radialModulation
            modulationOffset={chromaticModulation * 0.72}
          />
          <Vignette offset={0.3} darkness={0.62} eskil={false} />
        </SafeEffectComposer>
      ) : null}
    </SunLightProvider>
  );
}

export default function MoonHeroScene({
  scrollProgress = 0,
  flyMode = false,
  photoMode = false,
  onFlyModeExit,
}: {
  scrollProgress?: number;
  flyMode?: boolean;
  photoMode?: boolean;
  onFlyModeExit?: () => void;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const quality = useQualityProfile();

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="absolute inset-0">
      {!glReady ? <div className="absolute inset-0 bg-black" aria-hidden /> : null}
      <Canvas
        className="pointer-events-auto absolute inset-0 h-full w-full touch-none"
        style={{
          width: "100%",
          height: "100%",
          ...(flyMode ? {} : { cursor: "default" }),
        }}
        camera={{
          position: [CINEMATIC_CAMERA.x, CINEMATIC_CAMERA.y, CINEMATIC_CAMERA.z],
          fov: CINEMATIC_FOV,
          near: 0.1,
          far: 480,
        }}
        gl={getStableGlConfig()}
        dpr={quality === "high" ? [1, 2] : [1, 1.25]}
        frameloop="always"
        onContextMenu={(event) => event.preventDefault()}
      >
        <GlCanvasLifecycle onGlReady={setGlReady} />
        <MoonSceneContent
          quality={quality}
          reducedMotion={reducedMotion}
          scrollProgress={reducedMotion ? 0 : scrollProgress}
          flyMode={flyMode}
          photoMode={photoMode}
          onFlyModeExit={onFlyModeExit}
          effectsEnabled={glReady}
        />
      </Canvas>
    </div>
  );
}
