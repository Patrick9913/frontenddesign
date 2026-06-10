"use client";

import { PanelPreviewChrome } from "./PanelPreviewChrome";

const COPY = {
  title: "HABLEMOS",
  subtitle: "AHORA",
  desc:
    "¿Buscás sumar alguien a tu equipo o charlar sobre diseño y tecnología? Escribime.",
} as const;

export function ContactPanelPreview() {
  return (
    <PanelPreviewChrome
      rootClass="contact-panel-preview"
      title={COPY.title}
      subtitle={COPY.subtitle}
      desc={COPY.desc}
      decor={
        <>
          <div className="contact-panel-radar" aria-hidden>
            <div className="contact-panel-radar-ring contact-panel-radar-ring--1" />
            <div className="contact-panel-radar-ring contact-panel-radar-ring--2" />
            <div className="contact-panel-radar-ring contact-panel-radar-ring--3" />
            <div className="contact-panel-radar-sweep" />
            <div className="contact-panel-radar-core" />
          </div>
          <div className="contact-panel-terminal" aria-hidden>
            <span className="contact-panel-terminal-prompt">{">"}</span>
            <span className="contact-panel-terminal-text">patrickyoel13@gmail.com</span>
            <span className="contact-panel-terminal-cursor" />
          </div>
        </>
      }
    />
  );
}
