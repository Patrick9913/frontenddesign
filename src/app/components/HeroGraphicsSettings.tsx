"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FiMonitor } from "react-icons/fi";
import {
  QUALITY_DESCRIPTIONS,
  QUALITY_LABELS,
  type QualityProfile,
} from "./hero-scene/qualitySettings";
import { useQualitySettings } from "./hero-scene/useQualityProfile";

const PRESETS: QualityProfile[] = ["low", "medium", "high", "ultra"];

type HeroGraphicsSettingsProps = {
  disabled?: boolean;
};

export function HeroGraphicsSettings({ disabled = false }: HeroGraphicsSettingsProps) {
  const { quality, setQuality } = useQualitySettings();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const stop = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Calidad gráfica"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Calidad gráfica"
        disabled={disabled}
        onClick={(event) => stop(event, () => setOpen((prev) => !prev))}
        className={`pointer-events-auto flex h-10 w-10 items-center justify-center border backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          open
            ? "border-violet-200/40 bg-violet-950/55 text-violet-100/95"
            : "border-white/15 bg-black/50 text-white/55 hover:border-amber-100/35 hover:bg-black/65 hover:text-amber-100/85"
        }`}
      >
        <FiMonitor className="h-[18px] w-[18px]" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Preset de calidad gráfica"
          className="pointer-events-auto absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[12.5rem] border border-white/12 bg-black/88 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-md"
        >
          <p className="px-2 pb-2 font-mono text-[9px] font-light uppercase tracking-[0.28em] text-white/35">
            Calidad gráfica
          </p>
          <div className="flex flex-col gap-1">
            {PRESETS.map((preset) => {
              const active = quality === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={(event) =>
                    stop(event, () => {
                      setQuality(preset);
                      setOpen(false);
                    })
                  }
                  className={`flex w-full flex-col items-start gap-0.5 px-2 py-2 text-left transition-colors ${
                    active
                      ? "bg-violet-500/15 text-violet-100"
                      : "text-white/70 hover:bg-white/6 hover:text-white/90"
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                    {QUALITY_LABELS[preset]}
                  </span>
                  <span className="text-[10px] font-light leading-snug text-white/40">
                    {QUALITY_DESCRIPTIONS[preset]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
