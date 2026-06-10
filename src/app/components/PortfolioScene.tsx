"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createHaloRing } from "./createHaloRing";
import { CARDS } from "./cardStackData";
import { SECTION_CONFIGS } from "./sectionConfigs";
import { IoMdClose } from "react-icons/io";

interface PortfolioSceneProps {
  setActiveSection: (index: number) => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
}

const HALO_SEGMENT_COUNT = 16;
const HALO_BASE_TILT_X = Math.PI * 0.42;
const HALO_BASE_TILT_Z = Math.PI * 0.06;
const HALO_SPIN_SCALE = 0.16;
const HALO_AXIS_WOBBLE = {
  speedX: 0.1,
  speedZ: 0.07,
  ampX: 0.045,
  ampZ: 0.032,
} as const;

const POINTER_PARALLAX = {
  cameraSlide: 1.35,
  lookShift: 0.62,
  cameraDolly: 0.22,
  haloTiltX: 0.18,
  haloTiltZ: 0.11,
  haloPosX: 0.32,
  haloPosY: 0.22,
  particlesX: 0.28,
  particlesY: 0.16,
  followSharpness: 5.2,
} as const;

const cameraScratch = {
  forward: new THREE.Vector3(),
  right: new THREE.Vector3(),
  up: new THREE.Vector3(0, 1, 0),
  lookTarget: new THREE.Vector3(),
};

const lerpTargets = {
  cameraPos: new THREE.Vector3(),
  lookAtPos: new THREE.Vector3(),
  haloPos: new THREE.Vector3(),
};

type CardRig = {
  dom: HTMLDivElement;
};

const STACK = {
  CARD_HEIGHT_VH: 0.85,
  STRIP_HEIGHT: 48,
  STRIP_GAP: 0,
  /** Carta siguiente: distancia bajo el centro (0–1 del alto) */
  NEXT_PEEK_RATIO: 0.78,
  /** Carta más antigua: cuánto sube al salir del encuadre */
  EXIT_LIFT: 130,
  SMOOTH_FOLLOW: 10,
  ARCHIVE_OPACITY: 0.9,
  ARCHIVE_OLD_OPACITY: 0.78,
} as const;

type ArchiveTone = "none" | "recent" | "old";
type StackRole = "active" | "next" | "archive-recent" | "archive-old";

type ArchiveLayout = {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
  zIndex: number;
  clipPath: string;
  transform: string;
  isActive: boolean;
  stackRole: StackRole;
  archiveTone: ArchiveTone;
};

const CARD_COUNT = CARDS.length;

function getCenterStickyTopPx(viewportH: number) {
  return viewportH * (0.5 - STACK.CARD_HEIGHT_VH / 2);
}

/**
 * Scroll proporcional en N segmentos iguales (ver diagrama 7 × 14.29%).
 * Centro tarjeta i en progress = (i + 0.5) / N
 * Transición i → i+1 en progress = (i + 1) / N
 */
function getScrollMetrics(stackContainer: HTMLElement | null, viewportH: number) {
  if (!stackContainer) {
    return { progress: 0, maxScroll: 1, start: 0 };
  }

  const start = stackContainer.offsetTop;
  const maxScroll = Math.max(1, stackContainer.offsetHeight - viewportH);
  const progress = Math.max(0, Math.min(1, (window.scrollY - start) / maxScroll));

  return { progress, maxScroll, start };
}

function progressToStackIndex(progress: number): number {
  return Math.max(0, Math.min(CARD_COUNT - 1, progress * CARD_COUNT - 0.5));
}

function stackIndexToScrollY(
  index: number,
  stackContainer: HTMLElement | null,
  viewportH: number
): number {
  const { maxScroll, start } = getScrollMetrics(stackContainer, viewportH);
  const targetProgress = (index + 0.5) / CARD_COUNT;
  return start + targetProgress * maxScroll;
}

function shouldShowCard(index: number, stackIndex: number): boolean {
  const depth = stackIndex - index;
  if (depth < -1.15) return false;
  if (depth > 2.35) return false;
  return true;
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function stackZIndex(depth: number): number {
  return Math.max(1, Math.min(140, Math.round(100 - depth * 44)));
}

/** Recorta la carta hasta dejar solo la franja superior visible (archivo) */
function stripClipPath(cardHeight: number, reveal: number): string {
  if (reveal <= 0) return "none";
  const hiddenPct = Math.max(0, 100 - (STACK.STRIP_HEIGHT / cardHeight) * 100 * reveal);
  return `inset(0 0 ${hiddenPct}% 0 round 0)`;
}

function getArchiveLayout(
  index: number,
  stackIndex: number,
  cardLeft: number,
  cardWidth: number,
  cardHeight: number,
  centerTop: number
): ArchiveLayout {
  const depth = stackIndex - index;
  const stripStep = STACK.STRIP_HEIGHT + STACK.STRIP_GAP;
  const stripTop = centerTop - stripStep;
  const zIndex = stackZIndex(depth);

  const base = {
    left: cardLeft,
    width: cardWidth,
    height: cardHeight,
  };

  // Entrante: sube desde abajo (depth -1 → 0)
  if (depth < 0) {
    const riseT = clamp01(1 + depth);
    const peekTop = centerTop + cardHeight * STACK.NEXT_PEEK_RATIO;

    return {
      ...base,
      top: lerp(peekTop, centerTop, riseT),
      opacity: lerp(0.7, 1, riseT),
      zIndex,
      clipPath: "none",
      transform: riseT < 1 ? `translateY(${(1 - riseT) * 4}px)` : "none",
      isActive: riseT > 0.96,
      stackRole: riseT > 0.96 ? "active" : "next",
      archiveTone: "none",
    };
  }

  // Principal archivándose (depth 0 → 1): movimiento continuo desde el centro
  if (depth <= 1) {
    const t = clamp01(depth);
    const clipReveal = clamp01((t - 0.08) / 0.92);

    return {
      ...base,
      top: lerp(centerTop, stripTop, t),
      opacity: lerp(1, STACK.ARCHIVE_OPACITY, t),
      zIndex: t < 0.04 ? 100 : zIndex,
      clipPath: stripClipPath(cardHeight, clipReveal),
      transform: `translateY(${-t * 5}px) scale(${1 - t * 0.018})`,
      isActive: t < 0.04,
      stackRole: t < 0.04 ? "active" : "archive-recent",
      archiveTone: t < 0.04 ? "none" : "recent",
    };
  }

  // Archivo antiguo → sube y desaparece (depth 1 → 2)
  if (depth <= 2) {
    const exitT = clamp01(depth - 1);

    return {
      ...base,
      top: stripTop - exitT * STACK.EXIT_LIFT,
      opacity: lerp(STACK.ARCHIVE_OLD_OPACITY, 0, exitT),
      zIndex,
      clipPath: stripClipPath(cardHeight, 1),
      transform: `translateY(${-exitT * 14}px) scale(${1 - exitT * 0.05})`,
      isActive: false,
      stackRole: "archive-old",
      archiveTone: "old",
    };
  }

  return {
    ...base,
    top: stripTop - STACK.EXIT_LIFT,
    opacity: 0,
    zIndex: 1,
    clipPath: stripClipPath(cardHeight, 1),
    transform: "none",
    isActive: false,
    stackRole: "archive-old",
    archiveTone: "old",
  };
}

function syncCardsToScrollLayout(
  rigs: CardRig[],
  stackContainer: HTMLDivElement | null,
  stackIndex: number,
  expanded: boolean,
  viewportW: number,
  viewportH: number
) {
  const containerRect = stackContainer?.getBoundingClientRect();
  const cardWidth = containerRect?.width ?? Math.min(1024, viewportW * 0.92);
  const cardLeft = containerRect?.left ?? (viewportW - cardWidth) / 2;
  const cardHeight = viewportH * STACK.CARD_HEIGHT_VH;
  const centerTop = getCenterStickyTopPx(viewportH);

  rigs.forEach((rig, index) => {
    if (expanded) {
      rig.dom.style.visibility = "hidden";
      rig.dom.style.pointerEvents = "none";
      return;
    }

    if (!shouldShowCard(index, stackIndex)) {
      rig.dom.style.visibility = "hidden";
      rig.dom.style.pointerEvents = "none";
      return;
    }

    const layout = getArchiveLayout(
      index,
      stackIndex,
      cardLeft,
      cardWidth,
      cardHeight,
      centerTop
    );

    if (layout.opacity < 0.02) {
      rig.dom.style.visibility = "hidden";
      rig.dom.style.pointerEvents = "none";
      return;
    }

    rig.dom.style.visibility = "visible";
    rig.dom.style.position = "absolute";
    rig.dom.style.left = `${layout.left}px`;
    rig.dom.style.top = `${layout.top}px`;
    rig.dom.style.width = `${layout.width}px`;
    rig.dom.style.height = `${layout.height}px`;
    rig.dom.style.transform = layout.transform;
    rig.dom.style.clipPath = layout.clipPath;
    rig.dom.style.opacity = String(layout.opacity);
    rig.dom.style.transition = "none";
    rig.dom.style.zIndex = String(layout.zIndex);
    rig.dom.style.pointerEvents = layout.isActive ? "auto" : "none";
    rig.dom.dataset.stackRole = layout.stackRole;
    rig.dom.dataset.archiveTone = layout.archiveTone;
  });
}

export const PortfolioScene = ({
  setActiveSection,
  expandedCardId,
  setExpandedCardId,
}: PortfolioSceneProps) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardsDomReady, setCardsDomReady] = useState(false);

  const bgContainerRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const cardDomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeCardIndexRef = useRef(0);
  const smoothStackIndexRef = useRef(0);
  const targetStackIndexRef = useRef(0);
  const expandedRef = useRef<string | null>(expandedCardId);
  const rigsRef = useRef<CardRig[]>([]);

  useLayoutEffect(() => {
    if (CARDS.every((_, i) => cardDomRefs.current[i])) {
      setCardsDomReady(true);
    }
  }, []);

  useEffect(() => {
    activeCardIndexRef.current = activeCardIndex;
  }, [activeCardIndex]);

  useEffect(() => {
    expandedRef.current = expandedCardId;
  }, [expandedCardId]);

  useEffect(() => {
    const handleNav = (e: Event) => {
      const { sectionId } = (e as CustomEvent<{ sectionId: string }>).detail;
      const index = CARDS.findIndex((c) => c.id === sectionId);
      if (index === -1) return;

      const scrollY = stackIndexToScrollY(index, stackContainerRef.current, window.innerHeight);
      window.scrollTo({ top: scrollY, behavior: "smooth" });

      if (sectionId !== "hero") {
        setTimeout(() => setExpandedCardId(sectionId), 600);
      } else {
        setExpandedCardId(null);
      }
    };

    window.addEventListener("nav-to-section", handleNav);
    return () => window.removeEventListener("nav-to-section", handleNav);
  }, [setExpandedCardId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedCardId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setExpandedCardId]);

  useEffect(() => {
    document.body.style.overflow = expandedCardId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedCardId]);

  useEffect(() => {
    if (!cardsDomReady) return;

    const bgContainer = bgContainerRef.current;
    if (!bgContainer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchPrimary = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const viewportW = () => window.innerWidth;
    const viewportH = () => window.innerHeight;

    // --- Fondo WebGL (anillo + partículas) ---
    const bgScene = new THREE.Scene();
    bgScene.fog = new THREE.FogExp2(0x000000, 0.045);

    const bgCamera = new THREE.PerspectiveCamera(52, viewportW() / viewportH(), 0.1, 120);
    const initialConfig = SECTION_CONFIGS[activeCardIndexRef.current] || SECTION_CONFIGS[0];
    bgCamera.position.set(initialConfig.cameraPos.x, initialConfig.cameraPos.y, initialConfig.cameraPos.z);
    bgCamera.lookAt(initialConfig.lookAtPos.x, initialConfig.lookAtPos.y, initialConfig.lookAtPos.z);

    const bgRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    bgRenderer.setSize(viewportW(), viewportH());
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    bgRenderer.setClearColor(0x000000, 0);
    bgContainer.appendChild(bgRenderer.domElement);

    const { group: haloMesh, geometries: haloGeometries, materials: haloMaterials } =
      createHaloRing(HALO_SEGMENT_COUNT);
    const haloWobble = new THREE.Group();
    const haloOrbit = new THREE.Group();
    const haloTilt = new THREE.Group();
    const haloRig = new THREE.Group();
    haloWobble.add(haloMesh);
    haloOrbit.add(haloWobble);
    haloTilt.add(haloOrbit);
    haloRig.add(haloTilt);
    haloRig.position.set(initialConfig.haloPos.x, initialConfig.haloPos.y, initialConfig.haloPos.z);
    bgScene.add(haloRig);

    const particleCount = prefersReducedMotion ? 30 : 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8d4e4,
      size: 0.035,
      transparent: true,
      opacity: initialConfig.particleOpacity,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    bgScene.add(particles);

    const rigs: CardRig[] = [];

    CARDS.forEach((card, index) => {
      const dom = cardDomRefs.current[index];
      if (!dom) return;

      dom.style.pointerEvents = "auto";

      const rig: CardRig = { dom };
      rigs.push(rig);

      dom.addEventListener("click", () => {
        if (expandedRef.current) return;
        if (card.id === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setExpandedCardId(card.id);
        }
      });
    });

    rigsRef.current = rigs;

    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };

    const handlePointer = (clientX: number, clientY: number) => {
      pointerTarget.x = (clientX / viewportW()) * 2 - 1;
      pointerTarget.y = (clientY / viewportH()) * 2 - 1;
    };

    const handleMouseMove = (event: MouseEvent) => handlePointer(event.clientX, event.clientY);
    const handleMouseLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    const handleResize = () => {
      const w = viewportW();
      const h = viewportH();

      bgCamera.aspect = w / h;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(w, h);
    };

    if (!isTouchPrimary) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    }
    window.addEventListener("resize", handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();
    const currentCameraPos = new THREE.Vector3().copy(bgCamera.position);
    const currentLookAtPos = new THREE.Vector3(
      initialConfig.lookAtPos.x,
      initialConfig.lookAtPos.y,
      initialConfig.lookAtPos.z
    );
    const currentHaloPos = new THREE.Vector3().copy(haloRig.position);
    let currentHaloSpeed = initialConfig.haloRotationSpeed;
    let currentParticleOpacity = initialConfig.particleOpacity;
    let currentFogDensity = initialConfig.fogDensity;

    const initIndex = progressToStackIndex(
      getScrollMetrics(stackContainerRef.current, viewportH()).progress
    );
    smoothStackIndexRef.current = initIndex;
    targetStackIndexRef.current = initIndex;
    syncCardsToScrollLayout(
      rigs,
      stackContainerRef.current,
      initIndex,
      false,
      viewportW(),
      viewportH()
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const w = viewportW();
      const h = viewportH();
      const expanded = !!expandedRef.current;
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!expanded) {
        const { progress } = getScrollMetrics(stackContainerRef.current, h);
        targetStackIndexRef.current = progressToStackIndex(progress);

        const follow = 1 - Math.exp(-STACK.SMOOTH_FOLLOW * delta);
        smoothStackIndexRef.current +=
          (targetStackIndexRef.current - smoothStackIndexRef.current) * follow;

        const sectionIndex = Math.round(targetStackIndexRef.current);
        if (sectionIndex !== activeCardIndexRef.current) {
          activeCardIndexRef.current = sectionIndex;
          setActiveCardIndex(sectionIndex);
          setActiveSection(sectionIndex);
        }
      }

      syncCardsToScrollLayout(
        rigs,
        stackContainerRef.current,
        targetStackIndexRef.current,
        expanded,
        w,
        h
      );

      if (expanded) return;

      const elapsed = clock.getElapsedTime();
      const targetConfig = SECTION_CONFIGS[activeCardIndexRef.current] || SECTION_CONFIGS[0];
      const lerpSpeed = 0.025;

      lerpTargets.cameraPos.set(
        targetConfig.cameraPos.x,
        targetConfig.cameraPos.y,
        targetConfig.cameraPos.z
      );
      lerpTargets.lookAtPos.set(
        targetConfig.lookAtPos.x,
        targetConfig.lookAtPos.y,
        targetConfig.lookAtPos.z
      );
      lerpTargets.haloPos.set(targetConfig.haloPos.x, targetConfig.haloPos.y, targetConfig.haloPos.z);

      currentCameraPos.lerp(lerpTargets.cameraPos, lerpSpeed);
      currentLookAtPos.lerp(lerpTargets.lookAtPos, lerpSpeed);
      currentHaloPos.lerp(lerpTargets.haloPos, lerpSpeed);
      currentHaloSpeed += (targetConfig.haloRotationSpeed - currentHaloSpeed) * lerpSpeed;
      currentParticleOpacity += (targetConfig.particleOpacity - currentParticleOpacity) * lerpSpeed;
      currentFogDensity += (targetConfig.fogDensity - currentFogDensity) * lerpSpeed;

      haloRig.position.copy(currentHaloPos);
      particleMaterial.opacity = currentParticleOpacity;
      if (bgScene.fog instanceof THREE.FogExp2) bgScene.fog.density = currentFogDensity;

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

      if (!prefersReducedMotion) {
        haloOrbit.rotation.y = elapsed * currentHaloSpeed * HALO_SPIN_SCALE;
        haloWobble.rotation.x = Math.sin(elapsed * HALO_AXIS_WOBBLE.speedX) * HALO_AXIS_WOBBLE.ampX;
        haloWobble.rotation.z = Math.cos(elapsed * HALO_AXIS_WOBBLE.speedZ) * HALO_AXIS_WOBBLE.ampZ;
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

      bgCamera.position.copy(currentCameraPos);
      if (pointerActive) {
        const { forward, right, up, lookTarget } = cameraScratch;
        lookTarget.copy(currentLookAtPos);
        bgCamera.lookAt(lookTarget);
        bgCamera.getWorldDirection(forward);
        right.crossVectors(forward, up);
        if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
        else right.normalize();

        bgCamera.position
          .addScaledVector(right, px * POINTER_PARALLAX.cameraSlide)
          .addScaledVector(up, -py * POINTER_PARALLAX.cameraSlide * 0.82)
          .addScaledVector(
            forward,
            -py * POINTER_PARALLAX.cameraDolly * 0.35 + px * POINTER_PARALLAX.cameraDolly * 0.12
          );

        lookTarget
          .copy(currentLookAtPos)
          .addScaledVector(right, px * POINTER_PARALLAX.lookShift)
          .addScaledVector(up, -py * POINTER_PARALLAX.lookShift * 0.75);
        bgCamera.lookAt(lookTarget);
      } else {
        bgCamera.lookAt(currentLookAtPos);
      }

      bgRenderer.render(bgScene, bgCamera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      bgRenderer.dispose();
      [...haloGeometries, particleGeometry].forEach((g) => g.dispose());
      [...haloMaterials, particleMaterial].forEach((m) => m.dispose());
      if (bgContainer.contains(bgRenderer.domElement)) bgContainer.removeChild(bgRenderer.domElement);
      rigsRef.current.forEach((rig) => {
        rig.dom.style.visibility = "hidden";
      });
      rigsRef.current = [];
    };
  }, [cardsDomReady, setExpandedCardId]);

  const activeCard = expandedCardId ? CARDS.find((c) => c.id === expandedCardId) : null;

  return (
    <>
      <div ref={bgContainerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />

      {/* Track de scroll: 7 segmentos iguales (~14.29% cada uno) */}
      <div
        ref={stackContainerRef}
        className="card-stack-container max-w-5xl mx-auto px-4 md:px-8 mt-4 relative z-[1]"
        aria-hidden
      >
        {CARDS.map((card) => (
          <div key={card.id} className="card-scroll-segment" />
        ))}
      </div>

      <div className="three-card-overlay fixed inset-0 z-[9] pointer-events-none">
        {CARDS.map((card, index) => {
          const isHero = card.id === "hero";
          const Component = card.component;

          return (
            <div
              key={card.id}
              id={`card-${card.id}`}
              ref={(el) => {
                cardDomRefs.current[index] = el;
              }}
              className="three-card-dom card-stack-item-visual cursor-pointer overflow-hidden border border-white/[0.08] bg-[#050505] pointer-events-auto"
              style={{ visibility: "hidden", position: "absolute" }}
            >
              <header className="card-stack-header h-12 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0a0a0a] select-none shrink-0">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] font-light tracking-[0.2em] text-white/45">
                    [ {card.index} ]
                  </span>
                  <span className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/75">
                    {card.label}
                  </span>
                </div>
                {!isHero && (
                  <span className="card-stack-header-extra font-mono text-[9px] font-light tracking-[0.15em] text-white/30 uppercase">
                    [ VER DETALLES ]
                  </span>
                )}
              </header>

              {isHero ? (
                <div className="card-stack-body h-[calc(100%-3rem)] overflow-hidden bg-[#050505]">
                  <Component />
                </div>
              ) : (
                <div className="card-stack-body h-[calc(100%-3rem)] flex flex-col justify-between p-8 md:p-12 text-left relative bg-gradient-to-b from-[#050505] to-[#000000]">
                  <div
                    className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.03] pointer-events-none bg-cover bg-right bg-no-repeat"
                    style={{ backgroundImage: `url('/wireone.png')` }}
                    aria-hidden
                  />
                  <div className="max-w-xl relative z-10">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 block mb-6">
                      Preview
                    </span>
                    <h2 className="text-4xl md:text-6xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase mb-4">
                      {card.previewTitle}
                      <br />
                      <span className="font-medium text-white/40">{card.previewSubtitle}</span>
                    </h2>
                    <div className="w-8 h-px bg-white/[0.08] my-6" />
                    <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide">
                      {card.previewDesc}
                    </p>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
                      CLIC PARA AMPLIAR HOJA
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5">
                      <span className="text-white text-base">↗</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeCard && (
        <div className="fixed inset-0 z-[9999] bg-black/95 overflow-y-auto expanded-content-scroll flex flex-col">
          <div className="sticky top-0 left-0 right-0 z-50 bg-black/80 border-b border-white/[0.08] px-8 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/40">[ {activeCard.index} ]</span>
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/80">
                {activeCard.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setExpandedCardId(null)}
              className="group flex items-center gap-3 px-4 py-2 border border-white/10 hover:border-white/30 bg-transparent text-[10px] font-mono tracking-[0.15em] uppercase text-white/60 hover:text-white transition-all duration-300"
              aria-label="Cerrar detalles"
            >
              <span>[ ESC ] CERRAR</span>
              <IoMdClose className="h-4 w-4" />
            </button>
          </div>
          <main className="flex-grow w-full relative">
            <activeCard.component />
          </main>
          <footer className="py-12 border-t border-white/[0.08] bg-black/50 text-center select-none">
            <button
              type="button"
              onClick={() => setExpandedCardId(null)}
              className="font-mono text-[10px] tracking-[0.2em] text-white/40 hover:text-white/80 transition-colors duration-300"
            >
              ← VOLVER AL PORTAFOLIO DE HOJAS
            </button>
          </footer>
        </div>
      )}
    </>
  );
};

export default PortfolioScene;
