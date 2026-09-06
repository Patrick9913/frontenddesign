"use client";

import type { ReactNode } from "react";
import { useExpandedParallax } from "./useExpandedParallax";

type ExpandedSectionHeaderProps = {
  title: string;
  accent: string;
};

type ExpandedSectionProps = ExpandedSectionHeaderProps & {
  id: string;
  decor?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ExpandedSectionHeader({ title, accent }: ExpandedSectionHeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="panel-preview-parallax-stage max-w-5xl">
        <h2 className="panel-preview-layer panel-preview-layer--back text-4xl font-light uppercase leading-[1.05] tracking-[-0.02em] text-white/45 md:text-6xl lg:text-7xl">
          {title}
        </h2>
        <p className="panel-preview-layer panel-preview-layer--mid -mt-1 text-4xl font-medium uppercase leading-[1.05] tracking-[-0.02em] text-white/80 md:text-6xl lg:text-7xl">
          {accent}
        </p>
      </div>
    </header>
  );
}

export function ExpandedSection({
  id,
  decor,
  title,
  accent,
  children,
  className = "",
}: ExpandedSectionProps) {
  const ref = useExpandedParallax<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`expanded-section panel-preview relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#050505] via-black to-black text-[#F0F0F0] font-sans scroll-mt-24 ${className}`}
    >
      {decor ? (
        <div className="expanded-section-decor pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {decor}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-20 md:px-16 md:py-24 lg:px-24 lg:py-28 xl:px-36">
        <ExpandedSectionHeader title={title} accent={accent} />
        {children}
      </div>
    </section>
  );
}

export function ExpandedContentPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`expanded-content-panel panel-preview-layer panel-preview-layer--front border-t border-white/[0.08] bg-black/35 pt-8 backdrop-blur-[2px] md:pt-10 ${className}`}
    >
      {children}
    </div>
  );
}
