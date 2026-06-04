"use client";

import React, { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { sceneStore, type SceneRuntimeState } from "./sceneStore";
import type { SiteSectionId } from "./sections";

type SceneContextValue = {
  state: SceneRuntimeState;
  setExploreMode: (value: boolean) => void;
  setActiveSkillIndex: (index: number) => void;
  setActiveProjectIndex: (index: number) => void;
  setContactFillProgress: (value: number) => void;
  setAudioEnabled: (value: boolean) => void;
};

const SceneContext = createContext<SceneContextValue | null>(null);

let listeners = new Set<() => void>();
let version = 0;

export function notifySceneUi() {
  version += 1;
  listeners.forEach((l) => l());
}

export function subscribeSceneStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSceneStoreVersion() {
  return version;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return version;
}

export function SceneProvider({ children }: { children: ReactNode }) {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const value: SceneContextValue = {
    state: sceneStore,
    setExploreMode: (v) => {
      sceneStore.exploreMode = v;
      notifySceneUi();
    },
    setActiveSkillIndex: (index) => {
      sceneStore.activeSkillIndex = index;
    },
    setActiveProjectIndex: (index) => {
      sceneStore.activeProjectIndex = index;
    },
    setContactFillProgress: (value) => {
      sceneStore.contactFillProgress = value;
    },
    setAudioEnabled: (value) => {
      sceneStore.audioEnabled = value;
      notifySceneUi();
    },
  };

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used within SceneProvider");
  return ctx;
}

export function useActiveSection(): SiteSectionId {
  useSyncExternalStore(subscribe, () => sceneStore.activeSection, () => "hero" as SiteSectionId);
  return sceneStore.activeSection;
}
