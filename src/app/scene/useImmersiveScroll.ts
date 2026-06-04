"use client";

import { useEffect } from "react";
import { notifySceneUi } from "./SceneContext";
import { sceneStore } from "./sceneStore";
import { HERO_PHASE1_VH, SECTIONS, type SiteSectionId } from "./sections";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useImmersiveScroll(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!container) return;

      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const totalHeight = container.offsetHeight;
      const scrollable = totalHeight - vh;
      const scrolled = clamp(-rect.top, 0, Math.max(scrollable, 1));

      const heroHeight = (HERO_PHASE1_VH / 100) * vh;
      const heroScrollable = Math.max(heroHeight - vh, 1);
      const heroProgress = clamp(scrolled / heroScrollable, 0, 1);

      sceneStore.heroScrollProgress = heroProgress;
      const prevHint = sceneStore.showExploreHint;
      sceneStore.showExploreHint = heroProgress > 0.82 && !sceneStore.exploreMode;
      if (prevHint !== sceneStore.showExploreHint) notifySceneUi();

      let cursor = heroScrollable;
      let activeSection: SiteSectionId = "hero";
      let sectionProgress = heroProgress;
      let aboutProgress = 0;

      for (let i = 1; i < SECTIONS.length; i++) {
        const section = SECTIONS[i];
        if (section.requiresExplore && !sceneStore.exploreMode) {
          sceneStore.aboutScrollProgress = 0;
          break;
        }

        const sectionHeight = (section.heightVh / 100) * vh;
        const sectionScrollable = Math.max(sectionHeight - vh * 0.15, vh * 0.5);

        if (scrolled >= cursor) {
          const local = clamp((scrolled - cursor) / sectionScrollable, 0, 1);
          activeSection = section.id;
          sectionProgress = local;
          if (section.id === "about") aboutProgress = local;
        }

        cursor += sectionScrollable;
      }

      sceneStore.activeSection = activeSection;
      sceneStore.sectionProgress = sectionProgress;
      sceneStore.aboutScrollProgress = aboutProgress;
      sceneStore.globalProgress = clamp(scrolled / Math.max(cursor, 1), 0, 1);

      notifySceneUi();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);
}

export function getImmersiveScrollHeightVh() {
  const exploreSections = SECTIONS.filter((s) => s.id !== "hero");
  const base = HERO_PHASE1_VH;
  const cinematic = exploreSections.reduce((sum, s) => sum + s.heightVh, 0);
  return base + cinematic;
}
