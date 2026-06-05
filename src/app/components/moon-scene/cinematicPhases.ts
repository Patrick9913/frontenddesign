import { easeInOutCubic, easeOutCubic } from "./useHeroScroll";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutExpo(t: number) {
  const x = clamp(t, 0, 1);
  return x >= 1 ? 1 : 1 - 2 ** (-10 * x);
}

/** Texto intro visible al inicio; se desvanece con el primer scroll. */
export const CINEMATIC_INTRO_FADE_START = 0.04;
export const CINEMATIC_INTRO_FADE_END = 0.18;

/** La Estrella de la Muerte emerge desde abajo. */
export const CINEMATIC_DEATH_STAR_START = 0.12;
export const CINEMATIC_DEATH_STAR_END = 0.46;

/** Destructores entran en hiperespacio (escalonados). */
export const CINEMATIC_HYPERSPACE_START = 0.36;
export const CINEMATIC_HYPERSPACE_DURATION = 0.22;
export const CINEMATIC_DESTROYER_1_DELAY = 0.07;

export type CinematicPhases = {
  introOpacity: number;
  deathStarRise: number;
  deathStarVisible: boolean;
  destroyerHyperspace: [number, number];
  hyperspaceFlash: number;
  fleetRevealed: boolean;
};

export function getDestroyerHyperspaceProgress(scrollProgress: number, index: number) {
  const progress = clamp(scrollProgress, 0, 1);
  const delay = index * CINEMATIC_DESTROYER_1_DELAY;
  const raw = clamp(
    (progress - (CINEMATIC_HYPERSPACE_START + delay)) / CINEMATIC_HYPERSPACE_DURATION,
    0,
    1
  );
  return easeOutExpo(raw);
}

export function getCinematicPhases(scrollProgress: number): CinematicPhases {
  const progress = clamp(scrollProgress, 0, 1);

  const introFade = clamp(
    (progress - CINEMATIC_INTRO_FADE_START) /
      (CINEMATIC_INTRO_FADE_END - CINEMATIC_INTRO_FADE_START),
    0,
    1
  );
  const introOpacity = 1 - easeInOutCubic(introFade);

  const deathStarRaw = clamp(
    (progress - CINEMATIC_DEATH_STAR_START) /
      (CINEMATIC_DEATH_STAR_END - CINEMATIC_DEATH_STAR_START),
    0,
    1
  );
  const deathStarRise = easeOutCubic(deathStarRaw);
  const deathStarVisible = progress >= CINEMATIC_DEATH_STAR_START - 0.02;

  const destroyerHyperspace: [number, number] = [0, 1].map((delayIndex) =>
    getDestroyerHyperspaceProgress(progress, delayIndex)
  ) as [number, number];

  const hyperspaceFlash = Math.max(
    ...destroyerHyperspace.map((value, index) =>
      value < 0.35 ? (1 - value / 0.35) * (index === 0 ? 0.55 : 0.45) : 0
    )
  );

  const fleetRevealed = progress >= CINEMATIC_DEATH_STAR_START - 0.02;

  return {
    introOpacity,
    deathStarRise,
    deathStarVisible,
    destroyerHyperspace,
    hyperspaceFlash,
    fleetRevealed,
  };
}
