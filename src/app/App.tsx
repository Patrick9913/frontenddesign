"use client";

import React, { useEffect, useState } from "react";
import { CARDS } from "./components/cardStackData";
import GlobalBackground from "./components/GlobalBackground";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import SocialBottomBar from "./components/SocialBottomBar";

export const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrolled, setScrolled] = useState(false);

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
        setScrolled(window.scrollY > 24);
        updateActiveSection();
        ticking = false;
      });
    };

    setScrolled(window.scrollY > 24);
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

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-black/30 backdrop-blur-xl"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <Navbar />
      </header>

      <main className="relative z-10 pb-16">
        {CARDS.map((card) => {
          const Component = card.component;
          return <Component key={card.id} />;
        })}
      </main>

      <Footer />
      <SocialBottomBar />
    </>
  );
};
