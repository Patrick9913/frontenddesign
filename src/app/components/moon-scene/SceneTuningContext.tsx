"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DESTROYER_0_POSITION,
  DEFAULT_DESTROYER_1_POSITION,
  getDefaultDestroyerPosition,
} from "./escortDefaults";

export const DEFAULT_DEATH_STAR_ROTATION_DEG: [number, number, number] = [0, 150, 0];
export const DEFAULT_SUN_OFFSET: [number, number, number] = [0, 0, 0];
export const DEFAULT_CAMERA_FOV = 38;
export const DEFAULT_CHROMATIC_OFFSET: [number, number] = [0.0042, 0.0015];
export const DEFAULT_CHROMATIC_INTENSITY = 1;
export const DEFAULT_CHROMATIC_MODULATION = 0.25;
export const DEFAULT_MOON_DISPLACEMENT = 0.035;
export const DEFAULT_MOON_NORMAL_INTENSITY = 1;
export const DEFAULT_STARS_VISIBLE = true;

export type DestroyerId = number;
export type Axis = 0 | 1 | 2;

export type DestroyerConfig = {
  id: DestroyerId;
  position: [number, number, number];
  scale: number;
};

export const DEFAULT_DESTROYERS: DestroyerConfig[] = [
  { id: 0, position: DEFAULT_DESTROYER_0_POSITION, scale: 1 },
  { id: 1, position: DEFAULT_DESTROYER_1_POSITION, scale: 1 },
];

type SceneTuningContextValue = {
  layoutEditEnabled: boolean;
  deathStarRotationDeg: [number, number, number];
  sunOffset: [number, number, number];
  destroyers: DestroyerConfig[];
  selectedDestroyerId: DestroyerId | null;
  cameraFov: number;
  chromaticOffset: [number, number];
  chromaticIntensity: number;
  chromaticModulation: number;
  moonDisplacement: number;
  moonNormalIntensity: number;
  starsVisible: boolean;
  setDeathStarRotationDeg: (axis: Axis, value: number) => void;
  setSunOffset: (axis: Axis, value: number) => void;
  setCameraFov: (value: number) => void;
  setChromaticOffset: (axis: 0 | 1, value: number) => void;
  setChromaticIntensity: (value: number) => void;
  setChromaticModulation: (value: number) => void;
  setMoonDisplacement: (value: number) => void;
  setMoonNormalIntensity: (value: number) => void;
  setStarsVisible: (value: boolean) => void;
  setDestroyerPosition: (id: DestroyerId, axis: Axis, value: number) => void;
  setDestroyerPositionTuple: (id: DestroyerId, position: [number, number, number]) => void;
  setDestroyerScale: (id: DestroyerId, scale: number) => void;
  setSelectedDestroyerId: (id: DestroyerId | null) => void;
  addDestroyer: () => DestroyerConfig;
  removeDestroyer: (id: DestroyerId) => void;
  resetTuning: () => void;
  resetDeathStarRotation: () => void;
  resetSunOffset: () => void;
  resetCameraFov: () => void;
  resetChromaticAberration: () => void;
  resetMoonSurface: () => void;
  resetSceneEnvironment: () => void;
  resetDestroyer: (id: DestroyerId) => void;
  resetDestroyers: () => void;
};

const SceneTuningContext = createContext<SceneTuningContextValue | null>(null);

function cloneDestroyers(destroyers: DestroyerConfig[]) {
  return destroyers.map((destroyer) => ({
    ...destroyer,
    position: [...destroyer.position] as [number, number, number],
  }));
}

function getDefaultDestroyerById(id: DestroyerId): DestroyerConfig {
  const preset = DEFAULT_DESTROYERS.find((destroyer) => destroyer.id === id);
  if (preset) {
    return {
      id: preset.id,
      position: [...preset.position] as [number, number, number],
      scale: preset.scale,
    };
  }

  return {
    id,
    position: getDefaultDestroyerPosition(id),
    scale: 1,
  };
}

export function SceneTuningProvider({
  children,
  layoutEditEnabled = true,
}: {
  children: ReactNode;
  layoutEditEnabled?: boolean;
}) {
  const [deathStarRotationDeg, setDeathStarRotationDegState] = useState(DEFAULT_DEATH_STAR_ROTATION_DEG);
  const [sunOffset, setSunOffsetState] = useState(DEFAULT_SUN_OFFSET);
  const [destroyers, setDestroyersState] = useState<DestroyerConfig[]>(cloneDestroyers(DEFAULT_DESTROYERS));
  const [selectedDestroyerId, setSelectedDestroyerId] = useState<DestroyerId | null>(null);
  const [cameraFov, setCameraFovState] = useState(DEFAULT_CAMERA_FOV);
  const [chromaticOffset, setChromaticOffsetState] =
    useState<[number, number]>(DEFAULT_CHROMATIC_OFFSET);
  const [chromaticIntensity, setChromaticIntensityState] = useState(DEFAULT_CHROMATIC_INTENSITY);
  const [chromaticModulation, setChromaticModulationState] = useState(DEFAULT_CHROMATIC_MODULATION);
  const [moonDisplacement, setMoonDisplacementState] = useState(DEFAULT_MOON_DISPLACEMENT);
  const [moonNormalIntensity, setMoonNormalIntensityState] = useState(DEFAULT_MOON_NORMAL_INTENSITY);
  const [starsVisible, setStarsVisibleState] = useState(DEFAULT_STARS_VISIBLE);
  const nextDestroyerIdRef = useRef(
    DEFAULT_DESTROYERS.reduce((max, destroyer) => Math.max(max, destroyer.id), 0) + 1
  );

  const value = useMemo<SceneTuningContextValue>(
    () => ({
      layoutEditEnabled,
      deathStarRotationDeg,
      sunOffset,
      destroyers,
      selectedDestroyerId,
      cameraFov,
      chromaticOffset,
      chromaticIntensity,
      chromaticModulation,
      moonDisplacement,
      moonNormalIntensity,
      starsVisible,
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
      setChromaticOffset: (axis: 0 | 1, value) => {
        setChromaticOffsetState((prev) => {
          const next: [number, number] = [...prev];
          next[axis] = value;
          return next;
        });
      },
      setChromaticIntensity: setChromaticIntensityState,
      setChromaticModulation: setChromaticModulationState,
      setMoonDisplacement: setMoonDisplacementState,
      setMoonNormalIntensity: setMoonNormalIntensityState,
      setStarsVisible: setStarsVisibleState,
      setDestroyerPosition: (id, axis, value) => {
        setDestroyersState((prev) =>
          prev.map((destroyer) =>
            destroyer.id === id
              ? {
                  ...destroyer,
                  position: destroyer.position.map((component, index) =>
                    index === axis ? value : component
                  ) as [number, number, number],
                }
              : destroyer
          )
        );
      },
      setDestroyerPositionTuple: (id, position) => {
        setDestroyersState((prev) =>
          prev.map((destroyer) =>
            destroyer.id === id
              ? { ...destroyer, position: [...position] as [number, number, number] }
              : destroyer
          )
        );
      },
      setDestroyerScale: (id, scale) => {
        setDestroyersState((prev) =>
          prev.map((destroyer) => (destroyer.id === id ? { ...destroyer, scale } : destroyer))
        );
      },
      setSelectedDestroyerId,
      addDestroyer: () => {
        const id = nextDestroyerIdRef.current++;
        let created: DestroyerConfig = {
          id,
          position: getDefaultDestroyerPosition(0),
          scale: 1,
        };
        setDestroyersState((prev) => {
          created = {
            id,
            position: getDefaultDestroyerPosition(prev.length),
            scale: 1,
          };
          return [...prev, created];
        });
        setSelectedDestroyerId(id);
        return created;
      },
      removeDestroyer: (id) => {
        setDestroyersState((prev) => prev.filter((destroyer) => destroyer.id !== id));
        setSelectedDestroyerId((current) => (current === id ? null : current));
      },
      resetTuning: () => {
        setDeathStarRotationDegState(DEFAULT_DEATH_STAR_ROTATION_DEG);
        setSunOffsetState(DEFAULT_SUN_OFFSET);
        setDestroyersState(cloneDestroyers(DEFAULT_DESTROYERS));
        setSelectedDestroyerId(null);
        setCameraFovState(DEFAULT_CAMERA_FOV);
        setChromaticOffsetState(DEFAULT_CHROMATIC_OFFSET);
        setChromaticIntensityState(DEFAULT_CHROMATIC_INTENSITY);
        setChromaticModulationState(DEFAULT_CHROMATIC_MODULATION);
        setMoonDisplacementState(DEFAULT_MOON_DISPLACEMENT);
        setMoonNormalIntensityState(DEFAULT_MOON_NORMAL_INTENSITY);
        setStarsVisibleState(DEFAULT_STARS_VISIBLE);
        nextDestroyerIdRef.current =
          DEFAULT_DESTROYERS.reduce((max, destroyer) => Math.max(max, destroyer.id), 0) + 1;
      },
      resetDeathStarRotation: () => {
        setDeathStarRotationDegState(DEFAULT_DEATH_STAR_ROTATION_DEG);
      },
      resetSunOffset: () => {
        setSunOffsetState(DEFAULT_SUN_OFFSET);
      },
      resetCameraFov: () => {
        setCameraFovState(DEFAULT_CAMERA_FOV);
      },
      resetChromaticAberration: () => {
        setChromaticOffsetState(DEFAULT_CHROMATIC_OFFSET);
        setChromaticIntensityState(DEFAULT_CHROMATIC_INTENSITY);
        setChromaticModulationState(DEFAULT_CHROMATIC_MODULATION);
      },
      resetMoonSurface: () => {
        setMoonDisplacementState(DEFAULT_MOON_DISPLACEMENT);
        setMoonNormalIntensityState(DEFAULT_MOON_NORMAL_INTENSITY);
      },
      resetSceneEnvironment: () => {
        setStarsVisibleState(DEFAULT_STARS_VISIBLE);
      },
      resetDestroyer: (id) => {
        const defaults = getDefaultDestroyerById(id);
        setDestroyersState((prev) =>
          prev.map((destroyer) =>
            destroyer.id === id
              ? {
                  ...destroyer,
                  position: [...defaults.position] as [number, number, number],
                  scale: defaults.scale,
                }
              : destroyer
          )
        );
      },
      resetDestroyers: () => {
        setDestroyersState(cloneDestroyers(DEFAULT_DESTROYERS));
        setSelectedDestroyerId(null);
        nextDestroyerIdRef.current =
          DEFAULT_DESTROYERS.reduce((max, destroyer) => Math.max(max, destroyer.id), 0) + 1;
      },
    }),
    [
      cameraFov,
      chromaticIntensity,
      chromaticModulation,
      chromaticOffset,
      deathStarRotationDeg,
      destroyers,
      layoutEditEnabled,
      moonDisplacement,
      moonNormalIntensity,
      selectedDestroyerId,
      starsVisible,
      sunOffset,
    ]
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
