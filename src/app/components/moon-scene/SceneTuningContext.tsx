"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DESTROYER_0_POSITION,
  DEFAULT_DESTROYER_1_POSITION,
} from "./escortDefaults";

export const DEFAULT_DEATH_STAR_ROTATION_DEG: [number, number, number] = [0, 150, 0];
export const DEFAULT_SUN_OFFSET: [number, number, number] = [0, 0, 0];
export const DEFAULT_CAMERA_FOV = 38;

export type DestroyerId = 0 | 1;
export type Axis = 0 | 1 | 2;

export type DestroyerTuning = {
  position: [number, number, number];
  scale: number;
};

export const DEFAULT_DESTROYER_TUNING: [DestroyerTuning, DestroyerTuning] = [
  { position: DEFAULT_DESTROYER_0_POSITION, scale: 1 },
  { position: DEFAULT_DESTROYER_1_POSITION, scale: 1 },
];

type SceneTuningContextValue = {
  layoutEditEnabled: boolean;
  deathStarRotationDeg: [number, number, number];
  sunOffset: [number, number, number];
  destroyers: [DestroyerTuning, DestroyerTuning];
  selectedDestroyerId: DestroyerId | null;
  cameraFov: number;
  setDeathStarRotationDeg: (axis: Axis, value: number) => void;
  setSunOffset: (axis: Axis, value: number) => void;
  setCameraFov: (value: number) => void;
  setDestroyerPosition: (id: DestroyerId, axis: Axis, value: number) => void;
  setDestroyerPositionTuple: (id: DestroyerId, position: [number, number, number]) => void;
  setDestroyerScale: (id: DestroyerId, scale: number) => void;
  setSelectedDestroyerId: (id: DestroyerId | null) => void;
  resetTuning: () => void;
};

const SceneTuningContext = createContext<SceneTuningContextValue | null>(null);

export function SceneTuningProvider({
  children,
  layoutEditEnabled = true,
}: {
  children: ReactNode;
  layoutEditEnabled?: boolean;
}) {
  const [deathStarRotationDeg, setDeathStarRotationDegState] = useState(DEFAULT_DEATH_STAR_ROTATION_DEG);
  const [sunOffset, setSunOffsetState] = useState(DEFAULT_SUN_OFFSET);
  const [destroyers, setDestroyersState] =
    useState<[DestroyerTuning, DestroyerTuning]>(DEFAULT_DESTROYER_TUNING);
  const [selectedDestroyerId, setSelectedDestroyerId] = useState<DestroyerId | null>(null);
  const [cameraFov, setCameraFovState] = useState(DEFAULT_CAMERA_FOV);

  const value = useMemo<SceneTuningContextValue>(
    () => ({
      layoutEditEnabled,
      deathStarRotationDeg,
      sunOffset,
      destroyers,
      selectedDestroyerId,
      cameraFov,
      setDeathStarRotationDeg: (axis, value) => {
        setDeathStarRotationDegState((prev) => {
          const next: [number, number, number] = [...prev];
          next[axis] = value;
          return next;
        });
      },
      setSunOffset: (axis, value) => {
        setSunOffsetState((prev) => {
          const next: [number, number, number] = [...prev];
          next[axis] = value;
          return next;
        });
      },
      setCameraFov: setCameraFovState,
      setDestroyerPosition: (id, axis, value) => {
        setDestroyersState((prev) => {
          const next: [DestroyerTuning, DestroyerTuning] = [
            { ...prev[0], position: [...prev[0].position] as [number, number, number] },
            { ...prev[1], position: [...prev[1].position] as [number, number, number] },
          ];
          next[id].position[axis] = value;
          return next;
        });
      },
      setDestroyerPositionTuple: (id, position) => {
        setDestroyersState((prev) => {
          const next: [DestroyerTuning, DestroyerTuning] = [...prev];
          next[id] = { ...next[id], position: [...position] };
          return next;
        });
      },
      setDestroyerScale: (id, scale) => {
        setDestroyersState((prev) => {
          const next: [DestroyerTuning, DestroyerTuning] = [...prev];
          next[id] = { ...next[id], scale };
          return next;
        });
      },
      setSelectedDestroyerId,
      resetTuning: () => {
        setDeathStarRotationDegState(DEFAULT_DEATH_STAR_ROTATION_DEG);
        setSunOffsetState(DEFAULT_SUN_OFFSET);
        setDestroyersState(DEFAULT_DESTROYER_TUNING);
        setSelectedDestroyerId(null);
        setCameraFovState(DEFAULT_CAMERA_FOV);
      },
    }),
    [cameraFov, deathStarRotationDeg, destroyers, layoutEditEnabled, selectedDestroyerId, sunOffset]
  );

  return <SceneTuningContext.Provider value={value}>{children}</SceneTuningContext.Provider>;
}

export function useSceneTuning() {
  const ctx = useContext(SceneTuningContext);
  if (!ctx) {
    throw new Error("useSceneTuning debe usarse dentro de SceneTuningProvider");
  }
  return ctx;
}
