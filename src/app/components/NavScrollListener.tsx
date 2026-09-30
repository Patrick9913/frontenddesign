"use client";

import { useEffect } from "react";
import { scrollToSection } from "./scrollToSection";

export function NavScrollListener() {
  useEffect(() => {
    const onNavEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ sectionId: string }>).detail;
      if (detail?.sectionId) scrollToSection(detail.sectionId);
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      if (anchor.dataset.skipSmoothScroll === "true") return;

      const sectionId = href.slice(1);
      if (!document.getElementById(sectionId)) return;

      event.preventDefault();
      scrollToSection(sectionId);
    };

    window.addEventListener("nav-to-section", onNavEvent);
    document.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener("nav-to-section", onNavEvent);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  return null;
}
