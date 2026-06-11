export type ConstellationNode = {
  label: string;
  ring: 1 | 2 | 3;
  angle: number;
};

export const CONSTELLATION_NODES: ConstellationNode[] = [
  { label: "React", ring: 1, angle: 10 },
  { label: "Next.js", ring: 1, angle: 70 },
  { label: "TypeScript", ring: 1, angle: 140 },
  { label: "Tailwind", ring: 1, angle: 220 },
  { label: "Node.js", ring: 2, angle: 25 },
  { label: "Firebase", ring: 2, angle: 95 },
  { label: "Jest", ring: 2, angle: 165 },
  { label: "Git", ring: 2, angle: 250 },
  { label: "Docker", ring: 2, angle: 310 },
  { label: "Vercel", ring: 3, angle: 40 },
  { label: "Storybook", ring: 3, angle: 130 },
  { label: "MongoDB", ring: 3, angle: 210 },
  { label: "ESLint", ring: 3, angle: 300 },
];

export const RING_CLASS: Record<ConstellationNode["ring"], string> = {
  1: "constellation-ring--inner",
  2: "constellation-ring--mid",
  3: "constellation-ring--outer",
};
