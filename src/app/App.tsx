"use client";

import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";

export const App = () => {
  const [photoMode, setPhotoMode] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "KeyV" || event.repeat) return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      setPhotoMode((active) => !active);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Hero
      photoMode={photoMode}
      onTogglePhotoMode={() => setPhotoMode((active) => !active)}
    />
  );
};
