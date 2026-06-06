"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CinematicIntroText } from "./CinematicIntroText";
import { PhotoModeToolbar } from "./PhotoModeToolbar";
import { HeroSceneTuningPanel } from "./HeroSceneTuningPanel";
import { FleetCommandCursorHud } from "./FleetCommandCursorHud";
import { FleetFlyModeSync } from "./FleetFlyModeSync";
import { FleetPhotoModeSync } from "./FleetPhotoModeSync";
import { FleetCommandProvider } from "./moon-scene/fleetCommandContext";
import { SceneTuningProvider } from "./moon-scene/SceneTuningContext";
import { QualityProfileProvider } from "./hero-scene/useQualityProfile";
import { HERO_SCROLL_VH, useHeroScroll } from "./moon-scene/useHeroScroll";

const MoonHeroScene = dynamic(() => import("./moon-scene/MoonHeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

type HeroProps = {
  photoMode?: boolean;
  onTogglePhotoMode?: () => void;
};

export const Hero = ({ photoMode = false, onTogglePhotoMode }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useHeroScroll(sectionRef);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [flyMode, setFlyMode] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!photoMode) return;
    setOptionsOpen(false);
  }, [photoMode]);

  useEffect(() => {
    if (!flyMode) return;

    const section = sectionRef.current;
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
      }
    };

    const preventWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    const lockScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const unlockScroll = () => {
      document.body.style.overflow = "";
    };

    lockScroll();
    window.addEventListener("keydown", preventScrollKeys, { capture: true });
    section?.addEventListener("wheel", preventWheel, { passive: false });

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", preventScrollKeys, { capture: true });
      section?.removeEventListener("wheel", preventWheel);
    };
  }, [flyMode]);

  useEffect(() => {
    if (!flyMode) return;
    setOptionsOpen(false);
  }, [flyMode]);

  const showScrollHint = !photoMode && !reducedMotion && scrollProgress < 0.08;
  const sceneScrollProgress = reducedMotion ? 0 : scrollProgress;
  const strategyEnabled = flyMode && !photoMode && !reducedMotion;
  const layoutEditEnabled = optionsOpen && !photoMode && !reducedMotion && !flyMode;

  const handleToggleFlyMode = () => {
    setFlyMode((prev) => {
      if (!prev) setOptionsOpen(false);
      return !prev;
    });
  };

  return (
    <QualityProfileProvider>
      <FleetCommandProvider>
      <FleetPhotoModeSync photoMode={photoMode} />
      <FleetFlyModeSync flyMode={flyMode} />
      <SceneTuningProvider layoutEditEnabled={layoutEditEnabled}>
        <section
          ref={sectionRef}
          id="hero"
          className="relative w-full bg-black text-[#F0F0F0]"
          style={{ height: `${HERO_SCROLL_VH}vh` }}
        >
          <div
            className="sticky top-0 h-screen w-full overflow-hidden"
            onContextMenu={(event) => event.preventDefault()}
          >
            <div className="absolute inset-0 z-0 pointer-events-auto">
              {!reducedMotion ? (
                <MoonHeroScene
                  scrollProgress={sceneScrollProgress}
                  flyMode={flyMode}
                  photoMode={photoMode}
                  onFlyModeExit={() => setFlyMode(false)}
                />
              ) : (
                <div
                  className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1e_0%,#000_58%)]"
                  aria-hidden
                />
              )}
            </div>

            {!photoMode ? (
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,rgba(0,0,0,0.22)_48%,rgba(0,0,0,0.78)_100%)]"
                aria-hidden
              />
            ) : null}

            {!photoMode ? (
              <CinematicIntroText scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
            ) : null}

            <FleetCommandCursorHud active={strategyEnabled} />

            {!photoMode && !reducedMotion ? (
              <PhotoModeToolbar
                photoMode={photoMode}
                optionsOpen={optionsOpen}
                flyMode={flyMode}
                onTogglePhotoMode={onTogglePhotoMode ?? (() => undefined)}
                onToggleOptions={() => setOptionsOpen((open) => !open)}
                onToggleFlyMode={handleToggleFlyMode}
              />
            ) : null}

            {optionsOpen && !photoMode && !reducedMotion ? <HeroSceneTuningPanel /> : null}

            <div className="pointer-events-none relative z-10 flex h-full flex-col">
              {showScrollHint ? (
                <div className="pointer-events-none flex flex-1 flex-col justify-end px-8 pb-12 md:px-16 md:pb-16 lg:px-24">
                  <p className="max-w-xs font-mono text-[10px] font-light uppercase tracking-[0.32em] text-white/25 opacity-0 animate-[fadeIn_2.4s_ease_0.8s_forwards]">
                    Scroll para explorar
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </SceneTuningProvider>
      </FleetCommandProvider>
    </QualityProfileProvider>
  );
};

export default Hero;
