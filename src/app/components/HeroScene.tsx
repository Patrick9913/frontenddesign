"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const HALO_MAJOR_RADIUS = 4.2;
const HALO_TUBE_RADIUS = 0.32;
const HALO_SEGMENT_COUNT = 28;

const createHaloRing = () => {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const torusGeometry = new THREE.TorusGeometry(
    HALO_MAJOR_RADIUS,
    HALO_TUBE_RADIUS,
    20,
    160
  );
  geometries.push(torusGeometry);

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4dce8,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  materials.push(wireframeMaterial);

  const wireframeMesh = new THREE.Mesh(torusGeometry, wireframeMaterial);
  group.add(wireframeMesh);

  const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fa3b8,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });
  materials.push(bodyMaterial);

  const bodyMesh = new THREE.Mesh(torusGeometry, bodyMaterial);
  group.add(bodyMesh);

  const edgeGeometry = new THREE.EdgesGeometry(torusGeometry, 12);
  geometries.push(edgeGeometry);

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xf0f4fa,
    transparent: true,
    opacity: 0.42,
  });
  materials.push(edgeMaterial);

  const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  group.add(edgeLines);

  const innerRimGeometry = new THREE.TorusGeometry(
    HALO_MAJOR_RADIUS - HALO_TUBE_RADIUS * 0.72,
    0.018,
    8,
    160
  );
  geometries.push(innerRimGeometry);

  const innerRimMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
  });
  materials.push(innerRimMaterial);

  const innerRim = new THREE.Mesh(innerRimGeometry, innerRimMaterial);
  group.add(innerRim);

  const outerRimGeometry = new THREE.TorusGeometry(
    HALO_MAJOR_RADIUS + HALO_TUBE_RADIUS * 0.72,
    0.012,
    8,
    160
  );
  geometries.push(outerRimGeometry);

  const outerRimMaterial = new THREE.MeshBasicMaterial({
    color: 0xc8d4e4,
    transparent: true,
    opacity: 0.2,
  });
  materials.push(outerRimMaterial);

  const outerRim = new THREE.Mesh(outerRimGeometry, outerRimMaterial);
  group.add(outerRim);

  const panelGeometry = new THREE.BoxGeometry(0.22, 0.06, 0.55);
  geometries.push(panelGeometry);

  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0xe8eef6,
    transparent: true,
    opacity: 0.16,
  });
  materials.push(panelMaterial);

  const innerRadius = HALO_MAJOR_RADIUS - HALO_TUBE_RADIUS * 0.55;
  for (let i = 0; i < HALO_SEGMENT_COUNT; i++) {
    const angle = (i / HALO_SEGMENT_COUNT) * Math.PI * 2;
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(
      Math.cos(angle) * innerRadius,
      0,
      Math.sin(angle) * innerRadius
    );
    panel.lookAt(0, 0, 0);
    panel.rotateY(Math.PI / 2);
    group.add(panel);
  }

  const bridgeGeometry = new THREE.BoxGeometry(0.08, HALO_TUBE_RADIUS * 1.6, 0.08);
  geometries.push(bridgeGeometry);

  const bridgeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
  });
  materials.push(bridgeMaterial);

  for (let i = 0; i < HALO_SEGMENT_COUNT; i += 2) {
    const angle = (i / HALO_SEGMENT_COUNT) * Math.PI * 2;
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.position.set(
      Math.cos(angle) * (innerRadius + 0.05),
      0,
      Math.sin(angle) * (innerRadius + 0.05)
    );
    bridge.lookAt(0, 0, 0);
    group.add(bridge);
  }

  group.rotation.x = Math.PI * 0.42;
  group.rotation.z = Math.PI * 0.06;

  return { group, geometries, materials };
};

export const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 0.3, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const { group: haloRing, geometries, materials } = createHaloRing();
    haloRing.position.set(0.8, 0, -1.5);
    scene.add(haloRing);

    const particleCount = prefersReducedMotion ? 40 : 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8d4e4,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (isCoarsePointer) return;
      targetRotationY = (event.clientX / window.innerWidth - 0.5) * 0.5;
      targetRotationX = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    if (!isCoarsePointer) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    window.addEventListener("resize", handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        haloRing.rotation.y = elapsed * 0.06;
        haloRing.position.y = Math.sin(elapsed * 0.45) * 0.18;
        particles.rotation.y = elapsed * 0.015;
      }

      if (!isCoarsePointer && !prefersReducedMotion) {
        currentRotationX += (targetRotationX - currentRotationX) * 0.04;
        currentRotationY += (targetRotationY - currentRotationY) * 0.04;
        haloRing.rotation.x = Math.PI * 0.42 + currentRotationX * 0.25;
        haloRing.rotation.z = Math.PI * 0.06 + currentRotationY * 0.15;
        camera.position.x = currentRotationY * 0.6;
        camera.position.y = 0.3 - currentRotationX * 0.4;
        camera.lookAt(0.8, 0, -1.5);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
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
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
};

export default HeroScene;
