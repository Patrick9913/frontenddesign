"use client";

import React, { useState, useEffect } from "react";
import PortfolioScene from "./components/PortfolioScene";
import MobileContinuousScroll from "./components/MobileContinuousScroll";
import FloatingSidebars from "./components/FloatingSidebars";
import CustomCursor from "./components/CustomCursor";

export const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Detectar móvil por ancho de pantalla y touch capability
      const isMobileSize = window.innerWidth < 1024; // lg breakpoint
      const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setIsMobile(isMobileSize || isTouchDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile continuous scroll layout
  if (isMobile) {
    return (
      <>
        <CustomCursor />
        <MobileContinuousScroll setActiveSection={setActiveSection} />
      </>
    );
  }

  // Desktop card stack layout
  return (
    <>
      <CustomCursor />
      <FloatingSidebars activeSection={activeSection} expandedCardId={expandedCardId} />
      <PortfolioScene
        setActiveSection={setActiveSection}
        expandedCardId={expandedCardId}
        setExpandedCardId={setExpandedCardId}
      />
    </>
  );
};
