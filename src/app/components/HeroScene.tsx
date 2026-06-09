"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createHaloRing } from "./createHaloRing";

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
