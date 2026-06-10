"use client";

import type { CSSProperties } from "react";
import { PanelPreviewChrome } from "./PanelPreviewChrome";

const ORBIT_LINKS = [
  { label: "GitHub", angle: 20 },
  { label: "LinkedIn", angle: 100 },
  { label: "Email", angle: 200 },
  { label: "2026", angle: 290 },
] as const;

const COPY = {
  title: "PATRICK",
  subtitle: "ORDOÑEZ",
  desc: "Navegación, servicios y redes. El cierre del portfolio en una última hoja del stack.",
} as const;

export function FooterPanelPreview() {
  return (
    <PanelPreviewChrome
      rootClass="footer-panel-preview"
      title={COPY.title}
      subtitle={COPY.subtitle}
      desc={COPY.desc}
      decor={
        <>
          <div className="footer-panel-watermark" aria-hidden>
            <span className="footer-panel-watermark-line">PATRICK</span>
            <span className="footer-panel-watermark-line footer-panel-watermark-line--accent">
              ORDOÑEZ
            </span>
          </div>
          <div className="footer-panel-orbit-wrap" aria-hidden>
            <div className="footer-panel-orbit">
              {ORBIT_LINKS.map((link) => (
                <span
                  key={link.label}
                  className="footer-panel-orbit-node"
                  style={{ "--orbit-angle": `${link.angle}deg` } as CSSProperties}
                >
                  <span className="footer-panel-orbit-label">{link.label}</span>
                </span>
              ))}
              <span className="footer-panel-orbit-core" />
            </div>
          </div>
        </>
      }
    />
  );
}
