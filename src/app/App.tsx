"use client";

import React, { useState } from "react";
import GlobalBackground from "./components/GlobalBackground";
import CardStack from "./components/CardStack";
import FloatingSidebars from "./components/FloatingSidebars";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";

export const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  return (
    <>
      <CustomCursor />
      <GlobalBackground activeSection={activeSection} isPaused={!!expandedCardId} />
      <FloatingSidebars activeSection={activeSection} expandedCardId={expandedCardId} />
      <CardStack 
        setActiveSection={setActiveSection} 
        expandedCardId={expandedCardId}
        setExpandedCardId={setExpandedCardId}
      />
      <Footer />
    </>
  );
};
