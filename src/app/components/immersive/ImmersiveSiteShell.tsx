"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AboutPanel } from "../AboutPanel";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { notifySceneUi, useScene } from "../../scene/SceneContext";
import { sceneStore } from "../../scene/sceneStore";
import { getImmersiveScrollHeightVh, useImmersiveScroll } from "../../scene/useImmersiveScroll";
import { SceneAudio } from "../../scene/SceneAudio";
import { ContactPanel } from "./ContactPanel";
import { ExperiencePanel } from "./ExperiencePanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { SiteHudNavbar } from "./SiteHudNavbar";
import { SkillsPanel } from "./SkillsPanel";

const HeroCubeScene = dynamic(() => import("../HeroCubeScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

const SECTION_INDEX = "[ 00 ]";

const COPY = {
  overline: "Portfolio",
  title: { line1: "FRONTEND", accent: "DESIGNER" },
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

function ImmersiveStage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state, setExploreMode, setAudioEnabled } = useScene();

  useImmersiveScroll(scrollRef);

  useEffect(() => {
    sceneStore.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activateFromHash = () => {
      if (window.location.hash === "#about") {
        setExploreMode(true);
        sceneStore.exploreMode = true;
        notifySceneUi();
      }
    };
    activateFromHash();
    window.addEventListener("hashchange", activateFromHash);
    return () => window.removeEventListener("hashchange", activateFromHash);
  }, [setExploreMode]);

  const heroProgress = state.heroScrollProgress;
  const titleScale = 1 - heroProgress * 0.58;
  const titleY = -heroProgress * 72;
  const contentOpacity = clamp((heroProgress - 0.18) / 0.45, 0, 1);
  const contentY = (1 - contentOpacity) * 48;
  const cleanAmount = clamp((heroProgress - 0.78) / 0.22, 0, 1);
  const uiOpacity = 1 - cleanAmount;
  const vignetteOpacity = 0.12 + heroProgress * 0.08;

  const showSection = (id: typeof state.activeSection) =>
    state.exploreMode && state.activeSection === id;

  return (
    <div
      ref={scrollRef}
      className="relative w-full bg-black text-[#F0F0F0] font-sans"
      style={{ minHeight: `${getImmersiveScrollHeightVh()}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroCubeScene onExplore={() => setExploreMode(true)} />
        </div>

        <SiteHudNavbar />
        <SceneAudio enabled={state.audioEnabled} />

        <button
          type="button"
          onClick={() => setAudioEnabled(!state.audioEnabled)}
          className="fixed bottom-6 right-6 z-[55] border border-white/15 bg-black/50 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white/70 motion-reduce:hidden"
          aria-pressed={state.audioEnabled}
        >
          {state.audioEnabled ? "Audio on" : "Audio off"}
        </button>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.65)_100%)]"
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

        {/* Hero UI */}
        <div
          className="relative z-10 flex h-full w-full flex-col transition-opacity duration-700"
          style={{ opacity: uiOpacity, pointerEvents: uiOpacity > 0.08 ? "auto" : "none" }}
        >
          <div className="w-full pt-4">
            <Navbar />
          </div>
          <div className="relative flex flex-grow flex-col items-center justify-center px-8 md:px-16 lg:px-24">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ transform: `translateY(${titleY}px) scale(${titleScale})` }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 md:text-xs">
                  {SECTION_INDEX}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 md:text-xs">
                  {COPY.overline}
                </span>
              </div>
              <h1 className="text-[clamp(3rem,14vw,9rem)] font-light leading-[0.92] tracking-[-0.03em]">
                {COPY.title.line1}
                <br />
                <span className="font-medium text-white/45">{COPY.title.accent}</span>
              </h1>
              <div className="mt-8 h-px w-8 bg-white/[0.08] md:mt-10 md:w-12" />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-8 pb-14 md:px-16 md:pb-20 lg:px-24"
              style={{
                opacity: contentOpacity,
                transform: `translateY(${contentY}px)`,
                pointerEvents: contentOpacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="mb-10 max-w-xl text-sm font-light leading-[1.75] text-white/50 md:text-base">
                {COPY.body}
              </p>
              <div className="flex flex-wrap gap-4 border-t border-white/[0.08] pt-6">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-4 bg-[#F0F0F0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-black"
                >
                  Explorar Proyectos →
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-4 border border-white/20 px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-white/50"
                >
                  Contactar ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section overlays */}
        <div
          id="about"
          className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 pt-24"
          style={{
            opacity: showSection("about") ? state.aboutScrollProgress : 0,
            pointerEvents: showSection("about") && state.aboutScrollProgress > 0.12 ? "auto" : "none",
          }}
        >
          <AboutPanel scrollProgress={state.aboutScrollProgress} />
        </div>

        <div
          id="experience"
          className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 pt-24"
          style={{
            opacity: showSection("experience") ? state.sectionProgress : 0,
            pointerEvents: showSection("experience") && state.sectionProgress > 0.12 ? "auto" : "none",
          }}
        >
          <ExperiencePanel progress={state.sectionProgress} />
        </div>

        <div
          id="skills"
          className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 pt-24"
          style={{
            opacity: showSection("skills") ? state.sectionProgress : 0,
            pointerEvents: showSection("skills") && state.sectionProgress > 0.12 ? "auto" : "none",
          }}
        >
          <SkillsPanel progress={state.sectionProgress} />
        </div>

        <div
          id="projects"
          className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 pt-24"
          style={{
            opacity: showSection("projects") ? state.sectionProgress : 0,
            pointerEvents: showSection("projects") && state.sectionProgress > 0.12 ? "auto" : "none",
          }}
        >
          <ProjectsPanel progress={state.sectionProgress} />
        </div>

        <div
          id="contact"
          className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 pt-24 overflow-y-auto"
          style={{
            opacity: showSection("contact") ? state.sectionProgress : 0,
            pointerEvents: showSection("contact") && state.sectionProgress > 0.12 ? "auto" : "none",
          }}
        >
          <ContactPanel progress={state.sectionProgress} />
        </div>

        {state.showExploreHint && !state.exploreMode && (
          <p className="pointer-events-none absolute bottom-8 left-1/2 z-[5] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
            Toca el cubo para explorar
          </p>
        )}
      </div>

      <div className="relative z-[1] motion-reduce:hidden">
        <Footer />
      </div>
    </div>
  );
}

export function ImmersiveSiteShell() {
  return <ImmersiveStage />;
}

export default ImmersiveSiteShell;
