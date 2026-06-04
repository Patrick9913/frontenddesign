"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { getStableGlConfig, useQualityProfile, type QualityProfile } from "../hero-scene/useQualityProfile";
import { useScenePointer } from "../hero-scene/useScenePointer";
import { MYSTERY_LIGHTS, mysteryLightSurfacePosition } from "./moonDarkSideLights";
import { IncandescentSun, SUN_POSITION } from "./IncandescentSun";
import {
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
} from "./moonCameraPath";
import { getHeroScrollPhases } from "./useHeroScroll";
import {
  offsetToSpherical,
  sphericalToOffset,
  useMoonOrbitControl,
} from "./useMoonOrbitControl";

const CAMERA_Z_NEAR = 5.4;
const CAMERA_Z_FAR = 7.65;
const CAMERA_FOV_NEAR = 38;
const CAMERA_FOV_FAR = 43;
/** Fase 2 solo orbita; el FOV se mantiene en este valor (sin zoom extra). */
const PHASE2_FOV = DARK_SIDE_FOV;
/** Punto de mira fase 1 → la luna queda anclada al borde izquierdo del viewport. */
const SCENE_LOOK_AT: [number, number, number] = [0.62, 0, 0];
const CAMERA_X = SCENE_LOOK_AT[0];
const phase1EndOffset = getPhase1EndCameraOffset(CAMERA_X, CAMERA_Z_FAR);
const darkSideOffset = getDarkSideCameraOffset();
const arcCameraScratch = new THREE.Vector3();
const phase1EndCamScratch = new THREE.Vector3();
const MOON_LIGHT_POSITION = new THREE.Vector3(...SUN_POSITION);
const CHROMATIC_ABERRATION_OFFSET: [number, number] = [0.0042, 0.0015];
const moonLightDirection = new THREE.Vector3()
  .copy(MOON_LIGHT_POSITION)
  .sub(new THREE.Vector3(...MOON_POSITION))
  .normalize();

function applyHardTerminator(material: THREE.MeshStandardMaterial) {
  material.customProgramCacheKey = () => "moon-hard-terminator-v3-chroma-strong";

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uMoonLightDir = { value: moonLightDirection.clone() };

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
      uniform vec3 uMoonLightDir;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <output_fragment>",
      `float moonFacing = dot(normalize(vMoonWorldNormal), normalize(uMoonLightDir));
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
  };
}

function MoonSurfaceMaterial({ map }: { map: THREE.Texture }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    applyHardTerminator(material);
    material.needsUpdate = true;
  }, [map]);

  useFrame(() => {
    const material = materialRef.current;
    const shader = material?.userData.shader as { uniforms: { uMoonLightDir: { value: THREE.Vector3 } } } | undefined;
    if (shader) {
      shader.uniforms.uMoonLightDir.value.copy(moonLightDirection);
    }
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      map={map}
      bumpMap={map}
      bumpScale={0.15}
      roughness={0.95}
      metalness={0}
      color="#ffffff"
      envMapIntensity={0}
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

function DarkSideMysteryLights({
  phase2,
  reducedMotion,
}: {
  phase2: number;
  reducedMotion: boolean;
}) {
  const visibility = THREE.MathUtils.clamp((phase2 - 0.1) / 0.55, 0, 1);

  if (visibility <= 0.001) return null;

  return (
    <group>
      {MYSTERY_LIGHTS.map((light) => (
        <MysteryLightPoint
          key={`${light.direction.join("-")}-${light.delay}`}
          {...light}
          visibility={visibility}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

function MoonMesh({ quality }: { quality: QualityProfile }) {
  const colorMap = useTexture("/textures/moon_color.jpg");
  const segments = quality === "high" ? 192 : 128;

  useEffect(() => {
    configureTexture(colorMap, 16);
  }, [colorMap]);

  return (
    <mesh>
      <sphereGeometry args={[MOON_RADIUS, segments, segments]} />
      <MoonSurfaceMaterial map={colorMap} />
    </mesh>
  );
}

function MoonSceneContent({
  quality,
  reducedMotion,
  scrollProgress,
}: {
  quality: QualityProfile;
  reducedMotion: boolean;
  scrollProgress: number;
}) {
  const pointer = useScenePointer();
  const orbitOffset = useMoonOrbitControl(reducedMotion);
  const targetCam = useRef(new THREE.Vector3(CAMERA_X, 0, CAMERA_Z_NEAR));
  const targetLook = useRef(new THREE.Vector3(SCENE_LOOK_AT[0], SCENE_LOOK_AT[1], SCENE_LOOK_AT[2]));
  const orbitedCam = useRef(new THREE.Vector3());
  const orbitedLook = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3(0.38, 0, 0));
  const relativeOffset = useRef(new THREE.Vector3());
  const { phase1, phase2, phase2Raw, phase2Locked } = getHeroScrollPhases(scrollProgress);
  const bloomIntensity = 0.72 * (1 - phase1 * 0.38) + phase2 * 0.48;
  const chromaScale = (1 - phase1 * 0.35) * (1 - phase2 * 0.25);
  const bloomThreshold = THREE.MathUtils.lerp(0.82, 0.28, phase2);

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const damp = 1 - Math.exp(-5.5 * delta);

    const parallax = (1 - phase1 * 0.7) * (1 - phase2 * 0.92);
    const px = reducedMotion ? 0 : pointer.current.x * 0.03 * parallax;
    const py = reducedMotion ? 0 : pointer.current.y * 0.018 * parallax;

    const phase1Cam = new THREE.Vector3(
      CAMERA_X + px,
      py,
      THREE.MathUtils.lerp(CAMERA_Z_NEAR, CAMERA_Z_FAR, phase1)
    );
    const phase1Look = new THREE.Vector3(
      THREE.MathUtils.lerp(SCENE_LOOK_AT[0], 0.38, phase1),
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
    <>
      <SceneExposure target={1.22} />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0} />
      <directionalLight position={SUN_POSITION} intensity={7.5} color="#ffffff" />
      <IncandescentSun reducedMotion={reducedMotion} />

      <Suspense fallback={null}>
        <group position={MOON_POSITION}>
          <MoonMesh quality={quality} />
          <DarkSideMysteryLights phase2={phase2} reducedMotion={reducedMotion} />
        </group>
      </Suspense>

      {quality === "high" ? (
        <EffectComposer multisampling={0}>
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
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={0}>
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
        </EffectComposer>
      )}
    </>
  );
}

export default function MoonHeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const quality = useQualityProfile();
  const glConfig = getStableGlConfig();

  useEffect(() => {
    setReady(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!ready) {
    return <div className="absolute inset-0 bg-black" aria-hidden />;
  }

  return (
    <Canvas
      className="pointer-events-auto absolute inset-0 h-full w-full touch-none"
      style={{ width: "100%", height: "100%", cursor: "default" }}
      camera={{ position: [CAMERA_X, 0, CAMERA_Z_NEAR], fov: CAMERA_FOV_NEAR, near: 0.1, far: 100 }}
      gl={glConfig}
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      frameloop="always"
      onContextMenu={(event) => event.preventDefault()}
    >
      <MoonSceneContent
        quality={quality}
        reducedMotion={reducedMotion}
        scrollProgress={reducedMotion ? 0 : scrollProgress}
      />
    </Canvas>
  );
}
