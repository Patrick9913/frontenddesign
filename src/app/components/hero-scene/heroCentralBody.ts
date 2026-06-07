export type HeroCentralBody = "moon" | "deathstar";

export const HERO_CENTRAL_BODY_STORAGE_KEY = "patrick-hero-central-body";

export function isHeroCentralBody(value: string): value is HeroCentralBody {
  return value === "moon" || value === "deathstar";
}

export function readStoredHeroCentralBody(): HeroCentralBody | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(HERO_CENTRAL_BODY_STORAGE_KEY);
    if (stored && isHeroCentralBody(stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export const HERO_CENTRAL_BODY_LABELS: Record<HeroCentralBody, string> = {
  moon: "Luna",
  deathstar: "Death Star",
};
