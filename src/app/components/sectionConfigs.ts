export interface SectionConfig {
  cameraPos: { x: number; y: number; z: number };
  lookAtPos: { x: number; y: number; z: number };
  haloPos: { x: number; y: number; z: number };
  haloRotationSpeed: number;
  particleOpacity: number;
  fogDensity: number;
}

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    cameraPos: { x: 0, y: 0.3, z: 9 },
    lookAtPos: { x: 0.8, y: 0, z: -1.5 },
    haloPos: { x: 0.8, y: 0, z: -1.5 },
    haloRotationSpeed: 0.04,
    particleOpacity: 0.45,
    fogDensity: 0.045,
  },
  {
    cameraPos: { x: -2.5, y: 1.0, z: 8.0 },
    lookAtPos: { x: 1.2, y: -0.2, z: -2.0 },
    haloPos: { x: 1.2, y: -0.4, z: -2.0 },
    haloRotationSpeed: 0.05,
    particleOpacity: 0.6,
    fogDensity: 0.05,
  },
  {
    cameraPos: { x: 2.2, y: -0.5, z: 8.5 },
    lookAtPos: { x: -1.0, y: 0.2, z: -1.0 },
    haloPos: { x: -1.0, y: 0.2, z: -1.2 },
    haloRotationSpeed: 0.025,
    particleOpacity: 0.35,
    fogDensity: 0.055,
  },
  {
    cameraPos: { x: 0, y: 3.5, z: 8.2 },
    lookAtPos: { x: 0, y: -0.8, z: -2.2 },
    haloPos: { x: 0, y: -1.0, z: -2.2 },
    haloRotationSpeed: 0.045,
    particleOpacity: 0.5,
    fogDensity: 0.045,
  },
  {
    cameraPos: { x: -3.0, y: -0.6, z: 7.2 },
    lookAtPos: { x: 1.5, y: 0.3, z: -2.2 },
    haloPos: { x: 1.5, y: 0.3, z: -2.5 },
    haloRotationSpeed: 0.05,
    particleOpacity: 0.55,
    fogDensity: 0.05,
  },
  {
    cameraPos: { x: 0, y: 0.2, z: 11.5 },
    lookAtPos: { x: 0, y: 0, z: -4.5 },
    haloPos: { x: 0, y: 0, z: -4.5 },
    haloRotationSpeed: 0.03,
    particleOpacity: 0.3,
    fogDensity: 0.07,
  },
  {
    cameraPos: { x: 1.8, y: -0.4, z: 10.0 },
    lookAtPos: { x: -0.6, y: 0.1, z: -3.2 },
    haloPos: { x: -0.6, y: 0.1, z: -3.2 },
    haloRotationSpeed: 0.022,
    particleOpacity: 0.25,
    fogDensity: 0.075,
  },
];
