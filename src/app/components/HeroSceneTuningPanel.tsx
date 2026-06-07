"use client";

import type { ReactNode } from "react";
import { getDefaultDestroyerPosition } from "./moon-scene/escortDefaults";
import {
  DEFAULT_DESTROYERS,
  useSceneTuning,
  type DestroyerId,
} from "./moon-scene/SceneTuningContext";
import { useFleetCommand } from "./moon-scene/fleetCommandContext";

const AXIS_LABELS = ["X", "Y", "Z"] as const;

function CategoryResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 border border-white/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:border-amber-100/30 hover:text-amber-100/75"
    >
      Reset
    </button>
  );
}

function TuningCategory({
  title,
  onReset,
  children,
  bordered = false,
}: {
  title: string;
  onReset: () => void;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={
        bordered
          ? "space-y-4 rounded border border-white/10 bg-black/20 p-3"
          : "space-y-3"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[9px] font-light uppercase tracking-[0.22em] text-amber-100/55">
          {title}
        </p>
        <CategoryResetButton onClick={onReset} />
      </div>
      {children}
    </div>
  );
}

type SliderRowProps = {
  label: string;
  values: [number, number, number];
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (axis: 0 | 1 | 2, value: number) => void;
};

function SliderRow({ label, values, min, max, step, unit = "°", onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] font-light uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      {AXIS_LABELS.map((axisLabel, axis) => (
        <label key={`${label}-${axisLabel}`} className="flex items-center gap-2">
          <span className="w-3 font-mono text-[9px] text-white/35">{axisLabel}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[axis]}
            onChange={(event) => onChange(axis as 0 | 1 | 2, Number(event.target.value))}
            className="h-1 flex-1 cursor-pointer accent-amber-200/80"
          />
          <span className="w-12 text-right font-mono text-[9px] tabular-nums text-white/50">
            {values[axis].toFixed(step < 1 ? 2 : 0)}
            {unit}
          </span>
        </label>
      ))}
    </div>
  );
}

type ScaleSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function ScaleSlider({ label, value, min, max, step, suffix = "×", onChange }: ScaleSliderProps) {
  return (
    <label className="block space-y-2">
      <p className="font-mono text-[9px] font-light uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1 flex-1 cursor-pointer accent-cyan-200/80"
        />
        <span className="w-12 text-right font-mono text-[9px] tabular-nums text-white/50">
          {value.toFixed(step < 0.001 ? 4 : step < 1 ? 1 : 2)}
          {suffix}
        </span>
      </div>
    </label>
  );
}

function DestroyerSection({
  id,
  title,
  active,
  onSelect,
  onReset,
  onRemove,
  canRemove,
}: {
  id: DestroyerId;
  title: string;
  active: boolean;
  onSelect: () => void;
  onReset: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { destroyers, setDestroyerPosition, setDestroyerScale } = useSceneTuning();
  const tuning = destroyers.find((destroyer) => destroyer.id === id);
  if (!tuning) return null;

  return (
    <div
      className={`rounded border p-3 transition-colors ${
        active ? "border-cyan-200/35 bg-cyan-950/25" : "border-white/10 bg-black/20"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="text-left font-mono text-[9px] font-light uppercase tracking-[0.22em] text-amber-100/75 hover:text-cyan-100/90"
        >
          {title} {active ? "· seleccionado" : ""}
        </button>
        <div className="flex items-center gap-2">
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="border border-white/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:border-red-300/30 hover:text-red-200/75"
            >
              Quitar
            </button>
          ) : null}
          <CategoryResetButton onClick={onReset} />
        </div>
      </div>
      <div className="space-y-4">
        <SliderRow
          label="Posición (escena)"
          values={tuning.position}
          min={-8}
          max={8}
          step={0.02}
          unit=""
          onChange={(axis, value) => setDestroyerPosition(id, axis, value)}
        />
        <ScaleSlider
          label="Tamaño"
          value={tuning.scale}
          min={0.2}
          max={3}
          step={0.05}
          onChange={(value) => setDestroyerScale(id, value)}
        />
      </div>
    </div>
  );
}

export function HeroSceneTuningPanel() {
  const {
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
    setDeathStarRotationDeg,
    setSunOffset,
    setCameraFov,
    setChromaticOffset,
    setChromaticIntensity,
    setChromaticModulation,
    setMoonDisplacement,
    setMoonNormalIntensity,
    setStarsVisible,
    setSelectedDestroyerId,
    addDestroyer,
    removeDestroyer,
    resetTuning,
    resetDeathStarRotation,
    resetSunOffset,
    resetCameraFov,
    resetChromaticAberration,
    resetMoonSurface,
    resetSceneEnvironment,
    resetDestroyer,
    resetDestroyers,
  } = useSceneTuning();
  const {
    setRuntimePosition,
    clearDestination,
    registerDestroyerRuntime,
    unregisterDestroyerRuntime,
    resetRuntime,
  } = useFleetCommand();

  const resetDestroyerWithFleet = (id: DestroyerId) => {
    resetDestroyer(id);
    const preset = DEFAULT_DESTROYERS.find((destroyer) => destroyer.id === id);
    const position = preset?.position ?? getDefaultDestroyerPosition(id);
    setRuntimePosition(id, [...position] as [number, number, number]);
    clearDestination(id);
  };

  const handleAddDestroyer = () => {
    const created = addDestroyer();
    registerDestroyerRuntime(created.id, [...created.position] as [number, number, number]);
  };

  const handleRemoveDestroyer = (id: DestroyerId) => {
    removeDestroyer(id);
    unregisterDestroyerRuntime(id);
  };

  const handleResetDestroyers = () => {
    resetDestroyers();
    resetRuntime();
  };

  const copySceneValues = async () => {
    const destroyerLines = destroyers.map(
      (destroyer, index) =>
        `DESTROYER_${index + 1}: id ${destroyer.id}, pos [${destroyer.position.map((v) => v.toFixed(2)).join(", ")}], scale ${destroyer.scale.toFixed(2)}`
    );
    const snippet = [
      `DEATH_STAR_ROTATION_DEG: [${deathStarRotationDeg.join(", ")}]`,
      `SUN_OFFSET: [${sunOffset.map((v) => v.toFixed(2)).join(", ")}]`,
      `CAMERA_FOV: ${cameraFov.toFixed(1)}`,
      `CHROMATIC_OFFSET: [${chromaticOffset.map((v) => v.toFixed(4)).join(", ")}]`,
      `CHROMATIC_INTENSITY: ${chromaticIntensity.toFixed(2)}`,
      `CHROMATIC_MODULATION: ${chromaticModulation.toFixed(2)}`,
      `MOON_DISPLACEMENT: ${moonDisplacement.toFixed(3)}`,
      `MOON_NORMAL_INTENSITY: ${moonNormalIntensity.toFixed(2)}`,
      `STARS_VISIBLE: ${starsVisible}`,
      ...destroyerLines,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      // Clipboard puede fallar fuera de HTTPS; ignorar.
    }
  };

  return (
    <aside className="pointer-events-auto absolute left-4 top-[4.25rem] z-[38] max-h-[min(72vh,36rem)] w-[min(20rem,calc(100vw-2.5rem))] overflow-y-auto border border-amber-100/20 bg-black/82 p-4 shadow-[0_0_40px_-12px_rgba(255,200,140,0.25)] backdrop-blur-md md:left-6 md:top-[4.75rem] md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] font-light uppercase tracking-[0.28em] text-amber-100/45">
            Opciones de escena
          </p>
          <h2 className="mt-1 font-mono text-[11px] font-light uppercase tracking-[0.2em] text-amber-100/90">
            Ajuste de escena
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copySceneValues}
            className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:border-amber-100/30 hover:text-amber-100/75"
          >
            Copiar
          </button>
          <button
            type="button"
            onClick={() => {
              resetTuning();
              resetRuntime();
            }}
            className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:border-amber-100/30 hover:text-amber-100/75"
            title="Restablecer toda la escena"
          >
            Reset todo
          </button>
        </div>
      </div>

      <p className="mb-4 font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/35">
        Ajustes compartidos para luna y Death Star. Los destructores solo aplican con la flota activa.
      </p>

      <div className="space-y-5">
        <TuningCategory title="Entorno" onReset={resetSceneEnvironment}>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="font-mono text-[9px] font-light uppercase tracking-[0.18em] text-white/45">
              Mostrar estrellas
            </span>
            <input
              type="checkbox"
              checked={starsVisible}
              onChange={(event) => setStarsVisible(event.target.checked)}
              className="h-4 w-4 cursor-pointer accent-amber-200/90"
            />
          </label>
        </TuningCategory>

        <TuningCategory title="Luna (PBR)" onReset={resetMoonSurface}>
          <ScaleSlider
            label="Relieve geométrico"
            value={moonDisplacement}
            min={0}
            max={0.2}
            step={0.002}
            suffix=""
            onChange={setMoonDisplacement}
          />
          <ScaleSlider
            label="Relieve superficial"
            value={moonNormalIntensity}
            min={0}
            max={1.6}
            step={0.05}
            suffix="×"
            onChange={setMoonNormalIntensity}
          />
          <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-white/30">
            Geométrico = cráteres en 3D. Superficial = detalle en shader (0 = liso).
          </p>
        </TuningCategory>

        <TuningCategory title="Death Star" onReset={resetDeathStarRotation}>
          <SliderRow
            label="Rotación"
            values={deathStarRotationDeg}
            min={-180}
            max={180}
            step={1}
            onChange={setDeathStarRotationDeg}
          />
        </TuningCategory>

        <TuningCategory title="Iluminación" onReset={resetSunOffset}>
          <SliderRow
            label="Dirección luz (sol)"
            values={sunOffset}
            min={-24}
            max={24}
            step={0.5}
            unit=""
            onChange={setSunOffset}
          />
        </TuningCategory>

        <TuningCategory title="Cámara" onReset={resetCameraFov}>
          <ScaleSlider
            label="FOV"
            value={cameraFov}
            min={18}
            max={75}
            step={0.5}
            suffix="°"
            onChange={setCameraFov}
          />
        </TuningCategory>

        <TuningCategory
          title="Aberración cromática"
          onReset={resetChromaticAberration}
          bordered
        >
          <ScaleSlider
            label="Intensidad global"
            value={chromaticIntensity}
            min={0}
            max={3}
            step={0.05}
            suffix="×"
            onChange={setChromaticIntensity}
          />
          <ScaleSlider
            label="Offset X"
            value={chromaticOffset[0]}
            min={0}
            max={0.02}
            step={0.0001}
            suffix=""
            onChange={(value) => setChromaticOffset(0, value)}
          />
          <ScaleSlider
            label="Offset Y"
            value={chromaticOffset[1]}
            min={0}
            max={0.01}
            step={0.0001}
            suffix=""
            onChange={(value) => setChromaticOffset(1, value)}
          />
          <ScaleSlider
            label="Modulación radial"
            value={chromaticModulation}
            min={0}
            max={1}
            step={0.01}
            suffix=""
            onChange={setChromaticModulation}
          />
        </TuningCategory>

        <TuningCategory title="Destructores" onReset={handleResetDestroyers} bordered>
          <button
            type="button"
            onClick={handleAddDestroyer}
            className="w-full border border-cyan-200/25 bg-cyan-950/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100/80 transition-colors hover:border-cyan-100/40 hover:bg-cyan-900/35 hover:text-cyan-50"
          >
            + Agregar destructor
          </button>

          {destroyers.length === 0 ? (
            <p className="font-mono text-[9px] tracking-[0.12em] text-white/35">
              No hay destructores en escena. Usa el botón de arriba para añadir uno.
            </p>
          ) : null}

          <div className="space-y-3">
            {destroyers.map((destroyer, index) => (
              <DestroyerSection
                key={destroyer.id}
                id={destroyer.id}
                title={`Destructor ${index + 1}`}
                active={selectedDestroyerId === destroyer.id}
                onSelect={() => setSelectedDestroyerId(destroyer.id)}
                onReset={() => resetDestroyerWithFleet(destroyer.id)}
                onRemove={() => handleRemoveDestroyer(destroyer.id)}
                canRemove
              />
            ))}
          </div>
        </TuningCategory>
      </div>
    </aside>
  );
}
