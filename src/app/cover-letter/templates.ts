import type { CoverLetterLanguage } from "./types";

export function defaultOpening(language: CoverLetterLanguage): string {
  if (language === "en") {
    return "I am writing to express my interest in the {{role}} position at {{company}}. With experience building production web platforms in React, Next.js, and TypeScript, I believe I can contribute meaningfully to your team from day one.";
  }
  return "Me dirijo a ustedes para expresar mi interés en el puesto de {{role}} en {{company}}. Cuento con experiencia desarrollando plataformas web en producción con React, Next.js y TypeScript, y creo poder aportar valor al equipo desde el inicio.";
}

export function defaultMotivation(language: CoverLetterLanguage): string {
  if (language === "en") {
    return "What draws me to this opportunity is the chance to work on products with real operational impact—translating complex workflows into clear, reliable interfaces, the same approach I have applied across education, hospitality, industry, and public-sector projects.";
  }
  return "Lo que me motiva de esta oportunidad es poder trabajar en productos con impacto operativo real: traducir procesos complejos en interfaces claras y confiables, el mismo enfoque que aplico en proyectos de educación, gastronomía, industria y sector público.";
}

export function defaultClosing(language: CoverLetterLanguage): string {
  if (language === "en") {
    return "Thank you for considering my application. I would welcome the opportunity to discuss how my experience aligns with your needs.";
  }
  return "Agradezco su tiempo y consideración. Quedo a disposición para conversar sobre cómo mi experiencia puede alinearse con lo que buscan.";
}

export function applyPlaceholders(
  text: string,
  company: string,
  role: string
): string {
  return text
    .replaceAll("{{company}}", company.trim() || "—")
    .replaceAll("{{role}}", role.trim() || "—");
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
