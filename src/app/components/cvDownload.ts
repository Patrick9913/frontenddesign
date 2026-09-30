export type CvLanguage = "es" | "en";

const CV_FILES: Record<
  CvLanguage,
  { href: string; filename: string; label: string; shortLabel: string }
> = {
  es: {
    href: "/cv",
    filename: "Patrick-Ordonez-CV.pdf",
    label: "Español",
    shortLabel: "ES",
  },
  en: {
    href: "/cv?lang=en",
    filename: "Patrick-Ordonez-CV-EN.pdf",
    label: "English",
    shortLabel: "EN",
  },
};

export function getCvDownloadMeta(lang: CvLanguage) {
  return CV_FILES[lang];
}

export function triggerCvDownload(lang: CvLanguage) {
  const { href, filename } = CV_FILES[lang];
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
