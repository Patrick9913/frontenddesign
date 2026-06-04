"use client";

import { useEffect, useRef } from "react";
import { sceneStore } from "./sceneStore";

type SceneAudioProps = {
  enabled: boolean;
};

export function SceneAudio({ enabled }: SceneAudioProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.4);
      }
      const t = window.setTimeout(() => {
        try {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          gainRef.current?.disconnect();
          void ctxRef.current?.close();
        } catch {
          /* ignore */
        }
        oscRef.current = null;
        gainRef.current = null;
        ctxRef.current = null;
      }, 450);
      return () => window.clearTimeout(t);
    }

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = 42;
    filter.type = "lowpass";
    filter.frequency.value = 180;
    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.028, ctx.currentTime + 1.2);

    ctxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;

    const freqMap: Record<string, number> = {
      hero: 42,
      about: 58,
      experience: 55,
      skills: 72,
      projects: 88,
      contact: 48,
    };

    const interval = window.setInterval(() => {
      if (!oscRef.current || !ctxRef.current) return;
      const target = freqMap[sceneStore.activeSection] ?? 50;
      oscRef.current.frequency.linearRampToValueAtTime(target, ctxRef.current.currentTime + 0.6);
    }, 800);

    return () => {
      window.clearInterval(interval);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      window.setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
          void ctx.close();
        } catch {
          /* ignore */
        }
      }, 350);
    };
  }, [enabled]);

  return null;
}
