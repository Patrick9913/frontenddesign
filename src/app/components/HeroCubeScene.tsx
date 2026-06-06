"use client";

import { Environment, Html, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { notifySceneUi, subscribeSceneStore, getSceneStoreVersion } from "../scene/SceneContext";
import { decayContactFlash, sceneStore } from "../scene/sceneStore";
import { getSectionMeta, type SiteSectionId } from "../scene/sections";
import { getQualitySettings, getStableGlConfig, useQualityProfile, type QualityProfile } from "./hero-scene/useQualityProfile";

const CUBE_SIZE = 1.65;
const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const PROJECT_IMAGES = ["/juridico.png", "/ecommerce.png", "/consultora.png", "/escuela.png"];

type HeroCubeSceneProps = {
  onExplore?: () => void;
};

function createVaporTexture(tint: "gray" | "yellow") {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const cx = 128;
  const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  gradient.addColorStop(0, "rgba(255,255,255,0.2)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.08)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.025)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  if (tint === "yellow") {
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(255, 210, 90, 0.6)";
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const vaporGrayTexture = createVaporTexture("gray");
const vaporStormTexture = createVaporTexture("yellow");

function fillEllipsoid(count: number, radiusX: number, radiusY: number, radiusZ: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 0.55);
    positions[i * 3] = radiusX * r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radiusY * r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radiusZ * r * Math.cos(phi);
    seeds[i * 3] = Math.random() * Math.PI * 2;
    seeds[i * 3 + 1] = 0.15 + Math.random() * 0.35;
    seeds[i * 3 + 2] = 0.2 + Math.random() * 0.45;
  }
  return { positions, seeds };
}

function lerpHex(a: string, b: string, t: number) {
  return new THREE.Color(a).lerp(new THREE.Color(b), t).getStyle();
}

type StormFlash = {
  active: boolean;
  life: number;
  maxLife: number;
  position: THREE.Vector3;
  peak: number;
};

function stormFlashStrength(t: number) {
  if (t < 0.08) return t / 0.08;
  if (t < 0.25) return 1;
  if (t < 0.55) return 0.35 + Math.sin((t - 0.25) * 22) * 0.25;
  return Math.max(0, (1 - t) / 0.45);
}

function getTheme(id: SiteSectionId) {
  return getSectionMeta(id).theme;
}

function CinematicCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const px = reducedMotion ? 0 : sceneStore.pointer.x * 0.1;
    const py = reducedMotion ? 0 : sceneStore.pointer.y * 0.06;

    let targetPos: [number, number, number];
    let targetLook: [number, number, number];
    let targetFov: number;

    if (sceneStore.activeSection === "hero" && !sceneStore.exploreMode) {
      const p = sceneStore.heroScrollProgress;
      targetPos = [px, py, 5.2 - p * 0.95];
      targetLook = [px * 0.3, py * 0.22, 0];
      targetFov = 42 - p * 3.5;
    } else {
      const base = getSectionMeta(sceneStore.activeSection).camera;
      const orbit = sceneStore.sectionProgress * Math.PI * 0.12;
      targetPos = [
        base.position[0] + Math.sin(orbit) * 0.25 + px * 0.35,
        base.position[1] + py * 0.25,
        base.position[2] + Math.cos(orbit) * 0.18,
      ];
      targetLook = [...base.lookAt];
      targetFov = base.fov;
    }

    cam.position.x = THREE.MathUtils.lerp(cam.position.x, targetPos[0], 0.055);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, targetPos[1], 0.055);
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetPos[2], 0.055);
    cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.055);
    cam.updateProjectionMatrix();
    lookAt.current.set(targetLook[0], targetLook[1], targetLook[2]);
    cam.lookAt(lookAt.current);
  });

  return null;
}

function CursorLight({ reducedMotion }: { reducedMotion: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const light = lightRef.current;
    if (!light || reducedMotion) return;
    light.position.set(sceneStore.pointer.x * 2.2, sceneStore.pointer.y * 1.6, 3.5);
    light.intensity = 0.06 + sceneStore.contactFillProgress * 0.14;
    light.color.setStyle(getTheme(sceneStore.activeSection).primary);
  });

  return <pointLight ref={lightRef} intensity={0.06} distance={6} decay={2} color="#F5C842" />;
}

function VaporWisps({
  count,
  radiusX,
  radiusY,
  radiusZ,
  size,
  opacity,
  color,
  map,
  reducedMotion,
}: {
  count: number;
  radiusX: number;
  radiusY: number;
  radiusZ: number;
  size: number;
  opacity: number;
  color: string;
  map: THREE.Texture | null;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions: base, seeds } = useMemo(() => fillEllipsoid(count, radiusX, radiusY, radiusZ), [count, radiusX, radiusY, radiusZ]);
  const working = useMemo(() => new Float32Array(base.length), [base]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const drift = reducedMotion ? 0 : 1;
      working[i3] = base[i3] + Math.sin(t * seeds[i3 + 1] + seeds[i3]) * 0.05 * drift;
      working[i3 + 1] = base[i3 + 1] + Math.cos(t * seeds[i3 + 2] + seeds[i3]) * 0.04 * drift;
      working[i3 + 2] = base[i3 + 2] + Math.sin(t * seeds[i3 + 1] * 0.7 + seeds[i3]) * 0.045 * drift;
    }
    attr.array.set(working);
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial map={map ?? undefined} color={color} size={size} transparent opacity={opacity} depthWrite={false} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function StormVapor({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { base, seeds, phases } = useMemo(() => {
    const cloud = fillEllipsoid(count, 1.35, 1.1, 1.35);
    const flickerPhases = new Float32Array(count);
    for (let i = 0; i < count; i++) flickerPhases[i] = Math.random() * Math.PI * 2;
    return { base: cloud.positions, seeds: cloud.seeds, phases: flickerPhases };
  }, [count]);
  const working = useMemo(() => new Float32Array(base.length), [base]);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    const points = pointsRef.current;
    if (!material || !points) return;
    const theme = getTheme(sceneStore.activeSection);
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    const drift = reducedMotion ? 0 : 1;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      working[i3] = base[i3] + Math.sin(t * seeds[i3 + 1] * 0.55 + seeds[i3]) * 0.035 * drift;
      working[i3 + 1] = base[i3 + 1] + Math.cos(t * seeds[i3 + 2] * 0.5 + seeds[i3]) * 0.03 * drift;
      working[i3 + 2] = base[i3 + 2] + Math.sin(t * seeds[i3 + 1] * 0.45 + seeds[i3]) * 0.032 * drift;
    }
    posAttr.array.set(working);
    posAttr.needsUpdate = true;
    const pulse = 0.78 + Math.sin(t * 0.65) * 0.14 + Math.sin(t * 0.23 + phases[0]) * 0.08;
    const boost = sceneStore.activeSection === "experience" && sceneStore.sectionProgress > 0.65 ? 1.35 : 1;
    material.opacity = 0.055 * pulse * boost;
    material.color.setStyle(theme.primary);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} map={vaporStormTexture ?? undefined} color="#F5C842" size={1.25} transparent opacity={0.055} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function SkillOrbitCubes({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const visible = sceneStore.activeSection === "skills" && sceneStore.exploreMode;
    group.visible = visible;
    if (!visible) return;
    if (!reducedMotion) group.rotation.y = clock.elapsedTime * 0.15;
    matsRef.current.forEach((mat, i) => {
      const active = sceneStore.activeSkillIndex === i;
      mat.color.set(active ? "#00E5FF" : "#141414");
      mat.emissive.set(active ? "#00E5FF" : "#000000");
      mat.emissiveIntensity = active ? 0.85 : 0;
    });
  });

  const offsets: [number, number, number][] = [
    [1.35, 0.5, 0],
    [-1.35, 0.5, 0],
    [0, -1.35, 0.5],
    [0, 1.35, -0.5],
  ];

  return (
    <group ref={groupRef} visible={false}>
      {offsets.map((pos, i) => (
        <mesh key={i} position={pos} scale={0.22}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            ref={(el) => {
              if (el) matsRef.current[i] = el;
            }}
            color="#141414"
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function CubeExploreHint({ onExplore }: { onExplore?: () => void }) {
  const hintRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (hintRef.current) {
      hintRef.current.visible = sceneStore.showExploreHint && !sceneStore.exploreMode;
    }
  });

  const activate = () => {
    sceneStore.exploreMode = true;
    notifySceneUi();
    onExplore?.();
  };

  return (
    <group ref={hintRef} visible={false}>
      <mesh
        position={[CUBE_SIZE * 0.52, 0.08, 0.02]}
        onClick={(e) => {
          e.stopPropagation();
          activate();
        }}
      >
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Html center distanceFactor={6.5} style={{ pointerEvents: "none" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              activate();
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-sm hover:scale-110"
            aria-label="Explorar el cubo"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
          >
            <span className="absolute inset-0 rounded-full border border-[#F5C842]/40 animate-ping opacity-60 motion-reduce:animate-none" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#F5C842] shadow-[0_0_12px_rgba(245,200,66,0.8)]" />
          </button>
        </Html>
      </mesh>
    </group>
  );
}

function PostFX({ quality }: { quality: QualityProfile }) {
  const explore = sceneStore.exploreMode ? 1 : 0;
  const bloomBoost = sceneStore.activeSection === "projects" ? 0.22 : 0;
  const settings = getQualitySettings(quality);

  if (quality === "low") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.78 - explore * 0.1} intensity={0.38 + explore * 0.12 + bloomBoost} mipmapBlur radius={0.55} />
        <Vignette offset={0.32} darkness={0.55} eskil={false} />
      </EffectComposer>
    );
  }

  if (quality === "medium") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.68 - explore * 0.1} intensity={0.5 + explore * 0.14 + bloomBoost} mipmapBlur radius={0.62} />
        <Vignette offset={0.32} darkness={0.58} eskil={false} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={settings.multisampling}>
      <Bloom
        luminanceThreshold={(quality === "ultra" ? 0.56 : 0.62) - explore * 0.12}
        intensity={(quality === "ultra" ? 0.72 : 0.62) + explore * 0.15 + bloomBoost}
        mipmapBlur
        radius={quality === "ultra" ? 0.85 : 0.78}
      />
      <Noise blendFunction={BlendFunction.OVERLAY} opacity={quality === "ultra" ? 0.04 : 0.035} />
      <Vignette offset={0.32} darkness={0.62} eskil={false} />
    </EffectComposer>
  );
}

function FloatingCubeScene({
  onExplore,
  quality,
  reducedMotion,
}: {
  onExplore?: () => void;
  quality: QualityProfile;
  reducedMotion: boolean;
}) {
  const vaporGroupRef = useRef<THREE.Group>(null);
  const cubeGroupRef = useRef<THREE.Group>(null);
  const cubeMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const wireframeRef = useRef<THREE.MeshBasicMaterial>(null);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const lastProjectIndex = useRef(-1);
  const projectTextureRef = useRef<THREE.Texture | null>(null);

  const isHigh = quality === "high" || quality === "ultra";
  const stormLightCount =
    quality === "ultra" ? 14 : quality === "high" ? 10 : quality === "medium" ? 7 : 5;
  const themePrimary = useRef(new THREE.Color());
  const themeSecondary = useRef(new THREE.Color());

  const stormFlashes = useRef<StormFlash[]>(
    Array.from({ length: 10 }, () => ({
      active: false,
      life: 0,
      maxLife: 1,
      position: new THREE.Vector3(),
      peak: 40,
    }))
  );

  useEffect(() => {
    if (reducedMotion) return;
    stormFlashes.current.slice(0, isHigh ? 3 : 2).forEach((flash, index) => {
      flash.position.set((Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.1, (Math.random() - 0.5) * 1.4);
      flash.active = true;
      flash.life = index * 0.12;
      flash.maxLife = 0.5 + Math.random() * 0.4;
      flash.peak = 32 + Math.random() * 42;
    });
  }, [reducedMotion, isHigh]);

  useFrame((state, delta) => {
    decayContactFlash(delta);
    const theme = getTheme(sceneStore.activeSection);
    themePrimary.current.setStyle(theme.primary);
    themeSecondary.current.setStyle(theme.secondary);

    if (ambientRef.current) {
      ambientRef.current.intensity = 0.045 + sceneStore.contactFillProgress * 0.04;
      ambientRef.current.color.setStyle(theme.ambient);
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = sceneStore.exploreMode ? 0.38 : 0.15;
      keyLightRef.current.color.copy(themePrimary.current);
    }
    if (innerLightRef.current) {
      innerLightRef.current.intensity = sceneStore.contactFillProgress * 1.2 + sceneStore.contactFlash * 2.5;
      innerLightRef.current.color.setStyle(sceneStore.contactFlash > 0 ? "#FFFFFF" : theme.primary);
    }

    if (sceneStore.activeSection === "projects" && lastProjectIndex.current !== sceneStore.activeProjectIndex) {
      lastProjectIndex.current = sceneStore.activeProjectIndex;
      const loader = new THREE.TextureLoader();
      loader.load(PROJECT_IMAGES[sceneStore.activeProjectIndex] ?? PROJECT_IMAGES[0], (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        projectTextureRef.current?.dispose();
        projectTextureRef.current = tex;
      });
    }

    if (cubeMaterialRef.current) {
      const mat = cubeMaterialRef.current;
      const skill = sceneStore.activeSkillIndex;
      mat.color.setStyle(skill >= 0 ? "#0a1520" : lerpHex("#111111", theme.ambient, sceneStore.exploreMode ? 0.35 : 0));
      mat.metalness = skill === 0 ? 0.75 : skill === 1 ? 0.55 : 0.42;
      mat.roughness = skill === 2 ? 0.15 : skill === 3 ? 0.62 : 0.48;
      mat.wireframe = skill === 2;
      mat.envMapIntensity = (isHigh ? 0.58 : 0.35) + (sceneStore.activeSection === "projects" ? 0.4 : 0);
      mat.map = sceneStore.activeSection === "projects" ? projectTextureRef.current : null;
    }
    if (wireframeRef.current) {
      wireframeRef.current.visible = sceneStore.activeSkillIndex === 2;
    }

    if (vaporGroupRef.current && !reducedMotion) {
      vaporGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        vaporGroupRef.current.rotation.y,
        sceneStore.pointer.x * 0.04 + sceneStore.heroScrollProgress * 0.06,
        0.04
      );
    }

    if (cubeGroupRef.current) {
      if (reducedMotion) {
        cubeGroupRef.current.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4);
      } else {
        const time = state.clock.elapsedTime;
        cubeGroupRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.25) * 0.04;
        cubeGroupRef.current.rotation.y += delta * (sceneStore.exploreMode ? 0.045 : 0.1);
        cubeGroupRef.current.rotation.z = Math.PI / 4;
        cubeGroupRef.current.position.y = Math.sin(time * 0.35) * 0.1;
        const scale = sceneStore.activeSection === "contact" ? 1 + sceneStore.contactFillProgress * 0.06 : 1;
        cubeGroupRef.current.scale.setScalar(scale);
      }
    }

    const stormChance = isHigh ? 0.032 : 0.022;
    stormFlashes.current.slice(0, stormLightCount).forEach((flash, index) => {
      const light = lightRefs.current[index];
      if (!light) return;
      if (!flash.active && !reducedMotion && Math.random() < stormChance) {
        flash.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.1, (Math.random() - 0.5) * 1.5);
        flash.active = true;
        flash.life = 0;
        flash.maxLife = 0.35 + Math.random() * 0.75;
        flash.peak = 28 + Math.random() * 58;
      }
      if (!flash.active) {
        light.intensity = 0;
        return;
      }
      flash.life += delta;
      const progress = flash.life / flash.maxLife;
      if (progress >= 1) {
        flash.active = false;
        light.intensity = 0;
        return;
      }
      light.position.copy(flash.position);
      light.intensity = stormFlashStrength(progress) * flash.peak;
      light.color.copy(index % 3 === 0 ? themeSecondary.current : themePrimary.current);
    });
  });

  const heroTheme = getTheme("hero");

  return (
    <>
      <CinematicCamera reducedMotion={reducedMotion} />
      <CursorLight reducedMotion={reducedMotion} />
      <ambientLight ref={ambientRef} intensity={0.045} color={heroTheme.ambient} />
      <pointLight ref={keyLightRef} position={[2, 1, 3]} intensity={0.15} color={heroTheme.primary} distance={12} decay={2} />
      <pointLight ref={innerLightRef} position={[0, 0, 0.2]} intensity={0} color="#FFB86C" distance={3.5} decay={2} />
      <fog attach="fog" args={["#000000", 7, 16]} />
      <Environment resolution={isHigh ? 256 : 128} background={false}>
        <Lightformer intensity={0.07} color={heroTheme.primary} position={[2, 1, 2]} rotation={[0.5, -0.8, 0]} scale={[2, 2, 1]} />
        <Lightformer intensity={0.05} color={heroTheme.accent} position={[-2.5, 1.5, -1]} rotation={[0.2, 0.6, 0]} scale={[2, 2, 1]} />
      </Environment>
      <group ref={vaporGroupRef}>
        <VaporWisps count={isHigh ? 75 : 38} radiusX={2.2} radiusY={1.7} radiusZ={2.1} size={isHigh ? 2.2 : 1.7} opacity={0.042} color="#9a9a9a" map={vaporGrayTexture} reducedMotion={reducedMotion} />
        <VaporWisps count={isHigh ? 50 : 26} radiusX={1.85} radiusY={1.45} radiusZ={1.75} size={isHigh ? 1.55 : 1.15} opacity={0.04} color="#b8b8b8" map={vaporGrayTexture} reducedMotion={reducedMotion} />
        <StormVapor count={isHigh ? 42 : 22} reducedMotion={reducedMotion} />
      </group>
      <group ref={cubeGroupRef} rotation={[Math.PI / 4, Math.PI / 4, Math.PI / 4]}>
        <mesh>
          <primitive object={cubeGeometry} attach="geometry" />
          <meshPhysicalMaterial ref={cubeMaterialRef} color="#111111" metalness={0.42} roughness={0.48} clearcoat={0.14} envMapIntensity={isHigh ? 0.58 : 0.35} />
        </mesh>
        <mesh scale={1.002}>
          <primitive object={cubeGeometry} attach="geometry" />
          <meshBasicMaterial ref={wireframeRef} color="#00E5FF" wireframe transparent opacity={0.35} visible={false} />
        </mesh>
        <CubeExploreHint onExplore={onExplore} />
      </group>
      <SkillOrbitCubes reducedMotion={reducedMotion} />
      {Array.from({ length: stormLightCount }).map((_, index) => (
        <pointLight
          key={index}
          ref={(el) => {
            lightRefs.current[index] = el;
          }}
          color={heroTheme.primary}
          intensity={0}
          distance={4}
          decay={1.6}
        />
      ))}
      <PostFX quality={quality} />
    </>
  );
}

function SceneCanvas({ onExplore }: HeroCubeSceneProps) {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const quality = useQualityProfile();
  const settings = getQualitySettings(quality);
  const glConfig = getStableGlConfig();

  useSyncExternalStore(subscribeSceneStore, getSceneStoreVersion, getSceneStoreVersion);

  useEffect(() => {
    setReady(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const interactive = sceneStore.showExploreHint || sceneStore.exploreMode;

  if (!ready) return <div className="absolute inset-0 bg-black" aria-hidden />;

  return (
    <Canvas
      className="absolute inset-0 h-full w-full touch-none"
      style={{ width: "100%", height: "100%", pointerEvents: interactive ? "auto" : "none" }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={glConfig}
      dpr={settings.dpr}
      frameloop="always"
    >
      <color attach="background" args={["#000000"]} />
      <FloatingCubeScene onExplore={onExplore} quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export default function HeroCubeScene(props: HeroCubeSceneProps) {
  return <SceneCanvas {...props} />;
}
