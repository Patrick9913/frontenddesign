"use client";

const COPY = {
  index: "[ 00 ]",
  line1: "FRONT END",
  accent: "DEVELOPER",
  body:
    "Interfaces inmersivas con React, Next.js y TypeScript. Mueve el cursor — la escena responde.",
} as const;

export function HeroPanelPreview() {
  return (
    <div className="hero-panel-preview relative h-full w-full overflow-hidden bg-[#050505]">
      <div className="hero-panel-grid" aria-hidden />
      <div className="hero-panel-glow" aria-hidden />
      <div className="hero-panel-scanlines" aria-hidden />

      <div className="relative z-10 flex h-full flex-col justify-center px-8 py-10 md:px-12">
        <div className="hero-panel-parallax-stage">
          <span className="hero-panel-layer hero-panel-layer--deep mb-4 block font-mono text-[10px] font-light tracking-[0.25em] uppercase text-white/35">
            {COPY.index}
          </span>

          <h2 className="hero-panel-layer hero-panel-layer--back text-[2.35rem] font-light leading-[0.92] tracking-[-0.03em] text-white/25 sm:text-5xl md:text-6xl">
            {COPY.line1}
          </h2>

          <h2 className="hero-panel-layer hero-panel-layer--mid -mt-1 text-[2.35rem] font-medium leading-[0.92] tracking-[-0.03em] text-white/55 sm:text-5xl md:text-6xl">
            {COPY.accent}
          </h2>

          <div className="hero-panel-layer hero-panel-layer--front mt-6 max-w-sm">
            <div className="mb-5 h-px w-10 bg-white/[0.12]" aria-hidden />
            <p className="text-xs font-light leading-[1.75] tracking-wide text-white/45 md:text-sm">
              {COPY.body}
            </p>
          </div>
        </div>

        <div className="hero-panel-layer hero-panel-layer--ui pointer-events-none absolute bottom-8 right-8 flex flex-col items-center gap-3 md:bottom-10 md:right-10">
          <div className="relative h-14 w-px overflow-hidden bg-white/[0.08]">
            <div className="hero-panel-scroll-pulse absolute left-0 top-0 h-1/2 w-full bg-white/45" />
          </div>
          <span
            className="font-mono text-[9px] font-light uppercase tracking-[0.3em] text-white/35"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
}
