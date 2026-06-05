"use client";

import { useEffect } from "react";
import { useFleetCommand } from "./moon-scene/fleetCommandContext";

export function FleetFlyModeSync({ flyMode }: { flyMode: boolean }) {
  const { selectDestroyer, clearAllDestinations, setCommandPreview } = useFleetCommand();

  useEffect(() => {
    if (flyMode) return;
    selectDestroyer(null);
    clearAllDestinations();
    setCommandPreview(null);
  }, [flyMode, selectDestroyer, clearAllDestinations, setCommandPreview]);

  return null;
}
