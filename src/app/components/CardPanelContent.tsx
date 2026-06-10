"use client";

import type { ComponentType } from "react";
import type { CardItem } from "./cardStackData";
import { HeroPanelPreview } from "./HeroPanelPreview";
import { SkillsConstellationPreview } from "./SkillsConstellationPreview";
import {
  AboutPanelPreview,
  ContactPanelPreview,
  ExperiencePanelPreview,
  FooterPanelPreview,
  ProjectsPanelPreview,
} from "./panelPreviews";

type CardPanelContentProps = {
  card: CardItem;
};

const PANEL_PREVIEWS: Record<string, ComponentType> = {
  hero: HeroPanelPreview,
  about: AboutPanelPreview,
  experience: ExperiencePanelPreview,
  skills: SkillsConstellationPreview,
  projects: ProjectsPanelPreview,
  contact: ContactPanelPreview,
  footer: FooterPanelPreview,
};

export function CardPanelContent({ card }: CardPanelContentProps) {
  const Preview = PANEL_PREVIEWS[card.id];

  return (
    <>
      <header className="card-stack-header h-12 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0a0a0a] select-none shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] font-light tracking-[0.2em] text-white/45">
            [ {card.index} ]
          </span>
          <span className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/75">
            {card.label}
          </span>
        </div>
      </header>

      <div className="card-stack-body h-[calc(100%-3rem)] overflow-hidden bg-[#050505]">
        {Preview ? <Preview /> : null}
      </div>
    </>
  );
}
