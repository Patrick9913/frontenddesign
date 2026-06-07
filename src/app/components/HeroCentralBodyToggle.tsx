"use client";

import type { MouseEvent } from "react";
import { FiMoon, FiTarget } from "react-icons/fi";
import { HERO_CENTRAL_BODY_LABELS } from "./hero-scene/heroCentralBody";
import { useHeroCentralBody } from "./hero-scene/HeroCentralBodyContext";

type HeroCentralBodyToggleProps = {
  disabled?: boolean;
};

export function HeroCentralBodyToggle({ disabled = false }: HeroCentralBodyToggleProps) {
  const { centralBody, toggleCentralBody, isMoon } = useHeroCentralBody();
  const nextLabel = isMoon
    ? `Cambiar a ${HERO_CENTRAL_BODY_LABELS.deathstar}`
    : `Cambiar a ${HERO_CENTRAL_BODY_LABELS.moon}`;

  const stop = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  return (
    <button
      type="button"
      aria-label={nextLabel}
      aria-pressed={centralBody === "deathstar"}
      title={nextLabel}
      disabled={disabled}
      onClick={(event) => stop(event, toggleCentralBody)}
      className={`pointer-events-auto flex h-10 w-10 items-center justify-center border backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        isMoon
          ? "border-slate-200/35 bg-slate-950/55 text-slate-100/90"
          : "border-white/15 bg-black/50 text-white/55 hover:border-amber-100/35 hover:bg-black/65 hover:text-amber-100/85"
      }`}
    >
      {isMoon ? (
        <FiMoon className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <FiTarget className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
