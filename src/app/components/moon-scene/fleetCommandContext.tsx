"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DESTROYER_0_POSITION,
  DEFAULT_DESTROYER_1_POSITION,
} from "./escortDefaults";
import type { DestroyerId } from "./SceneTuningContext";

export type DestroyerRuntime = {
  position: [number, number, number];
  destination: [number, number, number] | null;
};

export type DestroyerRuntimeMap = Record<DestroyerId, DestroyerRuntime>;

const DEFAULT_RUNTIME: DestroyerRuntimeMap = {
  0: { position: DEFAULT_DESTROYER_0_POSITION, destination: null },
  1: { position: DEFAULT_DESTROYER_1_POSITION, destination: null },
};

type FleetCommandContextValue = {
  selectedId: DestroyerId | null;
  runtime: DestroyerRuntimeMap;
  previewLocal: [number, number, number] | null;
  selectDestroyer: (id: DestroyerId | null) => void;
  issueMoveOrder: (id: DestroyerId, destination: [number, number, number]) => void;
  setRuntimePosition: (id: DestroyerId, position: [number, number, number]) => void;
  clearDestination: (id: DestroyerId) => void;
  clearAllDestinations: () => void;
  syncRuntimeFromTuning: (id: DestroyerId, position: [number, number, number]) => void;
  registerDestroyerRuntime: (id: DestroyerId, position: [number, number, number]) => void;
  unregisterDestroyerRuntime: (id: DestroyerId) => void;
  resetRuntime: () => void;
  setCommandPreview: (local: [number, number, number] | null) => void;
};

const FleetCommandContext = createContext<FleetCommandContextValue | null>(null);

export function getDestroyerRuntime(
  runtime: DestroyerRuntimeMap,
  id: DestroyerId
): DestroyerRuntime {
  return runtime[id] ?? { position: [0, 0, 0], destination: null };
}

export function FleetCommandProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<DestroyerId | null>(null);
  const [runtime, setRuntime] = useState<DestroyerRuntimeMap>(DEFAULT_RUNTIME);
  const [previewLocal, setPreviewLocal] = useState<[number, number, number] | null>(null);

  const selectDestroyer = useCallback((id: DestroyerId | null) => {
    setSelectedId(id);
    if (id === null) setPreviewLocal(null);
  }, []);

  const issueMoveOrder = useCallback((id: DestroyerId, destination: [number, number, number]) => {
    setRuntime((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: { ...current, destination },
      };
    });
  }, []);

  const setRuntimePosition = useCallback((id: DestroyerId, position: [number, number, number]) => {
    setRuntime((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: { ...current, position },
      };
    });
  }, []);

  const clearDestination = useCallback((id: DestroyerId) => {
    setRuntime((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: { ...current, destination: null },
      };
    });
  }, []);

  const clearAllDestinations = useCallback(() => {
    setRuntime((prev) => {
      const next: DestroyerRuntimeMap = { ...prev };
      for (const id of Object.keys(next)) {
        const numericId = Number(id);
        next[numericId] = { ...next[numericId], destination: null };
      }
      return next;
    });
  }, []);

  const setCommandPreview = useCallback((local: [number, number, number] | null) => {
    setPreviewLocal(local);
  }, []);

  const syncRuntimeFromTuning = useCallback((id: DestroyerId, position: [number, number, number]) => {
    setRuntime((prev) => {
      const current = prev[id];
      if (!current || current.destination) return prev;
      return {
        ...prev,
        [id]: { ...current, position },
      };
    });
  }, []);

  const registerDestroyerRuntime = useCallback(
    (id: DestroyerId, position: [number, number, number]) => {
      setRuntime((prev) => ({
        ...prev,
        [id]: { position, destination: null },
      }));
    },
    []
  );

  const unregisterDestroyerRuntime = useCallback((id: DestroyerId) => {
    setRuntime((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const resetRuntime = useCallback(() => {
    setRuntime(DEFAULT_RUNTIME);
    setSelectedId(null);
    setPreviewLocal(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Escape") return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      setSelectedId(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      runtime,
      previewLocal,
      selectDestroyer,
      issueMoveOrder,
      setRuntimePosition,
      clearDestination,
      clearAllDestinations,
      syncRuntimeFromTuning,
      registerDestroyerRuntime,
      unregisterDestroyerRuntime,
      resetRuntime,
      setCommandPreview,
    }),
    [
      selectedId,
      runtime,
      previewLocal,
      selectDestroyer,
      issueMoveOrder,
      setRuntimePosition,
      clearDestination,
      clearAllDestinations,
      syncRuntimeFromTuning,
      registerDestroyerRuntime,
      unregisterDestroyerRuntime,
      resetRuntime,
      setCommandPreview,
    ]
  );

  return (
    <FleetCommandContext.Provider value={value}>{children}</FleetCommandContext.Provider>
  );
}

export function useFleetCommand() {
  const context = useContext(FleetCommandContext);
  if (!context) {
    throw new Error("useFleetCommand debe usarse dentro de FleetCommandProvider");
  }
  return context;
}
