"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createHaloRing } from "./createHaloRing";

interface GlobalBackgroundProps {
  activeSection: number;
  isPaused: boolean;
}

interface SectionConfig {
  cameraPos: { x: number; y: number; z: number };
  lookAtPos: { x: number; y: number; z: number };
  haloPos: { x: number; y: number; z: number };
  haloRotationSpeed: number;
  particleOpacity: number;
  fogDensity: number;
}

const SECTION_CONFIGS: SectionConfig[] = [
  // 0: Hero (Inicio)
  {
    cameraPos: { x: 0, y: 0.3, z: 9 },
    lookAtPos: { x: 0.8, y: 0, z: -1.5 },
    haloPos: { x: 0.8, y: 0, z: -1.5 },
    haloRotationSpeed: 0.04,
    particleOpacity: 0.45,
    fogDensity: 0.045,
  },
  // 1: About (Sobre mí)
  {
    cameraPos: { x: -2.5, y: 1.0, z: 8.0 },
    lookAtPos: { x: 1.2, y: -0.2, z: -2.0 },
    haloPos: { x: 1.2, y: -0.4, z: -2.0 },
    haloRotationSpeed: 0.05,
    particleOpacity: 0.6,
    fogDensity: 0.05,
  },
  // 2: Experience (Formación)
  {
    cameraPos: { x: 2.2, y: -0.5, z: 8.5 },
    lookAtPos: { x: -1.0, y: 0.2, z: -1.0 },
    haloPos: { x: -1.0, y: 0.2, z: -1.2 },
    haloRotationSpeed: 0.025,
    particleOpacity: 0.35,
    fogDensity: 0.055,
  },
  // 3: Skills (Habilidades)
  {
    cameraPos: { x: 0, y: 3.5, z: 8.2 },
    lookAtPos: { x: 0, y: -0.8, z: -2.2 },
    haloPos: { x: 0, y: -1.0, z: -2.2 },
    haloRotationSpeed: 0.045,
    particleOpacity: 0.5,
    fogDensity: 0.045,
  },
  // 4: Projects (Proyectos)
  {
    cameraPos: { x: -3.0, y: -0.6, z: 7.2 },
    lookAtPos: { x: 1.5, y: 0.3, z: -2.2 },
    haloPos: { x: 1.5, y: 0.3, z: -2.5 },
    haloRotationSpeed: 0.05,
    particleOpacity: 0.55,
    fogDensity: 0.05,
  },
  // 5: Contact (Contacto)
  {
    cameraPos: { x: 0, y: 0.2, z: 11.5 },
    lookAtPos: { x: 0, y: 0, z: -4.5 },
    haloPos: { x: 0, y: 0, z: -4.5 },
    haloRotationSpeed: 0.03,
    particleOpacity: 0.3,
    fogDensity: 0.07,
  },
  // 6: Footer (Cierre)
  {
    cameraPos: { x: 1.8, y: -0.4, z: 10.0 },
    lookAtPos: { x: -0.6, y: 0.1, z: -3.2 },
    haloPos: { x: -0.6, y: 0.1, z: -3.2 },
    haloRotationSpeed: 0.022,
    particleOpacity: 0.25,
    fogDensity: 0.075,
  },
];

const HALO_SEGMENT_COUNT = 16;
/** Inclinación base del anillo (igual que la versión original). */
const HALO_BASE_TILT_X = Math.PI * 0.42;
const HALO_BASE_TILT_Z = Math.PI * 0.06;
/** Escala global del giro orbital (más bajo = más lento). */
const HALO_SPIN_SCALE = 0.16;
/** Oscilación sutil sobre el eje propio del anillo. */
const HALO_AXIS_WOBBLE = {
  speedX: 0.1,
  speedZ: 0.07,
  ampX: 0.045,
  ampZ: 0.032,
} as const;

/** Parallax suave al mover el cursor (cámara + escena). */
const POINTER_PARALLAX = {
  /** Desplazamiento lateral/vertical de la cámara en el plano de vista. */
  cameraSlide: 1.35,
  /** Cuánto se desplaza el punto de mira (refuerza la profundidad). */
  lookShift: 0.62,
  /** Ligero dolly en Z según el cursor. */
  cameraDolly: 0.22,
  haloTiltX: 0.18,
  haloTiltZ: 0.11,
  haloPosX: 0.32,
  haloPosY: 0.22,
  particlesX: 0.28,
  particlesY: 0.16,
  /** Mayor = respuesta más rápida al cursor. */
  followSharpness: 5.2,
} as const;

const cameraScratch = {
  forward: new THREE.Vector3(),
  right: new THREE.Vector3(),
  up: new THREE.Vector3(0, 1, 0),
  lookTarget: new THREE.Vector3(),
};

export const GlobalBackground = ({ activeSection, isPaused }: GlobalBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<number>(activeSection);
  const isPausedRef = useRef<boolean>(isPaused);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    /** Solo desactivar en móvil táctil; laptops con touchpad siguen con parallax. */
    const isTouchPrimary = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    
    const initialConfig = SECTION_CONFIGS[activeSectionRef.current] || SECTION_CONFIGS[0];
    camera.position.set(initialConfig.cameraPos.x, initialConfig.cameraPos.y, initialConfig.cameraPos.z);
    camera.lookAt(initialConfig.lookAtPos.x, initialConfig.lookAtPos.y, initialConfig.lookAtPos.z);

    // Optimización: precision "mediump" rinde mucho mejor en GPUS integradas y de bajos recursos
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Limitamos el pixel ratio máximo a 1.5 en lugar de 2 para ahorrar fill-rate en pantallas retina/HiDPI de bajos recursos
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const { group: haloMesh, geometries, materials } = createHaloRing(HALO_SEGMENT_COUNT);
    const haloWobble = new THREE.Group();
    const haloOrbit = new THREE.Group();
    const haloTilt = new THREE.Group();
    const haloRig = new THREE.Group();

    haloWobble.add(haloMesh);
    haloOrbit.add(haloWobble);
    haloTilt.add(haloOrbit);
    haloRig.add(haloTilt);
    haloRig.position.set(initialConfig.haloPos.x, initialConfig.haloPos.y, initialConfig.haloPos.z);
    scene.add(haloRig);

    // Reducimos partículas levemente en computadoras lentas
    const particleCount = prefersReducedMotion ? 30 : 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 4;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8d4e4,
      size: 0.035,
      transparent: true,
      opacity: initialConfig.particleOpacity,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Cursor normalizado (-1 … 1)
    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };

    const handlePointer = (clientX: number, clientY: number) => {
      pointerTarget.x = (clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (clientY / window.innerHeight) * 2 - 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      handlePointer(event.clientX, event.clientY);
    };

    const handleMouseLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    if (!isTouchPrimary) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    }
    window.addEventListener("resize", handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    // Lerping states
    const currentCameraPos = new THREE.Vector3().copy(camera.position);
    const currentLookAtPos = new THREE.Vector3(initialConfig.lookAtPos.x, initialConfig.lookAtPos.y, initialConfig.lookAtPos.z);
    const currentHaloPos = new THREE.Vector3().copy(haloRig.position);
    let currentHaloSpeed = initialConfig.haloRotationSpeed;
    let currentParticleOpacity = initialConfig.particleOpacity;
    let currentFogDensity = initialConfig.fogDensity;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // OPTIMIZACIÓN CRÍTICA: Si el portafolio está en vista expandida (isPaused = true),
      // omitimos por completo las actualizaciones de físicas, cámara y el renderizado WebGL.
      // Esto libera al 100% el uso del procesador y la gráfica mientras se lee el contenido.
      if (isPausedRef.current) return;

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      // Get target configuration based on the active section
      const targetConfig = SECTION_CONFIGS[activeSectionRef.current] || SECTION_CONFIGS[0];

      // Lerp properties smoothly towards targets
      const lerpSpeed = 0.025; // Smooth cinematic transition speed

      currentCameraPos.lerp(
        new THREE.Vector3(targetConfig.cameraPos.x, targetConfig.cameraPos.y, targetConfig.cameraPos.z),
        lerpSpeed
      );
      
      currentLookAtPos.lerp(
        new THREE.Vector3(targetConfig.lookAtPos.x, targetConfig.lookAtPos.y, targetConfig.lookAtPos.z),
        lerpSpeed
      );

      currentHaloPos.lerp(
        new THREE.Vector3(targetConfig.haloPos.x, targetConfig.haloPos.y, targetConfig.haloPos.z),
        lerpSpeed
      );

      currentHaloSpeed += (targetConfig.haloRotationSpeed - currentHaloSpeed) * lerpSpeed;
      currentParticleOpacity += (targetConfig.particleOpacity - currentParticleOpacity) * lerpSpeed;
      currentFogDensity += (targetConfig.fogDensity - currentFogDensity) * lerpSpeed;

      // Apply values
      haloRig.position.copy(currentHaloPos);
      particleMaterial.opacity = currentParticleOpacity;
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = currentFogDensity;
      }

      const pointerActive = !isTouchPrimary && !prefersReducedMotion;

      if (pointerActive) {
        const follow = 1 - Math.exp(-POINTER_PARALLAX.followSharpness * delta);
        pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * follow;
        pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * follow;
      } else {
        pointerSmooth.x = 0;
        pointerSmooth.y = 0;
      }

      const px = pointerSmooth.x;
      const py = pointerSmooth.y;

      // Giro orbital lento + balanceo sutil sobre el eje propio del anillo
      if (!prefersReducedMotion) {
        haloOrbit.rotation.y = elapsed * currentHaloSpeed * HALO_SPIN_SCALE;

        haloWobble.rotation.x =
          Math.sin(elapsed * HALO_AXIS_WOBBLE.speedX) * HALO_AXIS_WOBBLE.ampX;
        haloWobble.rotation.z =
          Math.cos(elapsed * HALO_AXIS_WOBBLE.speedZ) * HALO_AXIS_WOBBLE.ampZ;

        haloTilt.rotation.x = HALO_BASE_TILT_X + (pointerActive ? py * POINTER_PARALLAX.haloTiltX : 0);
        haloTilt.rotation.z = HALO_BASE_TILT_Z + (pointerActive ? px * POINTER_PARALLAX.haloTiltZ : 0);

        const floatY = Math.sin(elapsed * 0.45) * 0.18;
        haloRig.position.x = currentHaloPos.x + (pointerActive ? px * POINTER_PARALLAX.haloPosX : 0);
        haloRig.position.y =
          currentHaloPos.y + floatY + (pointerActive ? -py * POINTER_PARALLAX.haloPosY : 0);
        haloRig.position.z = currentHaloPos.z;

        particles.rotation.y = elapsed * 0.015;
        particles.position.x = pointerActive ? -px * POINTER_PARALLAX.particlesX : 0;
        particles.position.y = pointerActive ? py * POINTER_PARALLAX.particlesY : 0;
      }

      // Cámara: desplazamiento en el plano de vista + lookAt desfasado → parallax 3D
      camera.position.copy(currentCameraPos);

      if (pointerActive) {
        const { forward, right, up, lookTarget } = cameraScratch;
        lookTarget.copy(currentLookAtPos);
        camera.lookAt(lookTarget);

        camera.getWorldDirection(forward);
        right.crossVectors(forward, up);
        if (right.lengthSq() < 1e-6) {
          right.set(1, 0, 0);
        } else {
          right.normalize();
        }

        const slide = POINTER_PARALLAX.cameraSlide;
        camera.position
          .addScaledVector(right, px * slide)
          .addScaledVector(up, -py * slide * 0.82)
          .addScaledVector(forward, -py * POINTER_PARALLAX.cameraDolly * 0.35 + px * POINTER_PARALLAX.cameraDolly * 0.12);

        lookTarget
          .copy(currentLookAtPos)
          .addScaledVector(right, px * POINTER_PARALLAX.lookShift)
          .addScaledVector(up, -py * POINTER_PARALLAX.lookShift * 0.75);

        camera.lookAt(lookTarget);
      } else {
        camera.lookAt(currentLookAtPos);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
};

export default GlobalBackground;
