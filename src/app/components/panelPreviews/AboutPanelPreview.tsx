"use client";

import { PanelPreviewChrome } from "./PanelPreviewChrome";

const COPY = {
  title: "CÓDIGO QUE",
  subtitle: "RESPIRA DISEÑO",
  desc:
    "En la intersección entre estructura analítica y experiencia visual. Ciencia de Datos y diseño web.",
} as const;

export function AboutPanelPreview() {
  return (
    <PanelPreviewChrome
      rootClass="about-panel-preview"
      title={COPY.title}
      subtitle={COPY.subtitle}
      desc={COPY.desc}
      decor={
        <>
          <div className="about-panel-venn" aria-hidden>
            <div className="about-panel-orbit about-panel-orbit--code">
              <span className="about-panel-orbit-label">{"{ }"}</span>
              <span className="about-panel-orbit-label about-panel-orbit-label--alt">01</span>
            </div>
            <div className="about-panel-orbit about-panel-orbit--design">
              <span className="about-panel-orbit-label">◯</span>
              <span className="about-panel-orbit-label about-panel-orbit-label--alt">UX</span>
            </div>
            <div className="about-panel-intersect" />
          </div>
          <div className="about-panel-wire" aria-hidden />
        </>
      }
    />
  );
}
