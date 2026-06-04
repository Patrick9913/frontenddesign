"use client";

import type { MouseEvent } from "react";

type HeroMarsReturnButtonProps = {
  visible: boolean;
  onReturnToMoon?: () => void;
};

export function HeroMarsReturnButton({ visible, onReturnToMoon }: HeroMarsReturnButtonProps) {
  if (!visible) return null;

  const handleReturn = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onReturnToMoon?.();
  };

  return (
    <button
      type="button"
      onClick={handleReturn}
      className="hero-explore-label pointer-events-auto absolute bottom-[18%] left-[7%] border border-amber-100/20 bg-black/45 px-5 py-3.5 backdrop-blur-sm transition-colors hover:border-amber-100/40 hover:bg-black/60 md:bottom-[16%] md:left-[8%]"
    >
      <span className="font-mono text-[10px] font-light uppercase tracking-[0.32em] text-amber-100/90">
        Volver a la Luna
      </span>
    </button>
  );
}
