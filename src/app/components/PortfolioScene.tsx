"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CardPanelContent } from "./CardPanelContent";
import {
  createThreeCardShell,
  disposeCardShell,
  type CardShellAssets,
} from "./createThreeCardShell";
import { CARDS } from "./cardStackData";
import { SECTION_CONFIGS } from "./sectionConfigs";
import { IoMdClose } from "react-icons/io";
import { Navbar } from "./Navbar";


interface PortfolioSceneProps {
  setActiveSection: (index: number) => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
}

/** Parallax de la cámara ortográfica de los paneles 3D (escena principal) */
const PANEL_CAMERA_PARALLAX = {
  /** Desplazamiento lateral de la cámara en px — paneles flotan, la cámara se mueve */
  cameraSlide: 48,
  /** Punto de mira desplazado → sensación de girar la cabeza y mirar a un lado */
  lookShift: 72,
  /** Inercia del seguimiento respecto al cursor */
  lookAtFollowSharpness: 2.1,
} as const;

const PANEL_CAMERA_Z = 1200;

const BG_PARALLAX = {
  particlesX: 0.28,
  particlesY: 0.16,
  followSharpness: 5,
} as const;

const lerpTargets = {
  cameraPos: new THREE.Vector3(),
  lookAtPos: new THREE.Vector3(),
};

type CardRig = {
  shellRoot: THREE.Group;
  cssRoot: THREE.Group;
  cssObject: CSS3DObject;
  dom: HTMLDivElement;
  shell: CardShellAssets;
  baseWidth: number;
  baseHeight: number;
};

const STACK = {
  /** Proporción fija alto/ancho — la composición no depende del alto del viewport (F11, etc.) */
  CARD_ASPECT: 0.650,
  MAX_CARD_WIDTH: 1024,
  /** Fracción del alto visible del asomo (solo si cabe bajo el panel activo) */
  INCOMING_PEEK_RATIO: 0.22,
  /** Separación mínima entre el borde inferior del activo y el asomo */
  PEEK_GAP: 0.050,
  OUTGOING_BLUR_MAX: 12,
  /** Difuminado de la carta que asoma por debajo (se aclara al subir) */
  INCOMING_BLUR_MAX: 11,
  INCOMING_OPACITY_MIN: 0.72,
  /** Suavizado del índice visual (mayor = más inercia al soltar el scroll) */
  SMOOTH_FOLLOW: 7.5,
  /** Zona en la que la tarjeta se siente activa y clicable */
  CLICK_DEPTH: 0.36,
} as const;

type StackRole = "active" | "incoming" | "outgoing";

type StackLayout = {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
  blur: number;
  zIndex: number;
  transform: string;
  stackRole: StackRole;
};

const CARD_COUNT = CARDS.length;

/** Scroll físico donde el último panel queda centrado (≈92.9% del recorrido actual) */
const SCROLL_END_RAW = (CARD_COUNT - 0.5) / CARD_COUNT;

/** A partir de aquí solo el último panel, limpio y activo */
const LAST_PANEL_STACK_INDEX = CARD_COUNT - 0.35;

function normalizeScrollProgress(rawProgress: number): number {
  return Math.min(1, Math.max(0, rawProgress / SCROLL_END_RAW));
}

type CardComposition = {
  cardWidth: number;
  cardHeight: number;
  cardLeft: number;
  centerTop: number;
};

function getCardComposition(
  viewportW: number,
  viewportH: number,
  stackContainer: HTMLElement | null
): CardComposition {
  const containerRect = stackContainer?.getBoundingClientRect();
  const cardWidth = containerRect?.width ?? Math.min(STACK.MAX_CARD_WIDTH, viewportW * 0.92);
  const cardHeight = cardWidth * STACK.CARD_ASPECT;
  const cardLeft = containerRect?.left ?? (viewportW - cardWidth) / 2;
  const centerTop = Math.max(0, (viewportH - cardHeight) * 0.5);

  return { cardWidth, cardHeight, cardLeft, centerTop };
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

function progressToStackIndex(normalizedProgress: number): number {
  if (normalizedProgress >= 1) return CARD_COUNT - 1;
  return Math.max(
    0,
    Math.min(CARD_COUNT - 1, normalizedProgress * CARD_COUNT - 0.5)
  );
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

function getNextCardIndex(stackIndex: number): number | null {
  const next = Math.floor(stackIndex + 1e-5) + 1;
  if (next >= CARD_COUNT) return null;
  return next;
}

function shouldShowCard(index: number, stackIndex: number): boolean {
  if (stackIndex >= LAST_PANEL_STACK_INDEX) {
    return index === CARD_COUNT - 1;
  }

  const depth = stackIndex - index;
  const nextIndex = getNextCardIndex(stackIndex);

  if (nextIndex !== null && index === nextIndex) return true;
  if (depth >= 0.78) return false;
  if (depth >= 0 && depth < 1.12) return true;
  return false;
}

function parseUniformScale(transform: string): number {
  const match = transform.match(/scale\(([\d.]+)\)/);
  return match ? Number.parseFloat(match[1]) : 1;
}

function makeCardCamera(viewportW: number, viewportH: number) {
  const camera = new THREE.OrthographicCamera(
    -viewportW / 2,
    viewportW / 2,
    viewportH / 2,
    -viewportH / 2,
    1,
    4000
  );
  camera.position.set(0, 0, PANEL_CAMERA_Z);
  camera.lookAt(0, 0, 0);
  return camera;
}

function applyPanelCameraParallax(
  camera: THREE.OrthographicCamera,
  lookX: number,
  lookY: number
) {
  const { cameraSlide, lookShift } = PANEL_CAMERA_PARALLAX;
  camera.position.set(lookX * cameraSlide, -lookY * cameraSlide * 0.82, PANEL_CAMERA_Z);
  camera.lookAt(lookX * lookShift, -lookY * lookShift * 0.82, 0);
}

function resetPanelCamera(camera: THREE.OrthographicCamera) {
  camera.position.set(0, 0, PANEL_CAMERA_Z);
  camera.lookAt(0, 0, 0);
}

function getIncomingRestTop(centerTop: number, cardHeight: number, viewportH: number): number {
  const activeBottom = centerTop + cardHeight;
  const peekFromViewport = viewportH - cardHeight * STACK.INCOMING_PEEK_RATIO;
  const peekBelowActive = activeBottom + STACK.PEEK_GAP;

  // El asomo nunca invade el panel activo
  if (peekFromViewport < peekBelowActive) {
    return peekBelowActive;
  }
  return peekFromViewport;
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/** Curva suave con arranque y llegada graduales (más natural que linear/smoothstep) */
function smootherstep(t: number) {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function getStackLayout(
  index: number,
  stackIndex: number,
  cardLeft: number,
  cardWidth: number,
  cardHeight: number,
  centerTop: number,
  viewportH: number
): StackLayout {
  const depth = stackIndex - index;
  const base = { left: cardLeft, width: cardWidth, height: cardHeight };
  const activeBottom = centerTop + cardHeight;
  const restTop = getIncomingRestTop(centerTop, cardHeight, viewportH);

  const activeLayout = (): StackLayout => ({
    ...base,
    top: centerTop,
    opacity: 1,
    blur: 0,
    zIndex: 100 + index,
    transform: "none",
    stackRole: "active",
  });

  if (index === CARD_COUNT - 1 && stackIndex >= LAST_PANEL_STACK_INDEX) {
    return activeLayout();
  }

  // Entrante: asoma debajo del activo; sube al centro al hacer scroll
  if (depth < 0) {
    const isLastPanel = index === CARD_COUNT - 1;
    const riseT = isLastPanel
      ? smootherstep(clamp01((1 + depth) / 0.65))
      : smootherstep(1 + depth);
    const clearT = smoothstep(riseT);
    const incomingTop = lerp(restTop, centerTop, riseT);
    const overlapsActive = incomingTop < activeBottom - 2;
    const behindActive = overlapsActive || riseT < 0.72;

    return {
      ...base,
      top: incomingTop,
      opacity: lerp(STACK.INCOMING_OPACITY_MIN, 1, clearT),
      blur: lerp(STACK.INCOMING_BLUR_MAX, 0, clearT),
      zIndex: behindActive ? 48 + index : 100 + index + Math.round(riseT * 16),
      transform: `scale(${lerp(0.965, 1, riseT)})`,
      stackRole: riseT > 0.9 ? "active" : "incoming",
    };
  }

  // Saliente: difumina con curva que tarda un poco en arrancar (depth 0 → 1)
  if (depth <= 1) {
    const fadeT = Math.pow(smootherstep(depth), 1.35);

    return {
      ...base,
      top: centerTop - fadeT * 10,
      opacity: 1 - fadeT * 0.9,
      blur: fadeT * STACK.OUTGOING_BLUR_MAX,
      zIndex: Math.max(48, 100 + index - Math.round(fadeT * 52)),
      transform: `scale(${1 - fadeT * 0.022})`,
      stackRole: fadeT < 0.14 ? "active" : "outgoing",
    };
  }

  return {
    ...base,
    top: centerTop,
    opacity: 0,
    blur: 0,
    zIndex: 1,
    transform: "none",
    stackRole: "outgoing",
  };
}

function isCardClickable(index: number, stackIndex: number, layout: StackLayout): boolean {
  const depth = Math.abs(stackIndex - index);
  return (
    depth < STACK.CLICK_DEPTH &&
    layout.opacity > 0.85 &&
    layout.blur < 2 &&
    layout.stackRole === "active"
  );
}

function syncCardsTo3DLayout(
  rigs: CardRig[],
  stackContainer: HTMLDivElement | null,
  stackIndex: number,
  expanded: boolean,
  viewportW: number,
  viewportH: number,
  parallaxX = 0,
  parallaxY = 0
) {
  const { cardWidth, cardHeight, cardLeft, centerTop } = getCardComposition(
    viewportW,
    viewportH,
    stackContainer
  );
  const nextIndex = getNextCardIndex(stackIndex);

  rigs.forEach((rig, index) => {
    const hide = () => {
      rig.shellRoot.visible = false;
      rig.cssRoot.visible = false;
      rig.dom.style.pointerEvents = "none";
      rig.dom.style.visibility = "hidden";
    };

    if (expanded) {
      hide();
      return;
    }

    if (!shouldShowCard(index, stackIndex)) {
      hide();
      return;
    }

    const layout = getStackLayout(
      index,
      stackIndex,
      cardLeft,
      cardWidth,
      cardHeight,
      centerTop,
      viewportH
    );

    const isPeekCard = nextIndex === index;
    if (layout.opacity < 0.02 && !isPeekCard) {
      hide();
      return;
    }

    const scale = parseUniformScale(layout.transform);
    const centerX = layout.left + layout.width / 2 - viewportW / 2;
    const centerY = -(layout.top + layout.height / 2 - viewportH / 2);
    const depthZ = -layout.zIndex * 2.5;

    const uniformScale = scale * (cardWidth / rig.baseWidth);

    rig.shellRoot.position.set(centerX, centerY, depthZ - 8);
    rig.shellRoot.scale.set(uniformScale, uniformScale, uniformScale);
    rig.shellRoot.visible = true;

    rig.cssRoot.position.set(centerX, centerY, depthZ);
    rig.cssRoot.scale.set(uniformScale, uniformScale, uniformScale);
    rig.cssRoot.visible = true;

    rig.dom.style.width = `${cardWidth}px`;
    rig.dom.style.height = `${cardHeight}px`;
    rig.dom.style.visibility = "visible";
    rig.dom.style.opacity = String(Math.max(isPeekCard ? STACK.INCOMING_OPACITY_MIN : 0, layout.opacity));
    rig.dom.style.filter = layout.blur > 0.2 ? `blur(${layout.blur.toFixed(1)}px)` : "none";
    rig.dom.style.pointerEvents = "none";

    const isClickable = isCardClickable(index, stackIndex, layout);
    rig.dom.style.pointerEvents = isClickable ? "auto" : "none";
    rig.dom.style.cursor = isClickable ? "pointer" : "default";
    rig.dom.dataset.stackRole = layout.stackRole;
    rig.dom.dataset.cardClickable = isClickable ? "true" : "false";
    rig.dom.style.setProperty("--panel-px", parallaxX.toFixed(4));
    rig.dom.style.setProperty("--panel-py", parallaxY.toFixed(4));
  });
}

export const PortfolioScene = ({
  setActiveSection,
  expandedCardId,
  setExpandedCardId,
}: PortfolioSceneProps) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardsDomReady, setCardsDomReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const bgContainerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const cardDomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeCardIndexRef = useRef(0);
  const smoothStackIndexRef = useRef(0);
  const targetStackIndexRef = useRef(0);
  const expandedRef = useRef<string | null>(expandedCardId);
  const rigsRef = useRef<CardRig[]>([]);
  const scrollPercentRef = useRef<HTMLSpanElement>(null);
  const lastScrollPercentRef = useRef(-1);

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

      if (isMobile) {
        if (sectionId !== "hero") {
          setExpandedCardId(sectionId);
        } else {
          setExpandedCardId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        const scrollY = stackIndexToScrollY(index, stackContainerRef.current, window.innerHeight);
        window.scrollTo({ top: scrollY, behavior: "smooth" });

        if (sectionId !== "hero") {
          setTimeout(() => setExpandedCardId(sectionId), 600);
        } else {
          setExpandedCardId(null);
        }
      }
    };

    window.addEventListener("nav-to-section", handleNav);
    return () => window.removeEventListener("nav-to-section", handleNav);
  }, [setExpandedCardId, isMobile]);

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
    if (isMobile || !cardsDomReady) return;

    const bgContainer = bgContainerRef.current;
    const cardContainer = cardContainerRef.current;
    if (!bgContainer || !cardContainer) return;

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

    // --- Placas 3D (shell WebGL + contenido CSS3D) ---
    const cardScene = new THREE.Scene();
    const css3dScene = new THREE.Scene();
    let cardCamera = makeCardCamera(viewportW(), viewportH());

    const cardRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    cardRenderer.setSize(viewportW(), viewportH());
    cardRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    cardRenderer.setClearColor(0x000000, 0);
    cardRenderer.domElement.style.position = "absolute";
    cardRenderer.domElement.style.inset = "0";
    cardRenderer.domElement.style.pointerEvents = "none";

    const css3dRenderer = new CSS3DRenderer();
    css3dRenderer.setSize(viewportW(), viewportH());
    css3dRenderer.domElement.className = "three-card-css3d-layer";
    css3dRenderer.domElement.style.position = "absolute";
    css3dRenderer.domElement.style.inset = "0";
    css3dRenderer.domElement.style.pointerEvents = "none";

    cardContainer.appendChild(cardRenderer.domElement);
    cardContainer.appendChild(css3dRenderer.domElement);

    cardScene.add(new THREE.AmbientLight(0xffffff, 0.58));
    const cardKeyLight = new THREE.DirectionalLight(0xf0f4fa, 0.9);
    cardKeyLight.position.set(0, 0, 240);
    cardScene.add(cardKeyLight);

    const initialComposition = getCardComposition(
      viewportW(),
      viewportH(),
      stackContainerRef.current
    );
    const { cardWidth: initialCardWidth, cardHeight: initialCardHeight } = initialComposition;

    const cardGeometries: THREE.BufferGeometry[] = [];
    const cardMaterials: THREE.Material[] = [];
    const rigs: CardRig[] = [];

    CARDS.forEach((card, index) => {
      const dom = cardDomRefs.current[index];
      if (!dom) return;

      dom.style.width = `${initialCardWidth}px`;
      dom.style.height = `${initialCardHeight}px`;
      dom.style.overflow = "hidden";
      dom.style.backfaceVisibility = "hidden";

      const shell = createThreeCardShell(initialCardWidth, initialCardHeight);
      cardGeometries.push(...shell.geometries);
      cardMaterials.push(...shell.materials);
      shell.group.position.z = -6;

      const shellRoot = new THREE.Group();
      shellRoot.add(shell.group);
      cardScene.add(shellRoot);

      const cssObject = new CSS3DObject(dom);
      const cssRoot = new THREE.Group();
      cssRoot.add(cssObject);
      css3dScene.add(cssRoot);

      rigs.push({
        shellRoot,
        cssRoot,
        cssObject,
        dom,
        shell,
        baseWidth: initialCardWidth,
        baseHeight: initialCardHeight,
      });

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
    const panelLookFollowSmooth = { x: 0, y: 0 };

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

      cardCamera = makeCardCamera(w, h);
      cardRenderer.setSize(w, h);
      css3dRenderer.setSize(w, h);
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
    let currentParticleOpacity = initialConfig.particleOpacity;
    let currentFogDensity = initialConfig.fogDensity;

    const initIndex = progressToStackIndex(
      normalizeScrollProgress(getScrollMetrics(stackContainerRef.current, viewportH()).progress)
    );
    smoothStackIndexRef.current = initIndex;
    targetStackIndexRef.current = initIndex;
    syncCardsTo3DLayout(
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
        const { progress: rawProgress } = getScrollMetrics(stackContainerRef.current, h);
        const progress = normalizeScrollProgress(rawProgress);
        targetStackIndexRef.current = progressToStackIndex(progress);

        const percent = Math.round(progress * 1000) / 10;
        if (percent !== lastScrollPercentRef.current && scrollPercentRef.current) {
          lastScrollPercentRef.current = percent;
          scrollPercentRef.current.textContent = `${percent.toFixed(1)}%`;
        }

        const endBoost = progress > 0.86 ? 3.2 : 1;
        const follow = 1 - Math.exp(-STACK.SMOOTH_FOLLOW * endBoost * delta);
        smoothStackIndexRef.current +=
          (targetStackIndexRef.current - smoothStackIndexRef.current) * follow;

        if (progress >= 0.9) {
          smoothStackIndexRef.current = CARD_COUNT - 1;
          targetStackIndexRef.current = CARD_COUNT - 1;
        }

        const sectionIndex = Math.round(targetStackIndexRef.current);
        if (sectionIndex !== activeCardIndexRef.current) {
          activeCardIndexRef.current = sectionIndex;
          setActiveCardIndex(sectionIndex);
          setActiveSection(sectionIndex);
        }
      }

      const pointerActive = !isTouchPrimary && !prefersReducedMotion && !expanded;
      const panelLookTargetX = pointerActive ? pointerTarget.x : 0;
      const panelLookTargetY = pointerActive ? pointerTarget.y : 0;
      const panelLookFollow = 1 - Math.exp(-PANEL_CAMERA_PARALLAX.lookAtFollowSharpness * delta);
      panelLookFollowSmooth.x += (panelLookTargetX - panelLookFollowSmooth.x) * panelLookFollow;
      panelLookFollowSmooth.y += (panelLookTargetY - panelLookFollowSmooth.y) * panelLookFollow;

      if (!expanded) {
        if (pointerActive) {
          applyPanelCameraParallax(
            cardCamera,
            panelLookFollowSmooth.x,
            panelLookFollowSmooth.y
          );
        } else {
          resetPanelCamera(cardCamera);
        }
      }

      syncCardsTo3DLayout(
        rigs,
        stackContainerRef.current,
        smoothStackIndexRef.current,
        expanded,
        w,
        h,
        panelLookFollowSmooth.x,
        panelLookFollowSmooth.y
      );

      if (!expanded) {
        cardRenderer.render(cardScene, cardCamera);
        css3dRenderer.render(css3dScene, cardCamera);
      }

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
      currentCameraPos.lerp(lerpTargets.cameraPos, lerpSpeed);
      currentLookAtPos.lerp(lerpTargets.lookAtPos, lerpSpeed);
      currentParticleOpacity += (targetConfig.particleOpacity - currentParticleOpacity) * lerpSpeed;
      currentFogDensity += (targetConfig.fogDensity - currentFogDensity) * lerpSpeed;

      particleMaterial.opacity = currentParticleOpacity;
      if (bgScene.fog instanceof THREE.FogExp2) bgScene.fog.density = currentFogDensity;

      if (pointerActive) {
        const follow = 1 - Math.exp(-BG_PARALLAX.followSharpness * delta);
        pointerSmooth.x += (pointerTarget.x - pointerSmooth.x) * follow;
        pointerSmooth.y += (pointerTarget.y - pointerSmooth.y) * follow;
      } else {
        pointerSmooth.x = 0;
        pointerSmooth.y = 0;
      }

      const px = pointerSmooth.x;
      const py = pointerSmooth.y;

      if (!prefersReducedMotion) {
        particles.rotation.y = elapsed * 0.015;
        particles.position.x = pointerActive ? -px * BG_PARALLAX.particlesX : 0;
        particles.position.y = pointerActive ? py * BG_PARALLAX.particlesY : 0;
      }

      bgCamera.position.copy(currentCameraPos);
      bgCamera.lookAt(currentLookAtPos);
      bgRenderer.render(bgScene, bgCamera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      bgRenderer.dispose();
      cardRenderer.dispose();
      [...cardGeometries, particleGeometry].forEach((g) => g.dispose());
      [...cardMaterials, particleMaterial].forEach((m) => m.dispose());
      rigs.forEach((rig) => disposeCardShell(rig.shell));
      if (bgContainer.contains(bgRenderer.domElement)) bgContainer.removeChild(bgRenderer.domElement);
      if (cardContainer.contains(cardRenderer.domElement)) {
        cardContainer.removeChild(cardRenderer.domElement);
      }
      if (cardContainer.contains(css3dRenderer.domElement)) {
        cardContainer.removeChild(css3dRenderer.domElement);
      }
      rigsRef.current.forEach((rig) => {
        rig.dom.style.visibility = "hidden";
      });
      rigsRef.current = [];
    };
  }, [cardsDomReady, setExpandedCardId, isMobile]);

  const activeCard = expandedCardId ? CARDS.find((c) => c.id === expandedCardId) : null;

  const handleCardClick = (cardId: string) => {
    if (expandedCardId) return;
    if (cardId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setExpandedCardId(cardId);
  };

  return (
    <>
      {!expandedCardId && !isMobile ? (
        <div
          className="fixed top-5 right-5 md:top-6 md:right-8 z-[100] pointer-events-none select-none font-mono text-[10px] tracking-[0.2em] text-white/45 tabular-nums"
          aria-live="polite"
          aria-label="Progreso de scroll"
        >
          <span className=" text-black" ref={scrollPercentRef}>0.0%</span>
        </div>
      ) : null}

      {isMobile && !expandedCardId && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-black/45 backdrop-blur-md border-b border-white/[0.04]">
          <Navbar />
        </div>
      )}

      <div ref={bgContainerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />

      <div
        ref={cardContainerRef}
        className="three-card-panel-scene fixed inset-0 z-[8] pointer-events-none"
        aria-hidden
      />

      {isMobile ? (
        <div className="mobile-portfolio-view relative z-10">
          {CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="mobile-card-item cursor-pointer overflow-hidden border border-white/[0.08] bg-[#050505]"
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${card.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
            >
              <CardPanelContent card={card} />
            </div>
          ))}
        </div>
      ) : (
        /* Track de scroll: 7 segmentos iguales (~14.29% cada uno) */
        <div
          ref={stackContainerRef}
          className="card-stack-container max-w-5xl mx-auto px-4 md:px-8 mt-4 relative z-[1]"
          aria-hidden
        >
          {CARDS.map((card) => (
            <div key={card.id} className="card-scroll-segment" />
          ))}
        </div>
      )}

      <div className="fixed -left-[200vw] top-0 w-0 h-0 overflow-visible pointer-events-none" aria-hidden>
        {CARDS.map((card, index) => (
          <div
            key={card.id}
            id={`card-${card.id}`}
            ref={(el) => {
              cardDomRefs.current[index] = el;
            }}
            className="three-card-dom card-stack-item-visual cursor-pointer overflow-hidden border border-white/[0.08] bg-[#050505]"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Abrir ${card.label}`}
          >
            <CardPanelContent card={card} />
          </div>
        ))}
      </div>

      {activeCard && (
        <div className="expanded-view fixed inset-0 z-[9999] overflow-y-auto expanded-content-scroll flex flex-col">
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
