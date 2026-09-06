"use client";

import React, { useEffect, useState } from "react";
import { CARDS } from "./components/cardStackData";
import FloatingSidebars from "./components/FloatingSidebars";
import GlobalBackground from "./components/GlobalBackground";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import ProgressNavigation from "./components/ProgressNavigation";

export const App = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const ids = CARDS.map((card) => card.id);

    const updateActiveSection = () => {
      const probe = Math.min(140, window.innerHeight * 0.25);
      let current = 0;

      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          current = i;
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleNav = (e: Event) => {
      const { sectionId } = (e as CustomEvent<{ sectionId: string }>).detail;
      const index = CARDS.findIndex((card) => card.id === sectionId);
      if (index !== -1) {
        setActiveSection(index);
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("nav-to-section", handleNav);
    return () => window.removeEventListener("nav-to-section", handleNav);
  }, []);

  return (
    <>
      <GlobalBackground activeSection={activeSection} isPaused={false} />
      <FloatingSidebars activeSection={activeSection} />

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/80 backdrop-blur-md">
        <Navbar />
      </header>

      <main className="relative z-10">
        {CARDS.map((card) => {
          const Component = card.component;
          return <Component key={card.id} />;
        })}
      </main>

      <Footer />
      <ProgressNavigation activeSection={activeSection} />
    </>
  );
};
