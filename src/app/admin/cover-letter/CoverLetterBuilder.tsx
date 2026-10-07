"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  composeCoverLetterText,
  contextPlaceholderHint,
  hookPlaceholderHint,
} from "../../cover-letter/compose";
import { highlightsEn, highlightsEs } from "../../cover-letter/highlights";
import {
  DEFAULT_LETTER_MODEL_ID,
  getModelParagraphs,
  LETTER_MODELS,
  type LetterModelId,
} from "../../cover-letter/letterModels";
import type { CoverLetterFormState, CoverLetterLanguage } from "../../cover-letter/types";

const STORAGE_KEY = "portfolio-cover-letter-draft-v2";

const HIGHLIGHT_PRESETS: {
  id: string;
  label: { es: string; en: string };
  ids: string[];
}[] = [
  {
    id: "general",
    label: { es: "General", en: "General" },
    ids: ["1-0", "5-0", "0-1", "4-0"],
  },
  {
    id: "public",
    label: { es: "Sector público", en: "Public sector" },
    ids: ["5-0", "5-1", "4-0"],
  },
  {
    id: "ops",
    label: { es: "Operación diaria", en: "Daily ops" },
    ids: ["1-0", "1-1", "2-0", "3-0"],
  },
];

function createDefaultStateWithModel(language: CoverLetterLanguage): CoverLetterFormState {
  const modelId = DEFAULT_LETTER_MODEL_ID;
  const model = LETTER_MODELS.find((m) => m.id === modelId)!;
  const paragraphs = getModelParagraphs(modelId, language);
  return {
    language,
    modelId,
    company: "",
    role: "",
    recipientName: "",
    hook: "",
    context: "",
    referralName: "",
    opening: paragraphs.opening,
    motivation: paragraphs.motivation,
    highlightIds: [...model.suggestedHighlightIds],
    closing: paragraphs.closing,
  };
}

function loadDraft(): CoverLetterFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    const raw = rawV2 ?? localStorage.getItem("portfolio-cover-letter-draft-v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CoverLetterFormState>;
    if (parsed.language !== "es" && parsed.language !== "en") return null;

    const base = createDefaultStateWithModel(parsed.language);
    return {
      ...base,
      ...parsed,
      modelId: parsed.modelId ?? DEFAULT_LETTER_MODEL_ID,
      hook: parsed.hook ?? "",
      context: parsed.context ?? "",
      referralName: parsed.referralName ?? "",
      highlightIds: Array.isArray(parsed.highlightIds) ? parsed.highlightIds : [],
    };
  } catch {
    return null;
  }
}

type MobilePanel = "edit" | "preview";

export function CoverLetterBuilder() {
  const [state, setState] = useState<CoverLetterFormState>(() =>
    createDefaultStateWithModel("es")
  );
  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "ok" | "fail">("idle");
  const [error, setError] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("edit");

  useEffect(() => {
    const saved = loadDraft();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const highlights = state.language === "en" ? highlightsEn : highlightsEs;
  const lang = state.language;

  const preview = useMemo(() => composeCoverLetterText(state), [state]);

  const wordCount = useMemo(() => {
    const words = preview.split(/\s+/).filter(Boolean);
    return words.length;
  }, [preview]);

  const applyModel = useCallback(
    (modelId: LetterModelId, options?: { keepHighlights?: boolean }) => {
      const model = LETTER_MODELS.find((m) => m.id === modelId)!;
      const paragraphs = getModelParagraphs(modelId, state.language);
      setState((prev) => ({
        ...prev,
        modelId,
        opening: paragraphs.opening,
        motivation: paragraphs.motivation,
        closing: paragraphs.closing,
        highlightIds: options?.keepHighlights
          ? prev.highlightIds
          : [...model.suggestedHighlightIds],
      }));
    },
    [state.language]
  );

  const setLanguage = useCallback((language: CoverLetterLanguage) => {
    setState((prev) => {
      if (prev.language === language) return prev;
      const paragraphs = getModelParagraphs(prev.modelId, language);
      const model = LETTER_MODELS.find((m) => m.id === prev.modelId)!;
      return {
        ...prev,
        language,
        opening: paragraphs.opening,
        motivation: paragraphs.motivation,
        closing: paragraphs.closing,
        highlightIds: model.suggestedHighlightIds,
      };
    });
  }, []);

  const toggleHighlight = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.highlightIds.includes(id);
      const next = has
        ? prev.highlightIds.filter((item) => item !== id)
        : [...prev.highlightIds, id].slice(0, 8);
      return { ...prev, highlightIds: next };
    });
  }, []);

  const applyHighlightPreset = useCallback((ids: string[]) => {
    setState((prev) => ({ ...prev, highlightIds: ids.slice(0, 8) }));
  }, []);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/admin/cover-letter/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Sesión expirada. Volvé a abrir el enlace con tu clave."
            : "No se pudo generar el PDF."
        );
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "Patrick-Ordonez-Cover-Letter.pdf";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setDownloading(false);
    }
  }, [state]);

  const handleCopy = useCallback(async () => {
    setCopyStatus("idle");
    try {
      await navigator.clipboard.writeText(preview);
      setCopyStatus("ok");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      setCopyStatus("fail");
    }
  }, [preview]);

  const resetTemplates = useCallback(() => {
    applyModel(state.modelId);
  }, [applyModel, state.modelId]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("portfolio-cover-letter-draft-v1");
    setState(createDefaultStateWithModel(state.language));
  }, [state.language]);

  const fieldClass =
    "w-full border border-white/10 bg-transparent px-4 py-3.5 text-base font-light text-white/85 outline-none transition-colors placeholder:text-white/25 focus:border-white/35 md:py-3 md:text-sm";

  const placeholderHelp = (
    <p className="text-xs font-light leading-relaxed text-white/45">
      Placeholders:{" "}
      <code className="font-mono text-[10px] text-[#6eb0d4]/90">{`{{company}}`}</code>,{" "}
      <code className="font-mono text-[10px] text-[#6eb0d4]/90">{`{{role}}`}</code>,{" "}
      <code className="font-mono text-[10px] text-[#c4a574]/90">{`{{hook}}`}</code>,{" "}
      <code className="font-mono text-[10px] text-[#a992d4]/90">{`{{context}}`}</code>,{" "}
      <code className="font-mono text-[10px] text-[#7ec4a0]/90">{`{{portfolio}}`}</code>,{" "}
      <code className="font-mono text-[10px] text-white/60">{`{{referral}}`}</code>
    </p>
  );

  const previewBlock = (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">
          {lang === "en" ? "Preview" : "Vista previa"}
        </h2>
        <span className="font-mono text-[10px] text-white/35">
          ~{wordCount} {lang === "en" ? "words" : "palabras"}
          {wordCount > 450 ? (lang === "en" ? " · long" : " · larga") : ""}
        </span>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-[15px] font-light leading-relaxed text-white/65 md:mt-6 md:text-sm">
        {preview}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-6 w-full border border-white/15 py-3 text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:border-white/35 hover:text-white/90 md:w-auto md:px-8"
      >
        {copyStatus === "ok"
          ? lang === "en"
            ? "Copied"
            : "Copiado"
          : copyStatus === "fail"
            ? lang === "en"
              ? "Copy failed"
              : "No se pudo copiar"
            : lang === "en"
              ? "Copy for email"
              : "Copiar para mail"}
      </button>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6 md:py-20 md:pb-20 lg:pb-20">
        <p className="text-[10px] font-light uppercase tracking-[0.35em] text-white/40">
          Studio privado
        </p>
        <h1 className="mt-3 text-3xl font-extralight tracking-wide md:text-4xl">
          Carta de presentación
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/55">
          Elegí un modelo, completá empresa y rol, ajustá el gancho en una frase y descargá PDF o
          copiá el texto para el cuerpo del mail. El borrador se guarda en este navegador.
        </p>
        {placeholderHelp}

        <div className="mt-10 flex flex-wrap gap-3">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`border px-5 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                state.language === l
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-white/60 hover:border-white/40"
              }`}
            >
              {l === "es" ? "Español" : "English"}
            </button>
          ))}
        </div>

        <div
          className="mt-8 flex gap-2 border border-white/10 p-1 lg:hidden"
          role="tablist"
          aria-label={lang === "en" ? "Sections" : "Secciones"}
        >
          {(
            [
              ["edit", lang === "en" ? "Edit" : "Editar"],
              ["preview", lang === "en" ? "Preview" : "Vista previa"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mobilePanel === id}
              onClick={() => setMobilePanel(id)}
              className={`min-h-11 flex-1 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                mobilePanel === id
                  ? "bg-white text-black"
                  : "text-white/55 active:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
          <div className={`space-y-8 ${mobilePanel === "preview" ? "hidden lg:block" : ""}`}>
            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#6eb0d4]/75">
                {lang === "en" ? "Letter model" : "Modelo de carta"}
              </h2>
              <ul className="space-y-2" role="list">
                {LETTER_MODELS.map((model) => {
                  const active = state.modelId === model.id;
                  return (
                    <li key={model.id}>
                      <button
                        type="button"
                        onClick={() => applyModel(model.id)}
                        className={`w-full border px-4 py-3.5 text-left transition-colors ${
                          active
                            ? "border-[#a992d4]/45 bg-white/[0.04]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <span className="block text-[11px] font-light uppercase tracking-[0.16em] text-white/85">
                          {model.label[lang]}
                        </span>
                        <span className="mt-1 block text-xs font-light leading-relaxed text-white/45">
                          {model.description[lang]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                {lang === "en" ? "Target" : "Destino"}
              </h2>
              <input
                className={fieldClass}
                placeholder={lang === "en" ? "Company name" : "Empresa"}
                value={state.company}
                autoComplete="organization"
                onChange={(e) => setState((p) => ({ ...p, company: e.target.value }))}
              />
              <input
                className={fieldClass}
                placeholder={lang === "en" ? "Role / position" : "Puesto"}
                value={state.role}
                autoComplete="organization-title"
                onChange={(e) => setState((p) => ({ ...p, role: e.target.value }))}
              />
              <input
                className={fieldClass}
                placeholder={
                  lang === "en"
                    ? "Recipient (optional, salutation)"
                    : "Destinatario/a (opcional, saludo)"
                }
                value={state.recipientName}
                autoComplete="name"
                onChange={(e) => setState((p) => ({ ...p, recipientName: e.target.value }))}
              />
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#c4a574]/80">
                {lang === "en" ? "Quick personalize" : "Personalización rápida"}
              </h2>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {lang === "en" ? "Hook → {{hook}}" : "Gancho → {{hook}}"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[72px] resize-y`}
                  placeholder={hookPlaceholderHint(lang)}
                  value={state.hook}
                  onChange={(e) => setState((p) => ({ ...p, hook: e.target.value }))}
                />
              </label>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {lang === "en" ? "Their context → {{context}}" : "Contexto de ellos → {{context}}"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[72px] resize-y`}
                  placeholder={contextPlaceholderHint(lang)}
                  value={state.context}
                  onChange={(e) => setState((p) => ({ ...p, context: e.target.value }))}
                />
              </label>
              {state.modelId === "referral" ? (
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {lang === "en" ? "Referral name → {{referral}}" : "Referido → {{referral}}"}
                  <input
                    className={`${fieldClass} mt-2`}
                    placeholder={lang === "en" ? "e.g. María López" : "ej. María López"}
                    value={state.referralName}
                    onChange={(e) => setState((p) => ({ ...p, referralName: e.target.value }))}
                  />
                </label>
              ) : null}
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                  {lang === "en" ? "Body (editable)" : "Cuerpo (editable)"}
                </h2>
                <button
                  type="button"
                  onClick={resetTemplates}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70"
                >
                  {lang === "en" ? "Reset model text" : "Restaurar modelo"}
                </button>
              </div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {lang === "en" ? "Opening" : "Apertura"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[120px] resize-y`}
                  value={state.opening}
                  onChange={(e) => setState((p) => ({ ...p, opening: e.target.value }))}
                />
              </label>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {lang === "en" ? "Middle / bridge" : "Puente / motivación"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[120px] resize-y`}
                  value={state.motivation}
                  onChange={(e) => setState((p) => ({ ...p, motivation: e.target.value }))}
                />
              </label>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {lang === "en" ? "Closing + CTA" : "Cierre + CTA"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[90px] resize-y`}
                  value={state.closing}
                  onChange={(e) => setState((p) => ({ ...p, closing: e.target.value }))}
                />
              </label>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                {lang === "en" ? "Proof (CV bullets)" : "Prueba (viñetas del CV)"}
              </h2>
              <p className="text-xs font-light text-white/45">
                {lang === "en" ? "Up to 8 items." : "Hasta 8 ítems."}
              </p>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyHighlightPreset(preset.ids)}
                    className="border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:border-white/25 hover:text-white/75"
                  >
                    {preset.label[lang]}
                  </button>
                ))}
              </div>
              <ul className="max-h-[min(420px,50dvh)] space-y-2 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch] lg:max-h-[320px]">
                {highlights.map((item) => {
                  const checked = state.highlightIds.includes(item.id);
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex min-h-12 cursor-pointer gap-3 border px-4 py-3.5 transition-colors active:bg-white/[0.03] ${
                          checked
                            ? "border-white/35 bg-white/[0.04]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleHighlight(item.id)}
                          className="mt-1 size-[1.125rem] shrink-0 accent-white"
                        />
                        <span className="text-sm font-light leading-relaxed text-white/70">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                            {item.org}
                          </span>
                          <span className="mt-1 block">{item.bullet}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="hidden flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row lg:flex">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownload}
                className="min-h-11 flex-1 border border-white/20 bg-white px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-black transition-opacity hover:bg-white/90 disabled:opacity-50"
              >
                {downloading ? "Generando…" : "Descargar PDF"}
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="min-h-11 border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-white/50 hover:border-white/30 hover:text-white/80"
              >
                Limpiar borrador
              </button>
            </div>
            {error ? (
              <p className="hidden text-sm font-light text-red-400/90 lg:block">{error}</p>
            ) : null}
          </div>

          <section
            role="tabpanel"
            className={`border-t border-white/10 pt-6 lg:sticky lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:self-start lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 ${
              mobilePanel === "edit" ? "hidden lg:block" : ""
            }`}
          >
            {previewBlock}
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#050505]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        {error ? (
          <p className="mb-2 text-center text-xs font-light text-red-400/90">{error}</p>
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="min-h-12 flex-[2] border border-white/20 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-black disabled:opacity-50"
          >
            {downloading ? "Generando…" : "Descargar PDF"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-12 flex-1 border border-white/15 px-3 py-3 text-[10px] uppercase tracking-[0.18em] text-white/55"
          >
            {copyStatus === "ok" ? "OK" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
