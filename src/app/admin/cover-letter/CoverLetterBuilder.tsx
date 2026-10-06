"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { highlightsEn, highlightsEs } from "../../cover-letter/highlights";
import {
  applyPlaceholders,
  defaultClosing,
  defaultMotivation,
  defaultOpening,
  formatLetterDate,
  salutation,
  signOff,
} from "../../cover-letter/templates";
import type { CoverLetterFormState, CoverLetterLanguage } from "../../cover-letter/types";

const STORAGE_KEY = "portfolio-cover-letter-draft-v1";

function createDefaultState(language: CoverLetterLanguage): CoverLetterFormState {
  return {
    language,
    company: "",
    role: "",
    recipientName: "",
    opening: defaultOpening(language),
    motivation: defaultMotivation(language),
    highlightIds: [],
    closing: defaultClosing(language),
  };
}

function loadDraft(): CoverLetterFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CoverLetterFormState;
    if (parsed.language !== "es" && parsed.language !== "en") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CoverLetterBuilder() {
  const [state, setState] = useState<CoverLetterFormState>(() => createDefaultState("es"));
  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const preview = useMemo(() => {
    const company = state.company;
    const role = state.role;
    const selected = highlights
      .filter((item) => state.highlightIds.includes(item.id))
      .map((item) => item.bullet);

    const blocks = [
      formatLetterDate(state.language),
      "",
      company || role
        ? `${state.language === "en" ? "Re:" : "Ref.:"} ${[role, company].filter(Boolean).join(" — ")}`
        : "",
      salutation(state.language, state.recipientName),
      applyPlaceholders(state.opening, company, role),
      applyPlaceholders(state.motivation, company, role),
      ...selected.map((b) => `• ${b}`),
      applyPlaceholders(state.closing, company, role),
      "",
      signOff(state.language),
      "Patrick Ordoñez",
    ].filter((line, index, arr) => line !== "" || (index > 0 && arr[index - 1] !== ""));

    return blocks.join("\n");
  }, [highlights, state]);

  const setLanguage = useCallback((language: CoverLetterLanguage) => {
    setState((prev) => {
      if (prev.language === language) return prev;
      return {
        ...createDefaultState(language),
        company: prev.company,
        role: prev.role,
        recipientName: prev.recipientName,
        highlightIds: [],
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
        throw new Error(res.status === 401 ? "Sesión expirada. Volvé a abrir el enlace con tu clave." : "No se pudo generar el PDF.");
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

  const resetTemplates = useCallback(() => {
    setState((prev) => ({
      ...prev,
      opening: defaultOpening(prev.language),
      motivation: defaultMotivation(prev.language),
      closing: defaultClosing(prev.language),
    }));
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(createDefaultState(state.language));
  }, [state.language]);

  const fieldClass =
    "w-full border border-white/10 bg-transparent px-4 py-3 text-sm font-light text-white/85 outline-none transition-colors placeholder:text-white/25 focus:border-white/35";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-[10px] font-light uppercase tracking-[0.35em] text-white/40">Studio privado</p>
        <h1 className="mt-3 text-3xl font-extralight tracking-wide md:text-4xl">Carta de presentación</h1>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/55">
          Adaptá empresa, rol y párrafos; elegí logros desde tu CV. El borrador se guarda en este navegador. Usá{" "}
          <code className="font-mono text-[11px] text-white/70">{`{{company}}`}</code> y{" "}
          <code className="font-mono text-[11px] text-white/70">{`{{role}}`}</code> en los textos.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {(["es", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-5 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                state.language === lang
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-white/60 hover:border-white/40"
              }`}
            >
              {lang === "es" ? "Español" : "English"}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">Destino</h2>
              <input
                className={fieldClass}
                placeholder={state.language === "en" ? "Company name" : "Empresa"}
                value={state.company}
                onChange={(e) => setState((p) => ({ ...p, company: e.target.value }))}
              />
              <input
                className={fieldClass}
                placeholder={state.language === "en" ? "Role / position" : "Puesto"}
                value={state.role}
                onChange={(e) => setState((p) => ({ ...p, role: e.target.value }))}
              />
              <input
                className={fieldClass}
                placeholder={state.language === "en" ? "Recipient (optional)" : "Destinatario/a (opcional)"}
                value={state.recipientName}
                onChange={(e) => setState((p) => ({ ...p, recipientName: e.target.value }))}
              />
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">Texto</h2>
                <button
                  type="button"
                  onClick={resetTemplates}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70"
                >
                  Restaurar plantillas
                </button>
              </div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {state.language === "en" ? "Opening" : "Apertura"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[120px] resize-y`}
                  value={state.opening}
                  onChange={(e) => setState((p) => ({ ...p, opening: e.target.value }))}
                />
              </label>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {state.language === "en" ? "Motivation" : "Motivación"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[120px] resize-y`}
                  value={state.motivation}
                  onChange={(e) => setState((p) => ({ ...p, motivation: e.target.value }))}
                />
              </label>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                {state.language === "en" ? "Closing" : "Cierre"}
                <textarea
                  className={`${fieldClass} mt-2 min-h-[90px] resize-y`}
                  value={state.closing}
                  onChange={(e) => setState((p) => ({ ...p, closing: e.target.value }))}
                />
              </label>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                {state.language === "en" ? "Highlights (from CV)" : "Logros (desde el CV)"}
              </h2>
              <p className="text-xs font-light text-white/45">Hasta 8 ítems.</p>
              <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {highlights.map((item) => {
                  const checked = state.highlightIds.includes(item.id);
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex cursor-pointer gap-3 border px-4 py-3 transition-colors ${
                          checked ? "border-white/35 bg-white/[0.04]" : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleHighlight(item.id)}
                          className="mt-1 accent-white"
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

            <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownload}
                className="flex-1 border border-white/20 bg-white px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-black transition-opacity hover:bg-white/90 disabled:opacity-50"
              >
                {downloading ? "Generando…" : "Descargar PDF"}
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-white/50 hover:border-white/30 hover:text-white/80"
              >
                Limpiar borrador
              </button>
            </div>
            {error ? <p className="text-sm font-light text-red-400/90">{error}</p> : null}
          </div>

          <section className="border-t border-white/10 pt-8 lg:sticky lg:top-8 lg:self-start lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/45">Vista previa</h2>
            <pre className="mt-6 whitespace-pre-wrap font-sans text-sm font-light leading-relaxed text-white/65">
              {preview}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
