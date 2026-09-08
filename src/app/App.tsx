"use client";

import React, { useEffect, useState } from "react";
import { CARDS } from "./components/cardStackData";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import SocialBottomBar from "./components/SocialBottomBar";

export const App = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };

    setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleNav = (e: Event) => {
      const { sectionId } = (e as CustomEvent<{ sectionId: string }>).detail;
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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-black/30 backdrop-blur-xl"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <Navbar />
      </header>

      <main className="relative z-10">
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
