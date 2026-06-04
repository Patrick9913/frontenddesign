"use client";

import React, { useState } from "react";
import { ABOUT_COPY, ABOUT_SECTION_INDEX } from "../content/aboutContent";

type AboutPanelProps = {
  scrollProgress?: number;
  className?: string;
};

export function AboutPanel({ scrollProgress = 1, className = "" }: AboutPanelProps) {
  const [showCvNotice, setShowCvNotice] = useState(false);
  const reveal = Math.min(1, Math.max(0, scrollProgress));

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCvNotice(true);
  };

  return (
    <div
      className={`pointer-events-none w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 ${className}`}
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 56}px)`,
      }}
    >
      <header className="mb-12 md:mb-16 lg:mb-20">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 md:mb-8">
          <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {ABOUT_SECTION_INDEX}
          </span>
          <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {ABOUT_COPY.overline}
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] max-w-4xl">
          {ABOUT_COPY.title.line1}
          <br />
          <span className="font-medium text-white/50">{ABOUT_COPY.title.accent}</span>{" "}
          {ABOUT_COPY.title.line2}
        </h2>

        <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-6 md:mt-8" aria-hidden />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 lg:items-start max-w-5xl">
        <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10 text-left min-w-0">
          <p className="text-sm md:text-base font-light text-[#F0F0F0] leading-[1.75] tracking-wide">
            {ABOUT_COPY.lead}
          </p>

          <div className="space-y-6 border-t border-white/[0.08] pt-8">
            {ABOUT_COPY.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-5 md:gap-6">
                <span
                  className="shrink-0 font-mono text-[10px] font-light tracking-[0.2em] text-white/50 pt-1"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col gap-4 pt-2 border-t border-white/[0.08]"
            style={{ pointerEvents: reveal > 0.35 ? "auto" : "none" }}
          >
            <a
              href="/cv.pdf"
              onClick={handleCvClick}
              className="group inline-flex w-fit items-center gap-4 px-8 py-4 border border-white/20 bg-transparent text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 rounded-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/40"
            >
              Descargar CV
              <span
                className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
            {showCvNotice && (
              <p
                className="font-mono text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-white/25"
                role="status"
              >
                Currículum actualizándose.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
