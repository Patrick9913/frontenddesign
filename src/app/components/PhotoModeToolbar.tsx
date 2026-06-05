"use client";

import type { MouseEvent, ReactNode } from "react";
import { FiCamera, FiNavigation, FiSliders } from "react-icons/fi";

type PhotoModeToolbarProps = {
  photoMode: boolean;
  optionsOpen: boolean;
  flyMode: boolean;
  onTogglePhotoMode: () => void;
  onToggleOptions: () => void;
  onToggleFlyMode: () => void;
  reducedMotion?: boolean;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

function ToolbarButton({ label, active = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={`pointer-events-auto flex h-10 w-10 items-center justify-center border backdrop-blur-sm transition-colors ${
        active
          ? "border-cyan-200/40 bg-cyan-950/55 text-cyan-100/95"
          : "border-white/15 bg-black/50 text-white/55 hover:border-amber-100/35 hover:bg-black/65 hover:text-amber-100/85"
      }`}
    >
      {children}
    </button>
  );
}

export function PhotoModeToolbar({
  photoMode,
  optionsOpen,
  flyMode,
  onTogglePhotoMode,
  onToggleOptions,
  onToggleFlyMode,
  reducedMotion = false,
}: PhotoModeToolbarProps) {
  if (reducedMotion) return null;

  const stop = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-[40] flex flex-col gap-2 md:left-6 md:top-6">
      <div className="flex items-center gap-2">
        <ToolbarButton
          label="Modo foto (V)"
          active={photoMode}
          onClick={(event) => stop(event, onTogglePhotoMode)}
        >
          <FiCamera className="h-[18px] w-[18px]" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Opciones del modo foto"
          active={optionsOpen}
          onClick={(event) => stop(event, onToggleOptions)}
        >
          <FiSliders className="h-[18px] w-[18px]" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={flyMode ? "Salir navegación libre" : "Navegación libre"}
          active={flyMode}
          onClick={(event) => stop(event, onToggleFlyMode)}
        >
          <FiNavigation className="h-[18px] w-[18px]" aria-hidden />
        </ToolbarButton>
      </div>

      {flyMode ? (
        <p className="pointer-events-none max-w-[18rem] font-mono text-[11px] font-light uppercase leading-relaxed tracking-[0.14em] text-white/45 drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
          WASD · Espacio / Ctrl · Clic unidad / destino · Esc
        </p>
      ) : null}
    </div>
  );
}
