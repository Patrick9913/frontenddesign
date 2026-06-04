"use client";

import type { MouseEvent } from "react";

type HeroFlyModeToggleProps = {
  active: boolean;
  onToggle: () => void;
  reducedMotion?: boolean;
};

export function HeroFlyModeToggle({
  active,
  onToggle,
  reducedMotion = false,
}: HeroFlyModeToggleProps) {
  if (reducedMotion) return null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  };

  return (
    <div className="pointer-events-none absolute right-[7%] top-[14%] z-[36] flex flex-col items-end gap-2 md:right-[8%] md:top-[12%]">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={`hero-explore-label pointer-events-auto border px-4 py-3 backdrop-blur-sm transition-colors md:px-5 md:py-3.5 ${
          active
            ? "border-cyan-200/35 bg-cyan-950/50 hover:border-cyan-100/50 hover:bg-cyan-950/65"
            : "border-amber-100/20 bg-black/45 hover:border-amber-100/40 hover:bg-black/60"
        }`}
      >
        <span
          className={`font-mono text-[10px] font-light uppercase tracking-[0.28em] md:tracking-[0.32em] ${
            active ? "text-cyan-100/95" : "text-amber-100/90"
          }`}
        >
          {active ? "Salir navegación" : "Navegación libre"}
        </span>
      </button>

      {active ? (
        <p className="pointer-events-none max-w-[14rem] text-right font-mono text-[9px] font-light uppercase leading-relaxed tracking-[0.2em] text-white/40 md:text-[10px]">
          WASD mover · Espacio / Ctrl vertical
          <br />
          Clic Luna · dossier · Botón derecho mirar · Esc salir
        </p>
      ) : null}
    </div>
  );
}
