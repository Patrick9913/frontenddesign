"use client";

import React, { useEffect, useState } from "react";
import { CARDS } from "./cardStackData";

interface ProgressNavigationProps {
  activeSection: number;
}

export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({ activeSection }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden">
      {/* Progress Indicator Circle */}
      <div className="relative h-14 w-14">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            fill="rgba(0, 0, 0, 0.7)"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(240, 240, 240, 0.9)"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        {/* Section number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-light text-white/90">
            {CARDS[activeSection]?.index || "00"}
          </span>
        </div>
      </div>

      {/* Quick Navigation Menu Button */}
      <button
        type="button"
        onClick={() => {
          const nextIndex = (activeSection + 1) % CARDS.length;
          scrollToSection(CARDS[nextIndex].id);
        }}
        className="flex h-14 w-14 items-center justify-center border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/85"
        aria-label="Siguiente sección"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProgressNavigation;
