"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import {
  getStableGlConfig,
  useQualitySettings,
  type QualityProfile,
  type QualitySettings,
} from "../hero-scene/useQualityProfile";
import { useHeroCentralBody } from "../hero-scene/HeroCentralBodyContext";
import { useScenePointer } from "../hero-scene/useScenePointer";
import { GlCanvasLifecycle } from "./GlCanvasLifecycle";
import { SafeEffectComposer } from "./SafeEffectComposer";
import { getCinematicPhases } from "./cinematicPhases";
import { DeathStarFleet } from "./DeathStarFleet";
import { MoonMesh } from "./MoonMesh";
import { SpaceEnvironment } from "./SpaceEnvironment";
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

function MoonPostFx({
  settings,
  bloomIntensity,
  chromaOffset,
  chromaticModulation,
}: {
  settings: QualitySettings;
  bloomIntensity: number;
  chromaOffset: [number, number];
  chromaticModulation: number;
}) {
  const bloom = (
    <Bloom
      luminanceThreshold={settings.bloomThreshold}
      luminanceSmoothing={settings.bloomSmoothing}
      intensity={bloomIntensity}
      mipmapBlur
      radius={settings.bloomRadius}
    />
  );
  const vignette = (
    <Vignette
      offset={settings.vignetteOffset}
      darkness={settings.vignetteDarkness}
      eskil={false}
    />
  );

  if (settings.chromatic && settings.noise) {
    return (
      <SafeEffectComposer multisampling={settings.multisampling}>
        {bloom}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaOffset}
          radialModulation
          modulationOffset={chromaticModulation}
        />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={settings.noiseOpacity} />
        {vignette}
      </SafeEffectComposer>
    );
  }

  if (settings.chromatic) {
    return (
      <SafeEffectComposer multisampling={settings.multisampling}>
        {bloom}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaOffset}
          radialModulation
          modulationOffset={chromaticModulation}
        />
        {vignette}
      </SafeEffectComposer>
    );
  }

  return (
    <SafeEffectComposer multisampling={settings.multisampling}>
      {bloom}
      {vignette}
    </SafeEffectComposer>
  );
}

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
  const { settings } = useQualitySettings();
  const { isMoon, isDeathStar } = useHeroCentralBody();
  const pointer = useScenePointer();
  const flyNavigation = flyMode && !reducedMotion;
  const { cameraFov, chromaticOffset, chromaticIntensity, chromaticModulation, starsVisible } =
    useSceneTuning();
  const cameraFovShift = cameraFov - DEFAULT_CAMERA_FOV;
  const applyCameraFov = (baseFov: number) => baseFov + cameraFovShift;
  const smoothedLook = useRef(CINEMATIC_LOOK_AT.clone());
  const cinematicCamScratch = useRef(CINEMATIC_CAMERA.clone());

  const cinematic = getCinematicPhases(isDeathStar ? scrollProgress : 0);
  const bloomIntensity =
    (0.42 + cinematic.hyperspaceFlash * 1.35) * settings.bloomIntensityScale;
  const chromaScale =
    (1 + cinematic.hyperspaceFlash * 0.85) * Math.max(0, chromaticIntensity);
  const chromaOffset: [number, number] = [
    chromaticOffset[0] * chromaScale,
    chromaticOffset[1] * chromaScale,
  ];

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.exp(-4.8 * delta);

    if (flyNavigation) return;

    const pullBack = isDeathStar ? cinematic.deathStarRise * 0.9 : 0;
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
      <StrategySelectionCamera enabled={flyNavigation && !photoMode && isDeathStar} />
      <SceneExposure target={settings.exposure} />
      <SpaceEnvironment
        enabled={settings.environment}
        intensity={settings.environmentIntensity}
      />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0} />
      <SunLightSource reducedMotion={reducedMotion} />
      {starsVisible ? (
        <group position={[MOON_CENTER.x, MOON_CENTER.y, MOON_CENTER.z]}>
          <Starfield
            key={`stars-${quality}`}
            count={settings.starCount}
            starSize={settings.starSize}
            opacity={settings.starOpacity}
            reducedMotion={reducedMotion}
          />
        </group>
      ) : null}

      <Suspense fallback={null}>
        <group position={MOON_POSITION}>
          {isMoon ? (
            <MoonMesh reducedMotion={reducedMotion} />
          ) : (
            <DeathStarFleet
              selectable={false}
              reducedMotion={reducedMotion}
              scrollProgress={scrollProgress}
              strategyEnabled={flyMode && !photoMode && isDeathStar}
            />
          )}
        </group>
      </Suspense>

      {effectsEnabled ? (
        <MoonPostFx
          settings={settings}
          bloomIntensity={bloomIntensity}
          chromaOffset={chromaOffset}
          chromaticModulation={chromaticModulation}
        />
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
  const { quality, settings } = useQualitySettings();
  const canvasKey = settings.canvasAntialias ? "aa" : "no-aa";

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="absolute inset-0">
      {!glReady ? <div className="absolute inset-0 bg-black" aria-hidden /> : null}
      <Canvas
        key={canvasKey}
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
        dpr={settings.dpr}
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
