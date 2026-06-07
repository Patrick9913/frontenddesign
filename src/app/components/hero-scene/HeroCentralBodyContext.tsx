"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  HERO_CENTRAL_BODY_STORAGE_KEY,
  readStoredHeroCentralBody,
  type HeroCentralBody,
} from "./heroCentralBody";

type HeroCentralBodyContextValue = {
  centralBody: HeroCentralBody;
  setCentralBody: (body: HeroCentralBody) => void;
  toggleCentralBody: () => void;
  isMoon: boolean;
  isDeathStar: boolean;
};

export const HeroCentralBodyContext = createContext<HeroCentralBodyContextValue | null>(null);

export function HeroCentralBodyProvider({ children }: { children: ReactNode }) {
  const [centralBody, setCentralBodyState] = useState<HeroCentralBody>(() => {
    if (typeof window === "undefined") return "deathstar";
    return readStoredHeroCentralBody() ?? "deathstar";
  });

  const setCentralBody = useCallback((body: HeroCentralBody) => {
    setCentralBodyState(body);
    try {
      localStorage.setItem(HERO_CENTRAL_BODY_STORAGE_KEY, body);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCentralBody = useCallback(() => {
    setCentralBody(centralBody === "moon" ? "deathstar" : "moon");
  }, [centralBody, setCentralBody]);

  const value = useMemo(
    () => ({
      centralBody,
      setCentralBody,
      toggleCentralBody,
      isMoon: centralBody === "moon",
      isDeathStar: centralBody === "deathstar",
    }),
    [centralBody, setCentralBody, toggleCentralBody],
  );

  return (
    <HeroCentralBodyContext.Provider value={value}>{children}</HeroCentralBodyContext.Provider>
  );
}

export function useHeroCentralBody(): HeroCentralBodyContextValue {
  const ctx = useContext(HeroCentralBodyContext);
  if (!ctx) {
    throw new Error("useHeroCentralBody debe usarse dentro de HeroCentralBodyProvider");
  }
  return ctx;
}
