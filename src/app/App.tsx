"use client";

import React, { useEffect, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";
import Experience from "./components/Experience";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import ImmersiveSiteShell from "./components/immersive/ImmersiveSiteShell";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { SceneProvider } from "./scene/SceneContext";

export const App = () => {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <SceneProvider>
      <CustomCursor />
      {reducedMotion ? (
        <>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </>
      ) : (
        <ImmersiveSiteShell />
      )}
    </SceneProvider>
  );
};
