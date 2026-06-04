export type SiteSectionId =
  | "hero"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "contact";

export type SectionTheme = {
  primary: string;
  secondary: string;
  accent: string;
  ambient: string;
};

export type SectionMeta = {
  id: SiteSectionId;
  index: string;
  label: string;
  heightVh: number;
  requiresExplore?: boolean;
  theme: SectionTheme;
  camera: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
};

export const SECTIONS: SectionMeta[] = [
  {
    id: "hero",
    index: "[ 00 ]",
    label: "Portfolio",
    heightVh: 185,
    theme: {
      primary: "#F5C842",
      secondary: "#E8A820",
      accent: "#555555",
      ambient: "#1a1a1a",
    },
    camera: { position: [0, 0, 5.2], lookAt: [0, 0, 0], fov: 42 },
  },
  {
    id: "about",
    index: "[ 01 ]",
    label: "Sobre mí",
    heightVh: 145,
    requiresExplore: true,
    theme: {
      primary: "#4FC3FF",
      secondary: "#1E8CFF",
      accent: "#2a5080",
      ambient: "#0a1628",
    },
    camera: { position: [3.6, 0.55, 4.1], lookAt: [0, 0, 0], fov: 36 },
  },
  {
    id: "experience",
    index: "[ 02 ]",
    label: "Formación",
    heightVh: 120,
    requiresExplore: true,
    theme: {
      primary: "#6B9FD4",
      secondary: "#4A7BA8",
      accent: "#334455",
      ambient: "#0c1218",
    },
    camera: { position: [2.9, 0.15, 4.6], lookAt: [0, 0.05, 0], fov: 38 },
  },
  {
    id: "skills",
    index: "[ 03 ]",
    label: "Stack técnico",
    heightVh: 115,
    requiresExplore: true,
    theme: {
      primary: "#00E5FF",
      secondary: "#00B8D4",
      accent: "#1a3a4a",
      ambient: "#061018",
    },
    camera: { position: [0.8, 2.1, 4.9], lookAt: [0, 0, 0], fov: 40 },
  },
  {
    id: "projects",
    index: "[ 04 ]",
    label: "Demos",
    heightVh: 130,
    requiresExplore: true,
    theme: {
      primary: "#FFFFFF",
      secondary: "#E8E8E8",
      accent: "#666666",
      ambient: "#0a0a0a",
    },
    camera: { position: [4.1, 0.35, 3.15], lookAt: [0, 0, 0], fov: 34 },
  },
  {
    id: "contact",
    index: "[ 05 ]",
    label: "Contacto",
    heightVh: 105,
    requiresExplore: true,
    theme: {
      primary: "#FFB86C",
      secondary: "#FF9F43",
      accent: "#4a3020",
      ambient: "#120c08",
    },
    camera: { position: [0, 0.1, 3.75], lookAt: [0, 0, 0], fov: 40 },
  },
];

export const HERO_PHASE1_VH = 185;

export function getSectionMeta(id: SiteSectionId): SectionMeta {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
}
