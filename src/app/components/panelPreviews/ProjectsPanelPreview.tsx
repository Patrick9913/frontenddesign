"use client";

import type { CSSProperties } from "react";
import { PanelPreviewChrome } from "./PanelPreviewChrome";

const WINDOWS = [
  { id: "a", title: "next-app", offset: "0", depth: "back" },
  { id: "b", title: "dashboard-ui", offset: "1", depth: "mid" },
  { id: "c", title: "design-sys", offset: "2", depth: "front" },
] as const;

const COPY = {
  title: "DEMOS",
  subtitle: "REPRESENTATIVAS",
  desc:
    "Galería de trabajos interactivos con Next.js, TypeScript y Tailwind — detalle visual y funcional.",
} as const;

export function ProjectsPanelPreview() {
  return (
    <PanelPreviewChrome
      rootClass="projects-panel-preview"
      title={COPY.title}
      subtitle={COPY.subtitle}
      desc={COPY.desc}
      decor={
        <div className="projects-panel-stack" aria-hidden>
          {WINDOWS.map((win) => (
            <div
              key={win.id}
              className={`projects-panel-window projects-panel-window--${win.depth}`}
              style={{ "--win-i": win.offset } as CSSProperties}
            >
              <div className="projects-panel-window-bar">
                <span />
                <span />
                <span />
                <span className="projects-panel-window-title">{win.title}</span>
              </div>
              <div className="projects-panel-window-body">
                <div className="projects-panel-window-line" />
                <div className="projects-panel-window-line projects-panel-window-line--short" />
                <div className="projects-panel-window-block" />
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
