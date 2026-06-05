"use client";

import { useEffect, useState } from "react";
import { useFleetCommand } from "./moon-scene/fleetCommandContext";

type FleetCommandCursorHudProps = {
  active: boolean;
};

export function FleetCommandCursorHud({ active }: FleetCommandCursorHudProps) {
  const { previewLocal } = useFleetCommand();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [active]);

  if (!active || !previewLocal) return null;

  return (
    <div
      className="pointer-events-none fixed z-[45]"
      style={{ left: cursor.x, top: cursor.y }}
    >
      <div
        className="absolute -left-px -top-px h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/50 bg-cyan-300/20 shadow-[0_0_10px_rgba(126,232,255,0.55)]"
        aria-hidden
      />
      <div className="absolute left-5 top-3 font-mono text-[13px] font-light tracking-[0.08em] text-cyan-100/90 drop-shadow-[0_0_12px_rgba(0,0,0,0.85)]">
        <span className="text-cyan-300/55">X</span>
        <span className="ml-1 tabular-nums">{previewLocal[0].toFixed(2)}</span>
        <span className="mx-2 text-white/20">|</span>
        <span className="text-cyan-300/55">Y</span>
        <span className="ml-1 tabular-nums">{previewLocal[1].toFixed(2)}</span>
        <span className="mx-2 text-white/20">|</span>
        <span className="text-cyan-300/55">Z</span>
        <span className="ml-1 tabular-nums">{previewLocal[2].toFixed(2)}</span>
      </div>
    </div>
  );
}
