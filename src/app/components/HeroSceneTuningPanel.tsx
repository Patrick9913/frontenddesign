"use client";

import { useSceneTuning, type DestroyerId } from "./moon-scene/SceneTuningContext";

const AXIS_LABELS = ["X", "Y", "Z"] as const;

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
      <p className="font-mono text-[9px] font-light uppercase tracking-[0.22em] text-amber-100/55">
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
      <p className="font-mono text-[9px] font-light uppercase tracking-[0.22em] text-amber-100/55">
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
          {value.toFixed(step < 1 ? 1 : 2)}
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
}: {
  id: DestroyerId;
  title: string;
  active: boolean;
  onSelect: () => void;
}) {
  const { destroyers, setDestroyerPosition, setDestroyerScale } = useSceneTuning();
  const tuning = destroyers[id];

  return (
    <div
      className={`rounded border p-3 transition-colors ${
        active ? "border-cyan-200/35 bg-cyan-950/25" : "border-white/10 bg-black/20"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="mb-3 w-full text-left font-mono text-[9px] font-light uppercase tracking-[0.22em] text-amber-100/75 hover:text-cyan-100/90"
      >
        {title} {active ? "· seleccionado" : ""}
      </button>
      <div className="space-y-4">
        <SliderRow
          label="Posición (local)"
          values={tuning.position}
          min={-4}
          max={4}
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
    setDeathStarRotationDeg,
    setSunOffset,
    setCameraFov,
    setSelectedDestroyerId,
    resetTuning,
  } = useSceneTuning();

  const copySceneValues = async () => {
    const snippet = [
      `DEATH_STAR_ROTATION_DEG: [${deathStarRotationDeg.join(", ")}]`,
      `SUN_OFFSET: [${sunOffset.map((v) => v.toFixed(2)).join(", ")}]`,
      `CAMERA_FOV: ${cameraFov.toFixed(1)}`,
      `DESTROYER_0: pos [${destroyers[0].position.map((v) => v.toFixed(2)).join(", ")}], scale ${destroyers[0].scale.toFixed(2)}`,
      `DESTROYER_1: pos [${destroyers[1].position.map((v) => v.toFixed(2)).join(", ")}], scale ${destroyers[1].scale.toFixed(2)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      // Clipboard puede fallar fuera de HTTPS; ignorar.
    }
  };

  return (
    <aside className="pointer-events-auto absolute bottom-[10%] left-[7%] z-[38] max-h-[min(78vh,40rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border border-amber-100/20 bg-black/78 p-4 shadow-[0_0_40px_-12px_rgba(255,200,140,0.25)] backdrop-blur-md md:bottom-[12%] md:left-[8%] md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] font-light uppercase tracking-[0.28em] text-amber-100/45">
            Ajuste de escena
          </p>
          <h2 className="mt-1 font-mono text-[11px] font-light uppercase tracking-[0.2em] text-amber-100/90">
            Composición
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
            onClick={resetTuning}
            className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:border-amber-100/30 hover:text-amber-100/75"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="mb-4 font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/35">
        Arrastra los destructores en la escena o usa los sliders. Mueve el sol para cambiar la
        dirección de la luz.
      </p>

      <div className="space-y-5">
        <SliderRow
          label="Rotación Death Star"
          values={deathStarRotationDeg}
          min={-180}
          max={180}
          step={1}
          onChange={setDeathStarRotationDeg}
        />
        <SliderRow
          label="Dirección luz (sol)"
          values={sunOffset}
          min={-24}
          max={24}
          step={0.5}
          unit=""
          onChange={setSunOffset}
        />

        <ScaleSlider
          label="FOV cámara"
          value={cameraFov}
          min={18}
          max={75}
          step={0.5}
          suffix="°"
          onChange={setCameraFov}
        />

        <DestroyerSection
          id={0}
          title="Destructor A"
          active={selectedDestroyerId === 0}
          onSelect={() => setSelectedDestroyerId(0)}
        />
        <DestroyerSection
          id={1}
          title="Destructor B"
          active={selectedDestroyerId === 1}
          onSelect={() => setSelectedDestroyerId(1)}
        />
      </div>
    </aside>
  );
}
