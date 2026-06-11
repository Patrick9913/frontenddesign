"use client";

import { PanelPreviewChrome } from "./panelPreviews/PanelPreviewChrome";
import { SkillsConstellationField } from "./skills/SkillsConstellationField";

export function SkillsConstellationPreview() {
  return (
    <PanelPreviewChrome
      rootClass="skills-constellation-preview"
      title="STACK"
      subtitle="TÉCNICO"
      desc="Tecnologías en órbita — el ecosistema que uso para construir interfaces fluidas y escalables."
      decor={
        <div className="skills-constellation-clip">
          <SkillsConstellationField variant="preview" className="absolute inset-0" />
        </div>
      }
    />
  );
}
