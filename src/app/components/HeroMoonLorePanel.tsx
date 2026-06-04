"use client";

import { useEffect, type MouseEvent } from "react";
import {
  MOON_LORE_SECTIONS,
  MOON_LORE_SUBTITLE,
  MOON_LORE_TITLE,
} from "./moon-scene/moonLoreContent";

type HeroMoonLorePanelProps = {
  open: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
};

export function HeroMoonLorePanel({
  open,
  onClose,
  reducedMotion = false,
}: HeroMoonLorePanelProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onClose();
  };

  const stopPanelClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-[33] flex items-center justify-center px-6 py-10 md:justify-end md:px-12 md:py-14"
      role="presentation"
      onClick={handleBackdrop}
    >
      <article
        className={`hero-moon-lore-panel hero-explore-label relative max-h-[min(78vh,36rem)] w-full max-w-md overflow-hidden border border-amber-100/25 bg-black/72 shadow-[0_0_60px_-12px_rgba(255,200,140,0.35)] backdrop-blur-md md:max-w-lg ${reducedMotion ? "" : "hero-moon-lore-panel--open"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="moon-lore-title"
        onClick={stopPanelClick}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,220,180,0.07)_0%,transparent_42%),radial-gradient(circle_at_12%_0%,rgba(255,180,120,0.12)_0%,transparent_55%)]"
          aria-hidden
        />

        <header className="relative border-b border-amber-100/15 px-6 py-5 md:px-7">
          <p className="font-mono text-[9px] font-light uppercase tracking-[0.38em] text-amber-100/55">
            {MOON_LORE_SUBTITLE}
          </p>
          <h2
            id="moon-lore-title"
            className="mt-2 font-sans text-xl font-extralight uppercase tracking-[0.22em] text-amber-50/95 md:text-2xl"
          >
            {MOON_LORE_TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 border border-amber-100/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-amber-100/70 transition-colors hover:border-amber-100/40 hover:text-amber-50"
            aria-label="Cerrar dossier"
          >
            Esc
          </button>
        </header>

        <div className="hero-moon-lore-scroll relative space-y-5 overflow-y-auto px-6 py-5 md:px-7 md:py-6">
          {MOON_LORE_SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="font-mono text-[10px] font-light uppercase tracking-[0.32em] text-amber-100/80">
                {section.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed tracking-[0.02em] text-white/72">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="relative border-t border-amber-100/12 px-6 py-3 md:px-7">
          <p className="font-mono text-[9px] font-light uppercase tracking-[0.3em] text-white/35">
            Datos ficticios · Expedición Prey
          </p>
        </footer>
      </article>
    </div>
  );
}
