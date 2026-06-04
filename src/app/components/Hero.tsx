"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroDarkSideHint } from "./HeroDarkSideHint";
import { HeroExploreCallout } from "./HeroExploreCallout";
import { HeroFlyModeToggle } from "./HeroFlyModeToggle";
import { HeroMoonLorePanel } from "./HeroMoonLorePanel";
import { HeroMarsReturnButton } from "./HeroMarsReturnButton";
import { HeroIntroPanel } from "./HeroIntroPanel";
import { HeroSuspenseMoonAudio } from "./HeroSuspenseMoonAudio";
import { Navbar } from "./Navbar";
import { getHeroScrollPhases, HERO_SCROLL_COMPLETE, HERO_SCROLL_VH, useHeroScroll } from "./moon-scene/useHeroScroll";
import { useHeroGameStart } from "./moon-scene/useHeroGameStart";
import { useHeroMarsTravel } from "./moon-scene/useHeroMarsTravel";

const SHOW_NAVBAR = false;
const SHOW_INTRO_PANEL = false;

const MoonHeroScene = dynamic(() => import("./moon-scene/MoonHeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useHeroScroll(sectionRef);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [flyMode, setFlyMode] = useState(false);
  const [moonLoreOpen, setMoonLoreOpen] = useState(false);
  const { progress: gameStartProgress, active: gameStartActive, loading, start: startGame, visuals: gameStartVisuals } =
    useHeroGameStart();
  const {
    progress: marsTravelProgress,
    active: marsTravelActive,
    returning: marsReturning,
    atMars,
    start: startMarsTravel,
    returnToMoon,
  } = useHeroMarsTravel();

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  const { phase2Raw } = getHeroScrollPhases(scrollProgress);
  const showScrollHint =
    !reducedMotion && scrollProgress < 0.1 && !gameStartActive && !marsTravelActive;
  const showDarkSideHint =
    !reducedMotion &&
    !gameStartActive &&
    !marsTravelActive &&
    phase2Raw > 0.08 &&
    scrollProgress < HERO_SCROLL_COMPLETE - 0.04;
  const showExploreCallout =
    !reducedMotion &&
    !atMars &&
    !moonLoreOpen &&
    ((scrollProgress >= HERO_SCROLL_COMPLETE - 0.06 && !gameStartActive && !marsTravelActive) ||
      (gameStartActive && gameStartProgress < 0.86) ||
      (marsTravelActive && marsTravelProgress < 0.2 && !marsReturning));
  const canInspectMoon =
    !reducedMotion && !flyMode && !marsTravelActive && !gameStartActive && !atMars;
  const sceneScrollProgress = reducedMotion ? 0 : scrollProgress;
  const introScrollProgress = reducedMotion ? 1 : scrollProgress;
  const darkenOpacity = gameStartActive || loading ? gameStartVisuals.darken : 0;

  return (
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
              marsTravelProgress={marsTravelProgress}
              flyMode={flyMode}
              onFlyModeExit={() => setFlyMode(false)}
              moonLoreOpen={moonLoreOpen}
              moonInspectable={canInspectMoon}
              onMoonLoreOpen={() => setMoonLoreOpen(true)}
            />
          ) : (
            <div
              className="h-full w-full bg-[radial-gradient(circle_at_18%_50%,#4a4a4e_0%,#1a1a1e_18%,#000_52%)]"
              aria-hidden
            />
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_18%_50%,transparent_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.62)_100%)]"
          aria-hidden
        />

        {SHOW_INTRO_PANEL ? (
          <HeroIntroPanel scrollProgress={introScrollProgress} reducedMotion={reducedMotion} />
        ) : null}
        {showDarkSideHint ? <HeroDarkSideHint scrollProgress={scrollProgress} /> : null}
        {showExploreCallout ? (
          <HeroExploreCallout
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
            gameStartProgress={gameStartProgress}
            marsTravelProgress={marsTravelProgress}
            loading={loading}
            onStartGame={startGame}
            onLoadGame={startMarsTravel}
          />
        ) : null}

        {!reducedMotion ? (
          <>
            <HeroFlyModeToggle
              active={flyMode}
              onToggle={() => {
                setFlyMode((prev) => !prev);
                if (!flyMode) setMoonLoreOpen(false);
              }}
              reducedMotion={reducedMotion}
            />
            <HeroMarsReturnButton visible={atMars} onReturnToMoon={returnToMoon} />
            <HeroMoonLorePanel
              open={moonLoreOpen}
              onClose={() => setMoonLoreOpen(false)}
              reducedMotion={reducedMotion}
            />
          </>
        ) : null}

        {canInspectMoon && !moonLoreOpen ? (
          <p className="pointer-events-none absolute bottom-[10%] right-[7%] z-[20] max-w-[11rem] text-right font-mono text-[9px] font-light uppercase leading-relaxed tracking-[0.24em] text-white/30 md:bottom-[12%] md:right-[8%]">
            Clic en la Luna · dossier · botón derecho para girar vista
          </p>
        ) : null}

        {gameStartActive ? (
          <div
            className="pointer-events-none absolute inset-0 z-[28] bg-black"
            style={{ opacity: darkenOpacity }}
            aria-hidden
          />
        ) : null}

        {gameStartVisuals.showLoading ? (
          <div
            className="pointer-events-none absolute bottom-[18%] left-[7%] z-[35] md:bottom-[16%] md:left-[8%]"
            style={{ opacity: gameStartVisuals.loadingOpacity }}
            aria-live="polite"
          >
            <div className="flex items-center gap-3.5">
              <span className="hero-loading-spinner" aria-hidden />
              <span className="hero-loading-label font-mono text-xs font-light uppercase tracking-[0.32em] text-amber-100/65 md:text-sm">
                Cargando
              </span>
            </div>
          </div>
        ) : null}

        {!reducedMotion ? (
          <HeroSuspenseMoonAudio
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
            gameStartProgress={gameStartProgress}
          />
        ) : null}

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          {SHOW_NAVBAR ? (
            <div className="w-full pt-4 opacity-0 animate-[fadeIn_1.8s_ease_forwards] motion-reduce:opacity-100">
              <Navbar />
            </div>
          ) : null}

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
  );
};

export default Hero;
