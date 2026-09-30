export const NAV_SCROLL_OFFSET = 76;

export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const top =
    el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

export const NAV_SECTION_IDS = [
  "home",
  "about",
  "tools",
  "works",
  "contact",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

export function detectNavSection(): NavSectionId {
  const probe = Math.min(NAV_SCROLL_OFFSET + 48, window.innerHeight * 0.32);
  let current: NavSectionId = "home";

  for (const id of NAV_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) {
      current = id;
    }
  }

  return current;
}
