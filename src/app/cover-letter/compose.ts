import { cv, cvEn } from "../cv/cvData";
import { resolveHighlights } from "./highlights";
import {
  applyPlaceholders,
  formatLetterDate,
  salutation,
  signOff,
  type PlaceholderContext,
} from "./templates";
import type { CoverLetterFormState, CoverLetterLanguage } from "./types";

export function buildPlaceholderContext(
  state: Pick<
    CoverLetterFormState,
    "company" | "role" | "hook" | "context" | "referralName" | "language"
  >
): PlaceholderContext {
  const contact = state.language === "en" ? cvEn : cv;
  const lang = state.language;

  const defaultHook =
    lang === "en"
      ? "What caught my attention is the chance to contribute to a product with real users and measurable impact."
      : "Lo que me llamó la atención es poder aportar en un producto con usuarios reales e impacto medible.";

  const defaultContext =
    lang === "en"
      ? "you need reliable digital tools that teams can adopt without friction."
      : "necesitan herramientas digitales confiables que el equipo pueda adoptar sin fricción.";

  const defaultReferral =
    lang === "en" ? "A colleague" : "Un colega";

  return {
    company: state.company,
    role: state.role,
    hook: state.hook.trim() || defaultHook,
    context: state.context.trim() || defaultContext,
    portfolio: contact.website,
    referral: state.referralName.trim() || defaultReferral,
  };
}

export function composeCoverLetterText(state: CoverLetterFormState): string {
  const ctx = buildPlaceholderContext(state);
  const highlights = resolveHighlights(state.language, state.highlightIds);

  const blocks = [
    formatLetterDate(state.language),
    "",
    state.company.trim() || state.role.trim()
      ? `${state.language === "en" ? "Re:" : "Ref.:"} ${[state.role, state.company].filter(Boolean).join(" — ")}`
      : "",
    salutation(state.language, state.recipientName),
    applyPlaceholders(state.opening, ctx),
    applyPlaceholders(state.motivation, ctx),
    ...highlights.map((b) => `• ${b}`),
    applyPlaceholders(state.closing, ctx),
    "",
    signOff(state.language),
    "Patrick Ordoñez",
  ].filter((line, index, arr) => line !== "" || (index > 0 && arr[index - 1] !== ""));

  return blocks.join("\n");
}

export function resolvePdfParagraphs(state: CoverLetterFormState): {
  opening: string;
  motivation: string;
  closing: string;
  highlights: string[];
} {
  const ctx = buildPlaceholderContext(state);
  return {
    opening: applyPlaceholders(state.opening, ctx),
    motivation: applyPlaceholders(state.motivation, ctx),
    closing: applyPlaceholders(state.closing, ctx),
    highlights: resolveHighlights(state.language, state.highlightIds),
  };
}

export function hookPlaceholderHint(language: CoverLetterLanguage): string {
  return language === "en"
    ? "e.g. Your focus on internal platforms matches how I work with municipal and ops teams."
    : "ej. Su apuesta por plataformas internas encaja con cómo trabajo con municipios y equipos operativos.";
}

export function contextPlaceholderHint(language: CoverLetterLanguage): string {
  return language === "en"
    ? "e.g. you are scaling digital services for citizens and staff."
    : "ej. están digitalizando servicios para vecinos y equipos internos.";
}
