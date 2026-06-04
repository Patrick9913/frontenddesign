"use client";

import { useEffect, useRef } from "react";
import { easeInOutCubic, getHeroScrollPhases } from "./moon-scene/useHeroScroll";

const PREY_AUDIO_SRC = "/prey.mp3";
const TARGET_VOLUME = 0.52;
const FADE_MS = 2200;

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function HeroSuspenseMoonAudio({
  scrollProgress,
  reducedMotion = false,
  gameStartProgress = 0,
}: {
  scrollProgress: number;
  reducedMotion?: boolean;
  gameStartProgress?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const unlockedRef = useRef(false);
  const playingRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);
  const scrollRef = useRef(scrollProgress);
  const playRef = useRef<() => Promise<void>>(async () => {});

  scrollRef.current = scrollProgress;

  playRef.current = async () => {
    const el = audioRef.current;
    if (!el || playingRef.current || !unlockedRef.current || reducedMotion) return;

    const { phase2Locked } = getHeroScrollPhases(scrollRef.current);
    if (!phase2Locked) return;

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    try {
      if (el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        el.load();
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            cleanup();
            resolve();
          };
          const onError = () => {
            cleanup();
            reject(new Error("load failed"));
          };
          const cleanup = () => {
            el.removeEventListener("canplay", onCanPlay);
            el.removeEventListener("error", onError);
          };
          el.addEventListener("canplay", onCanPlay, { once: true });
          el.addEventListener("error", onError, { once: true });
        });
      }

      el.currentTime = 0;
      el.volume = 0;
      await el.play();
      playingRef.current = true;

      const start = performance.now();
      const step = (now: number) => {
        const target = audioRef.current;
        if (!target || !playingRef.current) return;

        const t = Math.min(1, Math.max(0, (now - start) / FADE_MS));
        target.volume = clampVolume(TARGET_VOLUME * t);

        if (t < 1) {
          fadeFrameRef.current = requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
        }
      };

      fadeFrameRef.current = requestAnimationFrame(step);
    } catch {
      /* autoplay bloqueado o carga pendiente */
    }
  };

  useEffect(() => {
    if (reducedMotion) return;

    const unlock = async () => {
      const el = audioRef.current;
      if (!el) return;

      if (!unlockedRef.current) {
        try {
          el.volume = 0.001;
          await el.play();
          el.pause();
          el.currentTime = 0;
          el.volume = 0;
          unlockedRef.current = true;
        } catch {
          return;
        }
      }

      await playRef.current();
    };

    const onGesture = () => {
      void unlock();
    };

    window.addEventListener("wheel", onGesture, { passive: true });
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    window.addEventListener("touchstart", onGesture, { passive: true });

    return () => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
  }, [reducedMotion]);

  useEffect(() => {
    void playRef.current();
  }, [scrollProgress, reducedMotion]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !playingRef.current || gameStartProgress <= 0) return;

    const fade = easeInOutCubic(Math.min(1, gameStartProgress / 0.32));
    el.volume = clampVolume(TARGET_VOLUME * (1 - fade));

    if (fade >= 1) {
      el.pause();
      playingRef.current = false;
    }
  }, [gameStartProgress]);

  if (reducedMotion) return null;

  return (
    <audio
      ref={audioRef}
      src={PREY_AUDIO_SRC}
      preload="auto"
      loop
      playsInline
      className="sr-only"
      aria-hidden
    />
  );
}
