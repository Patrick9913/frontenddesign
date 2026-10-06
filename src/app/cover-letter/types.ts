export type CoverLetterLanguage = "es" | "en";

export type CoverLetterFormState = {
  language: CoverLetterLanguage;
  company: string;
  role: string;
  recipientName: string;
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
