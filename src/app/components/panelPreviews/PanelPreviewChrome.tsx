"use client";

import type { ReactNode } from "react";

type PanelPreviewChromeProps = {
  rootClass: string;
  decor: ReactNode;
  title: string;
  subtitle: string;
  desc: string;
};

export function PanelPreviewFooter() {
  return (
    <div className="panel-preview-layer panel-preview-layer--ui flex items-end justify-between">
      <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
        CLIC PARA AMPLIAR HOJA
      </span>
      <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5">
        <span className="text-base text-white">↗</span>
      </div>
    </div>
  );
}

export function PanelPreviewChrome({
  rootClass,
  decor,
  title,
  subtitle,
  desc,
}: PanelPreviewChromeProps) {
  return (
    <div className={`panel-preview ${rootClass} relative h-full w-full overflow-hidden bg-gradient-to-b from-[#050505] to-[#000000]`}>
      {decor}

      <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
        <div className="panel-preview-parallax-stage max-w-md">
          <span className="panel-preview-layer panel-preview-layer--deep mb-4 block font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
            Preview
          </span>

          <h2 className="panel-preview-layer panel-preview-layer--back text-3xl font-light uppercase leading-[1.05] tracking-[-0.02em] text-white/25 md:text-4xl">
            {title}
          </h2>

          <h2 className="panel-preview-layer panel-preview-layer--mid -mt-1 text-3xl font-medium uppercase leading-[1.05] tracking-[-0.02em] text-[#F0F0F0] md:text-4xl">
            <span className="text-white/45">{subtitle}</span>
          </h2>

          <div className="panel-preview-layer panel-preview-layer--front mt-5">
            <div className="mb-4 h-px w-8 bg-white/[0.08]" aria-hidden />
            <p className="text-xs font-light leading-[1.75] tracking-wide text-white/45 md:text-sm">
              {desc}
            </p>
          </div>
        </div>

        <PanelPreviewFooter />
      </div>
    </div>
  );
}
