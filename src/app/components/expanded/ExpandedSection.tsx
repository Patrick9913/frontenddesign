"use client";

import type { ReactNode } from "react";
import { useExpandedParallax } from "./useExpandedParallax";

type ExpandedSectionHeaderProps = {
  index: string;
  overline: string;
  title: string;
  accent: string;
  lead?: string;
};

type ExpandedSectionProps = ExpandedSectionHeaderProps & {
  id: string;
  decor?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ExpandedSectionHeader({
  index,
  overline,
  title,
  accent,
  lead,
}: ExpandedSectionHeaderProps) {
  return (
    <header className="mb-16 md:mb-20 lg:mb-28">
      <div className="panel-preview-parallax-stage max-w-5xl">
        <div className="panel-preview-layer panel-preview-layer--deep mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[10px] font-light tracking-[0.25em] uppercase text-white/50 md:text-xs">
            {index}
          </span>
          <span className="text-[10px] font-light tracking-[0.25em] uppercase text-white/50 md:text-xs">
            {overline}
          </span>
        </div>

        <h2 className="panel-preview-layer panel-preview-layer--back text-4xl font-light uppercase leading-[1.05] tracking-[-0.02em] text-white/22 md:text-6xl lg:text-7xl">
          {title}
        </h2>

        <h2 className="panel-preview-layer panel-preview-layer--mid -mt-1 text-4xl font-medium uppercase leading-[1.05] tracking-[-0.02em] text-[#F0F0F0] md:text-6xl lg:text-7xl">
          <span className="text-white/50">{accent}</span>
        </h2>

        <div className="panel-preview-layer panel-preview-layer--front mt-8 md:mt-10 max-w-2xl">
          <div className="mb-8 h-px w-8 bg-white/[0.08] md:w-12" aria-hidden />
          {lead ? (
            <p className="text-sm font-light leading-[1.75] tracking-wide text-white/50 md:text-base">
              {lead}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function ExpandedSection({
  id,
  decor,
  index,
  overline,
  title,
  accent,
  lead,
  children,
  className = "",
}: ExpandedSectionProps) {
  const ref = useExpandedParallax<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`expanded-section panel-preview relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#050505] via-black to-black text-[#F0F0F0] font-sans ${className}`}
    >
      {decor ? (
        <div className="expanded-section-decor pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {decor}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-24 md:px-16 md:py-32 lg:px-24 lg:py-40">
        <ExpandedSectionHeader
          index={index}
          overline={overline}
          title={title}
          accent={accent}
          lead={lead}
        />
        {children}
      </div>
    </section>
  );
}

export function ExpandedContentPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`expanded-content-panel panel-preview-layer panel-preview-layer--front border-t border-white/[0.08] bg-black/35 pt-10 backdrop-blur-[2px] md:pt-12 ${className}`}
    >
      {children}
    </div>
  );
}
