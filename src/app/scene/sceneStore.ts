import type { SiteSectionId } from "./sections";

export type SceneRuntimeState = {
  pointer: { x: number; y: number; screenX: number; screenY: number };
  heroScrollProgress: number;
  aboutScrollProgress: number;
  exploreMode: boolean;
  showExploreHint: boolean;
  activeSection: SiteSectionId;
  sectionProgress: number;
  globalProgress: number;
  activeSkillIndex: number;
  activeProjectIndex: number;
  contactFillProgress: number;
  contactFlash: number;
  audioEnabled: boolean;
  reducedMotion: boolean;
};

export function createInitialSceneState(): SceneRuntimeState {
  return {
    pointer: { x: 0, y: 0, screenX: 0, screenY: 0 },
    heroScrollProgress: 0,
    aboutScrollProgress: 0,
    exploreMode: false,
    showExploreHint: false,
    activeSection: "hero",
    sectionProgress: 0,
    globalProgress: 0,
    activeSkillIndex: -1,
    activeProjectIndex: 0,
    contactFillProgress: 0,
    contactFlash: 0,
    audioEnabled: false,
    reducedMotion: false,
  };
}

/** Estado mutable compartido entre DOM y WebGL sin re-renders por frame. */
export const sceneStore: SceneRuntimeState = createInitialSceneState();

export function setScenePointer(clientX: number, clientY: number) {
  sceneStore.pointer.screenX = clientX;
  sceneStore.pointer.screenY = clientY;
  sceneStore.pointer.x = (clientX / window.innerWidth) * 2 - 1;
  sceneStore.pointer.y = -(clientY / window.innerHeight) * 2 + 1;
}

export function triggerContactFlash() {
  sceneStore.contactFlash = 1;
}

export function decayContactFlash(delta: number) {
  if (sceneStore.contactFlash > 0) {
    sceneStore.contactFlash = Math.max(0, sceneStore.contactFlash - delta * 1.8);
  }
}
