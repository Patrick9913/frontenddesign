"use client";

import React, { useEffect, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";
import Experience from "./components/Experience";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

export const App = () => {
  const [uiVisible, setUiVisible] = useState(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "KeyV" || event.repeat) return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      setUiVisible((visible) => !visible);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <CustomCursor hidden={!uiVisible} />
      <Hero uiVisible={uiVisible} />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
};
