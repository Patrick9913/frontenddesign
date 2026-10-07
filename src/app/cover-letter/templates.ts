import type { CoverLetterLanguage } from "./types";
import {
  DEFAULT_LETTER_MODEL_ID,
  getModelParagraphs,
} from "./letterModels";

export type PlaceholderContext = {
  company: string;
  role: string;
  hook: string;
  context: string;
  portfolio: string;
  referral: string;
};

export function defaultOpening(language: CoverLetterLanguage): string {
  return getModelParagraphs(DEFAULT_LETTER_MODEL_ID, language).opening;
}

export function defaultMotivation(language: CoverLetterLanguage): string {
  return getModelParagraphs(DEFAULT_LETTER_MODEL_ID, language).motivation;
}

export function defaultClosing(language: CoverLetterLanguage): string {
  return getModelParagraphs(DEFAULT_LETTER_MODEL_ID, language).closing;
}

export function applyPlaceholders(text: string, ctx: PlaceholderContext): string {
  return text
    .replaceAll("{{company}}", ctx.company.trim() || "—")
    .replaceAll("{{role}}", ctx.role.trim() || "—")
    .replaceAll("{{hook}}", ctx.hook)
    .replaceAll("{{context}}", ctx.context)
    .replaceAll("{{portfolio}}", ctx.portfolio)
    .replaceAll("{{referral}}", ctx.referral);
}

export function formatLetterDate(language: CoverLetterLanguage, date = new Date()): string {
  const locale = language === "en" ? "en-US" : "es-AR";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function salutation(
  language: CoverLetterLanguage,
  recipientName: string
): string {
  const name = recipientName.trim();
  if (language === "en") {
    return name ? `Dear ${name},` : "Dear Hiring Manager,";
  }
  return name ? `Estimado/a ${name},` : "Estimado/a equipo de selección,";
}

export function signOff(language: CoverLetterLanguage): string {
  return language === "en" ? "Sincerely," : "Atentamente,";
}
