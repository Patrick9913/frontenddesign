"use client";

import React, { useState } from "react";
import PortfolioScene from "./components/PortfolioScene";
import FloatingSidebars from "./components/FloatingSidebars";
import CustomCursor from "./components/CustomCursor";

export const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

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
