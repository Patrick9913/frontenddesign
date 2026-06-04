"use client";

import React from "react";
import { getSectionMeta } from "../../scene/sections";
import { useActiveSection, useScene } from "../../scene/SceneContext";

export function SiteHudNavbar() {
  const activeSection = useActiveSection();
  const { state } = useScene();
  const meta = getSectionMeta(activeSection);

  if (!state.exploreMode || activeSection === "hero") return null;

  return (
    <div className="pointer-events-none fixed top-6 left-1/2 z-[60] -translate-x-1/2 motion-reduce:hidden">
      <div className="flex items-center gap-4 border border-white/15 bg-black/50 px-5 py-2.5 backdrop-blur-md">
        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/45">{meta.index}</span>
        <span className="h-3 w-px bg-white/15" aria-hidden />
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/70">{meta.label}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-pulse motion-reduce:animate-none" />
      </div>
    </div>
  );
}
