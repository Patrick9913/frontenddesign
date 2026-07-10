"use client";

import React, { useEffect, useRef, useState } from "react";
import { CARDS } from "./cardStackData";
import { Navbar } from "./Navbar";
import ProgressNavigation from "./ProgressNavigation";

interface MobileContinuousScrollProps {
  setActiveSection: (index: number) => void;
}

export const MobileContinuousScroll: React.FC<MobileContinuousScrollProps> = ({
  setActiveSection,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            setActiveIndex(index);
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [setActiveSection]);

  // Listen to navigation events
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>;
      const { sectionId } = customEvent.detail;
      const element = document.getElementById(sectionId);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("nav-to-section", handleNav);
    return () => window.removeEventListener("nav-to-section", handleNav);
  }, []);

  return (
    <div className="relative w-full bg-transparent">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/[0.08]">
        <Navbar />
      </div>

      {/* Continuous Sections */}
      <div className="relative">
        {CARDS.map((card, index) => {
          const Component = card.component;
          const isHero = card.id === "hero";

          return (
            <section
              key={card.id}
              id={card.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className={`relative w-full ${
                isHero 
                  ? "min-h-screen" 
                  : "min-h-[85vh]"
              }`}
              style={{
                backgroundColor: "#050505",
              }}
            >
              {!isHero && (
                <div className="sticky top-16 z-30 border-b border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-sm px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-light tracking-[0.2em] text-white/45">
                      [ {card.index} ]
                    </span>
                    <span className="font-mono text-xs font-light tracking-[0.2em] uppercase text-white/75">
                      {card.label}
                    </span>
                  </div>
                </div>
              )}
              
              <div className={`${!isHero ? "pt-0" : ""}`}>
                <Component />
              </div>
            </section>
          );
        })}
      </div>

      {/* Progress Navigation */}
      <ProgressNavigation activeSection={activeIndex} />
    </div>
  );
};

export default MobileContinuousScroll;
