export type CoverLetterLanguage = "es" | "en";

export type LetterModelId =
  | "problem-solution"
  | "story"
  | "ats"
  | "consultative"
  | "referral";

export type CoverLetterFormState = {
  language: CoverLetterLanguage;
  modelId: LetterModelId;
  company: string;
  role: string;
  recipientName: string;
  /** Gancho personalizado (1–2 frases) → {{hook}} */
  hook: string;
  /** Contexto del empleador / problema → {{context}} */
  context: string;
  /** Quien refiere → {{referral}} (modelo referral) */
  referralName: string;
  opening: string;
  motivation: string;
  highlightIds: string[];
  closing: string;
};

export type CoverLetterPdfPayload = {
  language: CoverLetterLanguage;
  company: string;
  role: string;
  recipientName: string;
  opening: string;
  motivation: string;
  highlights: string[];
  closing: string;
};
