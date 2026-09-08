"use client";

import { useEffect, useState } from "react";
import { parallaxStyle, useMouseParallax } from "./useMouseParallax";

const COPY = {
  eyebrow: "Portfolio",
  body: "Interfaces con React, Next.js y TypeScript. Detalle visual, claridad de uso y producto que se siente bien al usarlo.",
} as const;

const PHRASES = [
  { line1: "Patrick", line2: "Ordoñez" },
  { line1: "Front End", line2: "Developer" },
] as const;

const INTRO_DELAY_MS = 900;
const TYPE_MS = 95;
const TYPE_LINE_PAUSE_MS = 380;
const DELETE_MS = 32;
const HOLD_NAME_MS = 2800;
const HOLD_ROLE_MS = 18000;
const HOLD_BEFORE_DELETE_MS = 520;
const PAUSE_BETWEEN_MS = 700;

type Phase =
  | "intro"
  | "typing"
  | "linePause"
  | "holding"
  | "preDelete"
  | "deleting"
  | "pausing";

function HeroHeadline({ active }: { active: boolean }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState<Phase>("intro");
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reducedMotion || !active) return;

    const phrase = PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "intro") {
      timeout = setTimeout(() => setPhase("typing"), INTRO_DELAY_MS);
    } else if (phase === "typing") {
      if (line1.length < phrase.line1.length) {
        const jitter = Math.random() * 35;
        timeout = setTimeout(() => {
          setLine1(phrase.line1.slice(0, line1.length + 1));
        }, TYPE_MS + jitter);
      } else if (line2.length === 0 && phrase.line2.length > 0) {
        timeout = setTimeout(() => setPhase("linePause"), 0);
      } else if (line2.length < phrase.line2.length) {
        const jitter = Math.random() * 35;
        timeout = setTimeout(() => {
          setLine2(phrase.line2.slice(0, line2.length + 1));
        }, TYPE_MS + jitter);
      } else {
        timeout = setTimeout(() => {
          setComplete(true);
          setPhase("holding");
        }, 0);
      }
    } else if (phase === "linePause") {
      timeout = setTimeout(() => {
        setLine2(phrase.line2.slice(0, 1));
        setPhase("typing");
      }, TYPE_LINE_PAUSE_MS);
    } else if (phase === "holding") {
      const hold = phraseIndex === 0 ? HOLD_NAME_MS : HOLD_ROLE_MS;
      timeout = setTimeout(() => setPhase("preDelete"), hold);
    } else if (phase === "preDelete") {
      setComplete(false);
      timeout = setTimeout(() => setPhase("deleting"), HOLD_BEFORE_DELETE_MS);
    } else if (phase === "deleting") {
      if (line2.length > 0) {
        timeout = setTimeout(() => {
          setLine2((prev) => prev.slice(0, -1));
        }, DELETE_MS);
      } else if (line1.length > 0) {
        timeout = setTimeout(() => {
          setLine1((prev) => prev.slice(0, -1));
        }, DELETE_MS);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 0);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setPhase("typing");
      }, PAUSE_BETWEEN_MS);
    }

    return () => clearTimeout(timeout);
  }, [phase, line1, line2, phraseIndex, reducedMotion, active]);

  if (reducedMotion) {
    return (
      <h1 className="mb-6 text-5xl font-extralight uppercase leading-tight tracking-widest text-white md:text-7xl lg:text-8xl">
        Front End{" "}
        <br className="hidden md:block" />
        <span className="font-normal text-white/90">Developer</span>
      </h1>
    );
  }

  const showCursorOnLine1 =
    (phase === "typing" && line1.length < PHRASES[phraseIndex].line1.length) ||
    (phase === "deleting" && line2.length === 0 && line1.length > 0) ||
    phase === "linePause";
  const showCursorOnLine2 =
    (phase === "typing" &&
      line1.length === PHRASES[phraseIndex].line1.length &&
      line2.length > 0) ||
    phase === "holding" ||
    phase === "preDelete" ||
    (phase === "deleting" && line2.length > 0);

  return (
    <h1
      className={`hero-cinematic-title mb-6 min-h-[2.2em] text-5xl font-extralight uppercase leading-tight tracking-widest text-white md:min-h-[2.15em] md:text-7xl lg:text-8xl ${
        complete ? "hero-cinematic-title--complete" : ""
      } ${phase === "preDelete" ? "hero-cinematic-title--fade" : ""}`}
      aria-label={`${PHRASES[phraseIndex].line1} ${PHRASES[phraseIndex].line2}`}
    >
      <span className="inline">
        {line1}
        {showCursorOnLine1 && <span className="hero-type-cursor" aria-hidden />}
      </span>
      <br className="hidden md:block" />
      <span className="md:hidden"> </span>
      <span className="font-normal text-white/90">
        {line2}
        {showCursorOnLine2 && <span className="hero-type-cursor" aria-hidden />}
      </span>
    </h1>
  );
}

export const Hero = () => {
  const pointer = useMouseParallax();
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setContentReady(true);
      return;
    }
    const id = setTimeout(() => setContentReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      id="home"
      className="relative flex h-screen w-full items-center overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: "url('/antoine-collignon-4.webp')" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/92 via-black/55 to-black/20" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
      <div className="hero-cinematic-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-cinematic-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-center px-8 sm:px-16 lg:px-24 transition-opacity duration-1000 ${
          contentReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="will-change-transform"
          style={parallaxStyle(pointer.x, pointer.y, 10)}
        >
          <h2
            className={`mb-6 text-xs font-light uppercase tracking-[0.4em] text-white/50 transition-[opacity,transform] duration-1000 sm:text-sm ${
              contentReady
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            {COPY.eyebrow}
          </h2>
        </div>

        <div
          className="will-change-transform"
          style={parallaxStyle(pointer.x, pointer.y, 22)}
        >
          <HeroHeadline active={contentReady} />
        </div>

        <div
          className="will-change-transform"
          style={parallaxStyle(pointer.x, pointer.y, 14)}
        >
          <p
            className={`mb-12 max-w-xl text-base font-light leading-relaxed text-white/70 transition-[opacity] delay-300 duration-1000 md:text-lg lg:text-xl ${
              contentReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {COPY.body}
          </p>
        </div>

        <div
          className="will-change-transform"
          style={parallaxStyle(pointer.x, pointer.y, 16)}
        >
          <div
            className={`flex flex-col gap-6 transition-[opacity] delay-500 duration-1000 sm:flex-row ${
              contentReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <a
              href="#works"
              className="group flex cursor-pointer items-center gap-4 bg-white/90 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black transition-colors duration-500 hover:bg-white"
            >
              Explorar Proyectos
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-block cursor-pointer border border-white/20 bg-transparent px-8 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-[color,border-color,background-color] duration-500 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              Contactar
            </a>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-12 left-8 z-10 flex flex-col items-center gap-4 opacity-70 will-change-transform sm:left-16 lg:left-24"
        style={parallaxStyle(pointer.x, pointer.y, 5)}
      >
        <div className="relative h-12 w-px overflow-hidden bg-white/20">
          <div className="hero-scroll-indicator h-1/2 w-full rounded-full bg-white/80" />
        </div>
        <span className="-ml-1 text-[9px] font-light uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
