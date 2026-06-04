"use client";

import React, { useState } from "react";
import { ABOUT_COPY, ABOUT_SECTION_INDEX } from "../content/aboutContent";

export const About = () => {
  const [showCvNotice, setShowCvNotice] = useState(false);

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCvNotice(true);
  };

  return (
    <section
      id="about"
      className="py-32 lg:py-48 bg-black text-[#F0F0F0] font-sans border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <header className="mb-20 md:mb-28 lg:mb-32">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 md:mb-10">
            <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {ABOUT_SECTION_INDEX}
            </span>
            <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {ABOUT_COPY.overline}
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] max-w-4xl">
            {ABOUT_COPY.title.line1}
            <br />
            <span className="font-medium text-white/50">{ABOUT_COPY.title.accent}</span>{" "}
            {ABOUT_COPY.title.line2}
          </h2>

          <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-8 md:mt-10" aria-hidden />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 xl:gap-12 lg:items-center">
          <div className="lg:col-span-5 flex flex-col gap-10 md:gap-12 text-left min-w-0">
            <p className="text-base md:text-lg font-light text-[#F0F0F0] leading-[1.75] tracking-wide">
              {ABOUT_COPY.lead}
            </p>

            <div className="space-y-8 border-t border-white/[0.08] pt-10">
              {ABOUT_COPY.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-6 md:gap-8">
                  <span
                    className="shrink-0 font-mono text-[10px] font-light tracking-[0.2em] text-white/50 pt-1"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white/80">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.08]">
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

          <div className="lg:col-span-6 lg:col-start-7 relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 aspect-[4/5] min-h-[280px] sm:min-h-[340px] lg:min-h-[400px]">
            <div className="absolute top-0 left-0 w-[58%] sm:w-[56%] h-[78%] z-[1] border border-white/[0.08] overflow-hidden">
              <img
                src="/wireone.png"
                alt="Composición visual — capa posterior"
                className="w-full h-full object-cover object-center grayscale contrast-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[58%] sm:w-[56%] h-[72%] z-[2] border border-white/[0.08] overflow-hidden">
              <img
                src="/wiretwo.png"
                alt="Composición visual — capa frontal"
                className="w-full h-full object-cover object-center grayscale contrast-[1.02]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
