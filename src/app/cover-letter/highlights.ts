import { cv, cvEn, type CvContent } from "../cv/cvData";

export type ExperienceHighlight = {
  id: string;
  org: string;
  role: string;
  bullet: string;
};

export function getExperienceHighlights(data: CvContent): ExperienceHighlight[] {
  return data.experience.flatMap((item, expIndex) =>
    item.bullets.map((bullet, bulletIndex) => ({
      id: `${expIndex}-${bulletIndex}`,
      org: item.org,
      role: item.role,
      bullet,
    }))
  );
}

export const highlightsEs = getExperienceHighlights(cv);
export const highlightsEn = getExperienceHighlights(cvEn);

export function resolveHighlights(
  language: "es" | "en",
  ids: string[]
): string[] {
  const pool = language === "en" ? highlightsEn : highlightsEs;
  const byId = new Map(pool.map((item) => [item.id, item.bullet]));
  return ids.map((id) => byId.get(id)).filter((text): text is string => Boolean(text));
}
