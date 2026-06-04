"use client";

import { Outlines, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { getStableGlConfig, useQualityProfile, type QualityProfile } from "../hero-scene/useQualityProfile";
import { GlCanvasLifecycle } from "./GlCanvasLifecycle";
import { SafeEffectComposer } from "./SafeEffectComposer";
import { useScenePointer } from "../hero-scene/useScenePointer";
import { MYSTERY_LIGHTS, mysteryLightSurfacePosition } from "./moonDarkSideLights";
import { MarsAsteroid } from "./MarsAsteroid";
import { SunLightProvider, useSunLightContext } from "./SunLightContext";
import { SunLightSource } from "./SunLightSource";
import { getPlanetLightDirection } from "./sunLighting";
import {
  MARS_CENTER,
  MARS_POSITION,
  MARS_RADIUS,
  MARS_VIEW_CAMERA,
  MARS_VIEW_FOV,
  MARS_VIEW_LOOK_AT,
  getMarsTravelCamera,
  getMarsTravelFov,
  getMarsTravelLookAt,
} from "./marsCameraPath";
import {
  DARK_SIDE_CAMERA,
  DARK_SIDE_FOV,
  DARK_SIDE_LOOK_AT,
  MOON_CENTER,
  MOON_POSITION,
  MOON_RADIUS,
} from "./moonSceneConstants";
import {
  getArcCameraPosition,
  getArcLookBlend,
  getDarkSideCameraOffset,
  getPhase1EndCameraOffset,
  PHASE1_CAMERA_X,
  PHASE1_CAMERA_Z_FAR,
  PHASE1_CAMERA_Z_NEAR,
  PHASE1_LOOK_AT,
  PHASE1_LOOK_AT_X,
} from "./moonCameraPath";
import { MOON_LORE_CAMERA, MOON_LORE_FOV, MOON_LORE_LOOK_AT } from "./moonLoreView";
import { getHeroScrollPhases } from "./useHeroScroll";
import { HeroFlyControls } from "./useHeroFlyControls";
import { useRightDragCameraLook } from "./useRightDragCameraLook";
import {
  offsetToSpherical,
  sphericalToOffset,
  usePlanetOrbitControl,
  type PlanetOrbitTarget,
} from "./useMoonOrbitControl";

const MARS_ORBIT_READY = 0.999;

const CAMERA_Z_NEAR = PHASE1_CAMERA_Z_NEAR;
const CAMERA_Z_FAR = PHASE1_CAMERA_Z_FAR;
const CAMERA_FOV_NEAR = 38;
const CAMERA_FOV_FAR = 43;
/** Fase 2 solo orbita; el FOV se mantiene en este valor (sin zoom extra). */
const PHASE2_FOV = DARK_SIDE_FOV;
const SCENE_LOOK_AT: [number, number, number] = [
  PHASE1_LOOK_AT.x,
  PHASE1_LOOK_AT.y,
  PHASE1_LOOK_AT.z,
];
const CAMERA_X = PHASE1_CAMERA_X;
const phase1EndOffset = getPhase1EndCameraOffset(CAMERA_X, CAMERA_Z_FAR);
const darkSideOffset = getDarkSideCameraOffset();
const arcCameraScratch = new THREE.Vector3();
const phase1EndCamScratch = new THREE.Vector3();
const CHROMATIC_ABERRATION_OFFSET: [number, number] = [0.0042, 0.0015];

/** Contorno al hover — fino y tenue para Luna y Marte. */
function PlanetHoverOutline({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Outlines
      color="#fff8f2"
      thickness={0.0075}
      screenspace
      opacity={0.34}
      angle={Math.PI}
      transparent
      toneMapped={false}
    />
  );
}

function applyHardTerminator(
  material: THREE.MeshStandardMaterial,
  cacheKey: string,
  lightDirection: THREE.Vector3,
  uniformName: "uMoonLightDir" | "uMarsLightDir"
) {
  material.customProgramCacheKey = () => cacheKey;

  material.onBeforeCompile = (shader) => {
    shader.uniforms[uniformName] = { value: lightDirection.clone() };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vMoonWorldNormal;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      `#include <beginnormal_vertex>
      vMoonWorldNormal = normalize(normalMatrix * objectNormal);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vMoonWorldNormal;
      uniform vec3 ${uniformName};`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <output_fragment>",
      `float moonFacing = dot(normalize(vMoonWorldNormal), normalize(${uniformName}));
      if (moonFacing < 0.018) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      } else {
        #include <output_fragment>
        float moonLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float terminatorBand = smoothstep(0.95, 0.02, moonFacing);
        float caMask = terminatorBand * smoothstep(0.22, 0.88, moonLum);
        float ca = caMask * 0.32;
        gl_FragColor.r = min(gl_FragColor.r + ca * 1.75, 1.0);
        gl_FragColor.g = gl_FragColor.g + ca * 0.04;
        gl_FragColor.b = max(gl_FragColor.b - ca * 1.55, 0.0);
      }`
    );

    material.userData.shader = shader;
    material.userData.lightUniform = uniformName;
  };
}

function PlanetSurfaceMaterial({
  map,
  bumpMap,
  bumpScale,
  planetCenter,
  cacheKey,
  uniformName,
}: {
  map: THREE.Texture;
  bumpMap?: THREE.Texture;
  bumpScale: number;
  planetCenter: THREE.Vector3;
  cacheKey: string;
  uniformName: "uMoonLightDir" | "uMarsLightDir";
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightDirection = useRef(new THREE.Vector3());
  const { registerMaterial } = useSunLightContext();

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    getPlanetLightDirection(planetCenter, lightDirection.current);
    applyHardTerminator(material, cacheKey, lightDirection.current, uniformName);
    material.needsUpdate = true;

    return registerMaterial({
      material,
      planetCenter,
      uniformName,
    });
  }, [cacheKey, map, planetCenter, uniformName, registerMaterial]);

  return (
    <meshStandardMaterial
      ref={materialRef}
      map={map}
      bumpMap={bumpMap ?? map}
      bumpScale={bumpScale}
      roughness={0.95}
      metalness={0}
      color="#ffffff"
      envMapIntensity={0}
    />
  );
}

function MoonSurfaceMaterial({ map }: { map: THREE.Texture }) {
  return (
    <PlanetSurfaceMaterial
      map={map}
      bumpScale={0.15}
      planetCenter={MOON_CENTER}
      cacheKey="moon-hard-terminator-v5-sun-unified"
      uniformName="uMoonLightDir"
    />
  );
}

function configureTexture(texture: THREE.Texture, anisotropy: number) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
}

function SceneExposure({ target = 1.22 }: { target?: number }) {
  const { gl } = useThree();
  useFrame(() => {
    gl.toneMappingExposure = THREE.MathUtils.lerp(gl.toneMappingExposure, target, 0.06);
  });
  return null;
}

function MysteryLightPoint({
  direction,
  color,
  size,
  pulse,
  delay,
  visibility,
  reducedMotion,
}: {
  direction: [number, number, number];
  color: string;
  size: number;
  pulse: number;
  delay: number;
  visibility: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => mysteryLightSurfacePosition(direction, MOON_RADIUS), [direction]);
  const quaternion = useMemo(() => {
    const normal = new THREE.Vector3(...direction).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [direction]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const flicker = reducedMotion
      ? 1
      : 0.55 + Math.sin(clock.elapsedTime * pulse + delay) * 0.22 + Math.sin(clock.elapsedTime * pulse * 2.4 + delay * 1.7) * 0.12;
    meshRef.current.scale.setScalar(size * flicker);
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = visibility * flicker;
  });

  if (visibility <= 0.001) return null;

  return (
    <mesh ref={meshRef} position={position} quaternion={quaternion} renderOrder={2}>
      <circleGeometry args={[1, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={visibility}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function DarkSideMysteryLights({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      {MYSTERY_LIGHTS.map((light) => (
        <MysteryLightPoint
          key={`${light.direction.join("-")}-${light.delay}`}
          {...light}
          visibility={1}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

/** ~110 s por vuelta completa — rotación marciana lenta y visible. */
const MARS_ROTATION_SPEED = 0.057;

function MarsMesh({
  quality,
  reducedMotion,
  outlineOnHover = true,
}: {
  quality: QualityProfile;
  reducedMotion: boolean;
  outlineOnHover?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorMap = useTexture("/textures/mars_color.jpg");
  const segments = quality === "high" ? 160 : 112;
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    configureTexture(colorMap, 16);
  }, [colorMap]);

  useFrame((_, delta) => {
    if (reducedMotion || !meshRef.current) return;
    meshRef.current.rotation.y += delta * MARS_ROTATION_SPEED;
  });

  return (
    <mesh
      onPointerOver={(event) => {
        if (!outlineOnHover || reducedMotion) return;
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <sphereGeometry args={[MARS_RADIUS, segments, segments]} />
      <PlanetSurfaceMaterial
        map={colorMap}
        bumpScale={0.2}
        planetCenter={MARS_CENTER}
        cacheKey="mars-hard-terminator-v3-sun-unified"
        uniformName="uMarsLightDir"
      />
      <PlanetHoverOutline visible={outlineOnHover && hovered && !reducedMotion} />
    </mesh>
  );
}

function MoonMesh({
  quality,
  selectable,
  onSelect,
}: {
  quality: QualityProfile;
  selectable: boolean;
  onSelect?: () => void;
}) {
  const { gl } = useThree();
  const colorMap = useTexture("/textures/moon_color.jpg");
  const segments = quality === "high" ? 192 : 128;
  const [hovered, setHovered] = useState(false);
  const showOutline = selectable && hovered;

  useEffect(() => {
    configureTexture(colorMap, 16);
  }, [colorMap]);

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

  return (
    <mesh
      onClick={(event) => {
        if (!selectable) return;
        event.stopPropagation();
        onSelect?.();
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[MOON_RADIUS, segments, segments]} />
      <MoonSurfaceMaterial map={colorMap} />
      <PlanetHoverOutline visible={showOutline} />
    </mesh>
  );
}

const marsTravelCamScratch = new THREE.Vector3();
const marsTravelLookScratch = new THREE.Vector3();

function MoonSceneContent({
  quality,
  reducedMotion,
  scrollProgress,
  marsTravelProgress = 0,
  flyMode = false,
  onFlyModeExit,
  effectsEnabled = true,
  moonLoreOpen = false,
  onMoonLoreOpen,
  moonInspectable = false,
}: {
  quality: QualityProfile;
  reducedMotion: boolean;
  scrollProgress: number;
  marsTravelProgress?: number;
  flyMode?: boolean;
  onFlyModeExit?: () => void;
  effectsEnabled?: boolean;
  moonLoreOpen?: boolean;
  onMoonLoreOpen?: () => void;
  moonInspectable?: boolean;
}) {
  const pointer = useScenePointer();
  const flyNavigation = flyMode && !reducedMotion;
  const marsTravel = marsTravelProgress > 0.001;
  const moonSelectable =
    moonInspectable && !marsTravel && !reducedMotion && typeof onMoonLoreOpen === "function";
  const orbitTarget: PlanetOrbitTarget =
    flyNavigation || moonLoreOpen
    ? null
    : marsTravelProgress >= MARS_ORBIT_READY
      ? "mars"
      : marsTravelProgress > 0.001
        ? null
        : "moon";
  const orbitOffset = usePlanetOrbitControl(reducedMotion, orbitTarget);
  const targetCam = useRef(new THREE.Vector3(CAMERA_X, 0, CAMERA_Z_NEAR));
  const targetLook = useRef(new THREE.Vector3(SCENE_LOOK_AT[0], SCENE_LOOK_AT[1], SCENE_LOOK_AT[2]));
  const orbitedCam = useRef(new THREE.Vector3());
  const orbitedLook = useRef(new THREE.Vector3());
  const smoothedLook = useRef(
    new THREE.Vector3(PHASE1_LOOK_AT_X, PHASE1_LOOK_AT.y, PHASE1_LOOK_AT.z)
  );
  const relativeOffset = useRef(new THREE.Vector3());
  const { phase1, phase2, phase2Raw, phase2Locked } = getHeroScrollPhases(scrollProgress);
  const bloomIntensity = 0.72 * (1 - phase1 * 0.38) + phase2 * 0.48;
  const chromaScale = (1 - phase1 * 0.35) * (1 - phase2 * 0.25);
  const bloomThreshold = THREE.MathUtils.lerp(0.82, 0.28, phase2);

  const moonLoreLookScratch = useRef(MOON_LORE_LOOK_AT.clone());
  const moonLoreViewSynced = useRef(false);

  useRightDragCameraLook(
    moonLoreOpen && !marsTravel && marsTravelProgress < MARS_ORBIT_READY,
    reducedMotion
  );

  useEffect(() => {
    if (!moonLoreOpen) moonLoreViewSynced.current = false;
  }, [moonLoreOpen]);

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.exp(-5.5 * delta);
    const marsOrbitReady = marsTravelProgress >= MARS_ORBIT_READY;

    if (moonLoreOpen && !marsTravel && !marsOrbitReady) {
      const loreDamp = 1 - Math.exp(-4.2 * delta);
      cam.position.lerp(MOON_LORE_CAMERA, loreDamp);
      cam.fov = THREE.MathUtils.lerp(cam.fov, MOON_LORE_FOV, loreDamp);
      cam.updateProjectionMatrix();

      if (!moonLoreViewSynced.current) {
        cam.position.copy(MOON_LORE_CAMERA);
        cam.lookAt(moonLoreLookScratch.current.copy(MOON_LORE_LOOK_AT));
        moonLoreViewSynced.current = true;
      }

      return;
    }

    if (flyNavigation) return;

    if (marsOrbitReady) {
      relativeOffset.current.copy(MARS_VIEW_CAMERA).sub(MARS_CENTER);
      const baseOrbit = offsetToSpherical(relativeOffset.current);
      const manualAzimuth = baseOrbit.azimuth + orbitOffset.current.azimuth;
      const manualElevation = baseOrbit.elevation + orbitOffset.current.elevation;
      orbitedCam.current
        .copy(sphericalToOffset(baseOrbit.radius, manualAzimuth, manualElevation))
        .add(MARS_CENTER);

      const orbitAmount = Math.min(
        1,
        Math.hypot(orbitOffset.current.azimuth, orbitOffset.current.elevation) * 5
      );
      orbitedLook.current.copy(MARS_VIEW_LOOK_AT).lerp(MARS_CENTER, orbitAmount * 0.4);

      const followStrength = THREE.MathUtils.lerp(damp, Math.min(1, damp * 2.4), orbitAmount);
      cam.position.lerp(orbitedCam.current, followStrength);
      cam.fov = THREE.MathUtils.lerp(cam.fov, MARS_VIEW_FOV, damp);
      cam.updateProjectionMatrix();
      smoothedLook.current.lerp(orbitedLook.current, damp);
      cam.lookAt(smoothedLook.current);
      return;
    }

    if (marsTravel) {
      getMarsTravelCamera(DARK_SIDE_CAMERA, marsTravelProgress, marsTravelCamScratch);
      getMarsTravelLookAt(DARK_SIDE_LOOK_AT, marsTravelProgress, marsTravelLookScratch);
      const marsFov = getMarsTravelFov(marsTravelProgress);
      const travelDamp = 1 - Math.exp(-4.2 * delta);

      cam.position.lerp(marsTravelCamScratch, travelDamp);
      smoothedLook.current.lerp(marsTravelLookScratch, travelDamp);
      cam.fov = THREE.MathUtils.lerp(cam.fov, marsFov, travelDamp);
      cam.updateProjectionMatrix();
      cam.lookAt(smoothedLook.current);
      return;
    }

    const parallax = (1 - phase1 * 0.7) * (1 - phase2 * 0.92);
    const px = reducedMotion ? 0 : pointer.current.x * 0.03 * parallax;
    const py = reducedMotion ? 0 : pointer.current.y * 0.018 * parallax;

    const phase1Cam = new THREE.Vector3(
      CAMERA_X + px,
      py,
      THREE.MathUtils.lerp(CAMERA_Z_NEAR, CAMERA_Z_FAR, phase1)
    );
    const phase1Look = new THREE.Vector3(
      THREE.MathUtils.lerp(SCENE_LOOK_AT[0], PHASE1_LOOK_AT_X, phase1),
      SCENE_LOOK_AT[1],
      SCENE_LOOK_AT[2]
    );
    const phase1EndFov = THREE.MathUtils.lerp(CAMERA_FOV_NEAR, CAMERA_FOV_FAR, phase1);

    let phase2Cam: THREE.Vector3;
    const arcProgress = phase2Locked ? 1 : phase2;
    getArcCameraPosition(phase1EndOffset, darkSideOffset, arcProgress, arcCameraScratch);

    if (phase2Raw > 0) {
      const phase1EndCam = phase1EndCamScratch.set(CAMERA_X + px, py, CAMERA_Z_FAR);
      const entryBlend = THREE.MathUtils.smoothstep(phase2Raw, 0, 0.14);
      phase2Cam = phase1EndCam.clone().lerp(arcCameraScratch, entryBlend);
      phase2Cam.add(new THREE.Vector3(px * 0.06, py * 0.06, 0));
    } else {
      phase2Cam = phase1Cam;
    }

    const phase2Look = DARK_SIDE_LOOK_AT.clone();

    if (phase2Raw <= 0) {
      targetCam.current.copy(phase1Cam);
      targetLook.current.copy(phase1Look);
    } else {
      targetCam.current.copy(phase2Cam);
      targetLook.current.copy(phase1Look).lerp(phase2Look, getArcLookBlend(arcProgress));
    }

    const targetFov =
      phase2Raw > 0
        ? THREE.MathUtils.lerp(phase1EndFov, PHASE2_FOV, getArcLookBlend(arcProgress))
        : phase1EndFov;

    relativeOffset.current.copy(targetCam.current).sub(MOON_CENTER);
    const baseOrbit = offsetToSpherical(relativeOffset.current);
    const manualAzimuth = baseOrbit.azimuth + orbitOffset.current.azimuth;
    const manualElevation = baseOrbit.elevation + orbitOffset.current.elevation;
    orbitedCam.current.copy(sphericalToOffset(baseOrbit.radius, manualAzimuth, manualElevation)).add(MOON_CENTER);

    const orbitAmount = Math.min(
      1,
      Math.hypot(orbitOffset.current.azimuth, orbitOffset.current.elevation) * 5
    );
    orbitedLook.current.copy(targetLook.current).lerp(DARK_SIDE_LOOK_AT, orbitAmount * 0.35);

    const followStrength = THREE.MathUtils.lerp(damp, Math.min(1, damp * 2.4), orbitAmount);
    cam.position.lerp(orbitedCam.current, followStrength);
    cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, damp);
    cam.updateProjectionMatrix();
    smoothedLook.current.lerp(orbitedLook.current, damp);
    cam.lookAt(smoothedLook.current);
  });

  return (
    <SunLightProvider marsTravelProgress={marsTravelProgress}>
      <HeroFlyControls
        enabled={flyNavigation && !moonLoreOpen}
        reducedMotion={reducedMotion}
        onRequestExit={onFlyModeExit}
      />
      <SceneExposure target={1.22} />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0} />
      <SunLightSource reducedMotion={reducedMotion} />

      <Suspense fallback={null}>
        <group position={MARS_POSITION}>
          <MarsMesh
            quality={quality}
            reducedMotion={reducedMotion}
            outlineOnHover={!marsTravel}
          />
          <MarsAsteroid
            reducedMotion={reducedMotion}
            visible={marsTravelProgress > 0.12}
          />
        </group>
        <group position={MOON_POSITION}>
          <MoonMesh quality={quality} selectable={moonSelectable} onSelect={onMoonLoreOpen} />
          <DarkSideMysteryLights reducedMotion={reducedMotion} />
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
            offset={[
              CHROMATIC_ABERRATION_OFFSET[0] * chromaScale,
              CHROMATIC_ABERRATION_OFFSET[1] * chromaScale,
            ]}
            radialModulation
            modulationOffset={0.25}
          />
          <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.018} />
          <Vignette offset={0.28} darkness={0.65} eskil={false} />
        </SafeEffectComposer>
      ) : effectsEnabled ? (
        <SafeEffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={THREE.MathUtils.lerp(0.85, 0.32, phase2)}
            intensity={0.45 * (1 - phase1 * 0.3) + phase2 * 0.35}
            mipmapBlur
            radius={0.45}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[
              CHROMATIC_ABERRATION_OFFSET[0] * 0.85 * chromaScale,
              CHROMATIC_ABERRATION_OFFSET[1] * 0.85 * chromaScale,
            ]}
            radialModulation
            modulationOffset={0.18}
          />
          <Vignette offset={0.3} darkness={0.62} eskil={false} />
        </SafeEffectComposer>
      ) : null}
    </SunLightProvider>
  );
}

export default function MoonHeroScene({
  scrollProgress = 0,
  marsTravelProgress = 0,
  flyMode = false,
  onFlyModeExit,
  moonLoreOpen = false,
  onMoonLoreOpen,
  moonInspectable = false,
}: {
  scrollProgress?: number;
  marsTravelProgress?: number;
  flyMode?: boolean;
  onFlyModeExit?: () => void;
  moonLoreOpen?: boolean;
  onMoonLoreOpen?: () => void;
  moonInspectable?: boolean;
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
        camera={{ position: [CAMERA_X, 0, CAMERA_Z_NEAR], fov: CAMERA_FOV_NEAR, near: 0.1, far: 480 }}
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
          marsTravelProgress={reducedMotion ? 0 : marsTravelProgress}
          flyMode={flyMode}
          onFlyModeExit={onFlyModeExit}
          moonLoreOpen={moonLoreOpen}
          onMoonLoreOpen={onMoonLoreOpen}
          moonInspectable={moonInspectable}
          effectsEnabled={glReady}
        />
      </Canvas>
    </div>
  );
}
