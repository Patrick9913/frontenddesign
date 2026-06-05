"use client";

import { useEffect } from "react";
import { useFleetCommand } from "./moon-scene/fleetCommandContext";

export function FleetPhotoModeSync({ photoMode }: { photoMode: boolean }) {
  const { selectDestroyer, clearAllDestinations } = useFleetCommand();

  useEffect(() => {
    if (!photoMode) return;
    selectDestroyer(null);
    clearAllDestinations();
  }, [photoMode, selectDestroyer, clearAllDestinations]);

  return null;
}
