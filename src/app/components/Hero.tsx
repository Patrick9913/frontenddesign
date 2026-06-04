"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AboutPanel } from "./AboutPanel";
import { Navbar } from "./Navbar";
import { notifySceneUi } from "../scene/SceneContext";
import { sceneStore } from "../scene/sceneStore";

const HeroCubeScene = dynamic(() => import("./HeroCubeScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

const SECTION_INDEX = "[ 00 ]";
const PHASE1_VH = 185;
const PHASE2_VH = 145;

const COPY = {
  overline: "Portfolio",
  title: {
    line1: "FRONTEND",
    accent: "DESIGNER",
  },
  body:
    "Especializado en React, Next.js y TypeScript. Creando interfaces inmersivas, esculpiendo componentes y diseñando experiencias de usuario dinámicas con profunda atención al detalle y la estética visual.",
} as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Patrick9913", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
    external: true,
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com", external: false },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [aboutScrollProgress, setAboutScrollProgress] = useState(0);
  const [exploreMode, setExploreMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const activateFromHash = () => {
      if (window.location.hash === "#about") {
        setExploreMode(true);
      }
    };

    activateFromHash();
    window.addEventListener("hashchange", activateFromHash);
    return () => window.removeEventListener("hashchange", activateFromHash);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const section = heroRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const phase1Height = (PHASE1_VH / 100) * vh;
      const totalHeight = ((PHASE1_VH + PHASE2_VH) / 100) * vh;
      const scrollable = totalHeight - vh;

      if (scrollable <= 0) {
        setScrollProgress(0);
        setAboutScrollProgress(0);
        return;
      }

      const scrolled = clamp(-section.getBoundingClientRect().top, 0, scrollable);
      const phase1Scrollable = Math.max(phase1Height - vh, 1);

      setScrollProgress(clamp(scrolled / phase1Scrollable, 0, 1));

      const phase2Scrollable = Math.max(scrollable - phase1Scrollable, 1);
      const phase2Scrolled = clamp(scrolled - phase1Scrollable, 0, phase2Scrollable);
      setAboutScrollProgress(exploreMode ? clamp(phase2Scrolled / phase2Scrollable, 0, 1) : 0);

      sceneStore.heroScrollProgress = clamp(scrolled / phase1Scrollable, 0, 1);
      sceneStore.aboutScrollProgress = exploreMode ? clamp(phase2Scrolled / phase2Scrollable, 0, 1) : 0;
      sceneStore.exploreMode = exploreMode;
      sceneStore.showExploreHint = sceneStore.heroScrollProgress > 0.82 && !exploreMode;
      sceneStore.activeSection = exploreMode ? "about" : "hero";
      notifySceneUi();
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [exploreMode]);

  const titleScale = 1 - scrollProgress * 0.58;
  const titleY = -scrollProgress * 72;
  const contentOpacity = clamp((scrollProgress - 0.18) / 0.45, 0, 1);
  const contentY = (1 - contentOpacity) * 48;
  const cleanAmount = clamp((scrollProgress - 0.78) / 0.22, 0, 1);
  const uiOpacity = 1 - cleanAmount;
  const showExploreHint = cleanAmount > 0.82 && !exploreMode;
  const vignetteOpacity = 0.12 + scrollProgress * 0.08;
  const aboutUiOpacity = exploreMode ? aboutScrollProgress : 0;

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full bg-black text-[#F0F0F0] font-sans motion-reduce:min-h-[185vh]"
      style={{ minHeight: `${PHASE1_VH + PHASE2_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full">
          <HeroCubeScene
            onExplore={() => {
              setExploreMode(true);
              sceneStore.exploreMode = true;
              notifySceneUi();
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.65)_100%)] transition-opacity duration-300"
          style={{ opacity: vignetteOpacity }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)",
          }}
          aria-hidden
        />

        <div
          className="relative z-10 flex h-full w-full flex-col transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100"
          style={{ opacity: uiOpacity, pointerEvents: uiOpacity > 0.08 ? "auto" : "none" }}
        >
          <div className="w-full pt-4">
            <Navbar />
          </div>

          <div className="relative flex flex-grow flex-col items-center justify-center px-8 md:px-16 lg:px-24">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center will-change-transform"
              style={{
                transform: `translateY(${titleY}px) scale(${titleScale})`,
                transformOrigin: "center center",
              }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] font-light tracking-[0.25em] uppercase text-white/40 md:text-xs">
                  {SECTION_INDEX}
                </span>
                <span className="text-[10px] font-light tracking-[0.25em] uppercase text-white/40 md:text-xs">
                  {COPY.overline}
                </span>
              </div>

              <h1 className="text-[clamp(3rem,14vw,9rem)] font-light leading-[0.92] tracking-[-0.03em] text-[#F0F0F0]">
                {COPY.title.line1}
                <br />
                <span className="font-medium text-white/45">{COPY.title.accent}</span>
              </h1>

              <div className="mt-8 h-px w-8 bg-white/[0.08] md:mt-10 md:w-12" aria-hidden />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-7xl px-8 pb-14 will-change-transform md:px-16 md:pb-20 lg:px-24"
              style={{
                opacity: contentOpacity,
                transform: `translateY(${contentY}px)`,
                pointerEvents: contentOpacity > 0.2 ? "auto" : "none",
              }}
            >
              <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
                <div className="flex flex-col lg:col-span-7 xl:col-span-8">
                  <p className="mb-10 max-w-xl text-sm font-light leading-[1.75] tracking-wide text-white/50 md:mb-14 md:text-base">
                    {COPY.body}
                  </p>

                  <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:gap-6">
                    <a
                      href="#projects"
                      className="group inline-flex w-fit items-center gap-4 rounded-none bg-[#F0F0F0] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 md:text-xs"
                    >
                      Explorar Proyectos
                      <span
                        className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex w-fit items-center gap-4 rounded-none border border-white/20 bg-transparent px-8 py-4 text-[10px] font-light uppercase tracking-[0.2em] text-white/50 transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/40 hover:text-[#F0F0F0] md:text-xs"
                    >
                      Contactar
                      <span className="text-base" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </div>
                </div>

                <aside className="flex flex-row items-end justify-between gap-12 lg:col-span-4 lg:col-start-9 lg:min-h-[220px] lg:flex-col lg:justify-end xl:col-start-10">
                  <nav
                    className="flex flex-row gap-6 lg:flex-col lg:gap-8"
                    aria-label="Redes sociales"
                  >
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] md:text-xs"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>

                  <div className="hidden flex-col items-center gap-6 md:flex">
                    <div className="relative h-16 w-px overflow-hidden bg-white/[0.08]">
                      <div className="hero-scroll-indicator absolute left-0 top-0 h-1/2 w-full bg-white/50" />
                    </div>
                    <span
                      className="font-mono text-[10px] font-light uppercase tracking-[0.3em] text-white/40"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      Scroll
                    </span>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          <div className="relative z-10 h-px w-full bg-white/[0.08]" aria-hidden />
        </div>

        <div
          id="about"
          className="absolute inset-0 z-20 flex items-end overflow-y-auto pb-16 md:pb-24 lg:pb-28 pt-24 motion-reduce:hidden"
          style={{
            opacity: aboutUiOpacity,
            pointerEvents: exploreMode && aboutScrollProgress > 0.12 ? "auto" : "none",
          }}
          aria-hidden={!exploreMode || aboutScrollProgress < 0.05}
        >
          <AboutPanel scrollProgress={aboutScrollProgress} />
        </div>

        {showExploreHint && !reducedMotion && (
          <p
            className="pointer-events-none absolute bottom-8 left-1/2 z-[5] -translate-x-1/2 font-mono text-[10px] font-light uppercase tracking-[0.28em] text-white/30 motion-reduce:hidden"
            aria-hidden
          >
            Toca el cubo para explorar
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
