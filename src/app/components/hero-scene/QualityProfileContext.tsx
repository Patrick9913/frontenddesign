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
  detectDefaultQuality,
  getQualitySettings,
  QUALITY_STORAGE_KEY,
  readStoredQuality,
  type QualityProfile,
  type QualitySettings,
} from "./qualitySettings";

type QualityProfileContextValue = {
  quality: QualityProfile;
  settings: QualitySettings;
  setQuality: (quality: QualityProfile) => void;
};

export const QualityProfileContext = createContext<QualityProfileContextValue | null>(null);

export function QualityProfileProvider({ children }: { children: ReactNode }) {
  const [quality, setQualityState] = useState<QualityProfile>(() => {
    if (typeof window === "undefined") return "high";
    return readStoredQuality() ?? detectDefaultQuality();
  });

  const setQuality = useCallback((next: QualityProfile) => {
    setQualityState(next);
    try {
      localStorage.setItem(QUALITY_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (readStoredQuality()) return;
      const auto = detectDefaultQuality();
      setQualityState((prev) => (prev === auto ? prev : auto));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const settings = useMemo(() => getQualitySettings(quality), [quality]);
  const value = useMemo(
    () => ({ quality, settings, setQuality }),
    [quality, settings, setQuality],
  );

  return (
    <QualityProfileContext.Provider value={value}>{children}</QualityProfileContext.Provider>
  );
}

export function useQualityProfileContext(): QualityProfileContextValue {
  const ctx = useContext(QualityProfileContext);
  if (!ctx) {
    throw new Error("useQualityProfileContext debe usarse dentro de QualityProfileProvider");
  }
  return ctx;
}
