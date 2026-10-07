import type { CoverLetterLanguage, LetterModelId } from "./types";

export type { LetterModelId } from "./types";

export type LetterModel = {
  id: LetterModelId;
  label: { es: string; en: string };
  description: { es: string; en: string };
  /** IDs `{expIndex}-{bulletIndex}` sugeridos al aplicar el modelo */
  suggestedHighlightIds: string[];
  opening: Record<CoverLetterLanguage, string>;
  motivation: Record<CoverLetterLanguage, string>;
  closing: Record<CoverLetterLanguage, string>;
};

/** Logros alineados a sector público / institucional */
const PUBLIC_SECTOR_HIGHLIGHTS = ["5-0", "5-1", "4-0"];

/** Producto + operación diaria */
const OPS_HIGHLIGHTS = ["1-0", "1-1", "2-0", "3-0"];

/** Perfil general full stack */
const GENERAL_HIGHLIGHTS = ["1-0", "5-0", "0-1", "4-0"];

export const LETTER_MODELS: LetterModel[] = [
  {
    id: "problem-solution",
    label: {
      es: "Problema → solución → prueba",
      en: "Problem → solution → proof",
    },
    description: {
      es: "Gancho específico, encaje con el rol y logros como prueba. Ideal para tech y vacantes claras.",
      en: "Specific hook, role fit, and highlights as proof. Best for tech roles with a clear JD.",
    },
    suggestedHighlightIds: GENERAL_HIGHLIGHTS,
    opening: {
      es: "Me comunico por el puesto de {{role}} en {{company}}. {{hook}} Trabajo como desarrollador Full Stack con React, Next.js y TypeScript en productos que se usan a diario, no solo en demo.",
      en: "I am applying for the {{role}} position at {{company}}. {{hook}} I work as a Full Stack developer with React, Next.js, and TypeScript on products used every day—not demo-only work.",
    },
    motivation: {
      es: "Entiendo que en {{company}} {{context}} Mi enfoque es traducir procesos complejos en interfaces claras y estables, como hice en municipio, gastronomía, industria y estudios profesionales. Algunos ejemplos concretos:",
      en: "I understand that at {{company}} {{context}} My approach is turning complex workflows into clear, reliable interfaces—as I have done across public sector, hospitality, industry, and professional services. A few concrete examples:",
    },
    closing: {
      es: "Gracias por su tiempo. Puede ver casos y demos en {{portfolio}}; quedo disponible para una charla breve esta semana y adaptar la conversación a lo que necesiten.",
      en: "Thank you for your time. You can review case studies and demos at {{portfolio}}; I am available for a short call this week and happy to tailor the conversation to your needs.",
    },
  },
  {
    id: "story",
    label: {
      es: "Historia breve (3 actos)",
      en: "Short story (3 acts)",
    },
    description: {
      es: "Contexto personal, momento clave y por qué este rol ahora. Más humano, menos lista.",
      en: "Personal context, pivotal moment, and why this role now. More human, less list-like.",
    },
    suggestedHighlightIds: ["0-1", "1-1", "5-1"],
    opening: {
      es: "Estudio Ciencia de Datos en la UBA y construyo interfaces con React y Next.js porque me interesa el punto donde el dato, el diseño y el código se encuentran. {{hook}}",
      en: "I study Data Science at UBA and build interfaces with React and Next.js because I care about where data, design, and code meet. {{hook}}",
    },
    motivation: {
      es: "En proyectos recientes pasé de landings a plataformas de operación diaria—comedor escolar, logística gastronómica, gestión municipal—siempre con la misma pregunta: ¿se entiende en el primer uso? Por eso me interesa {{role}} en {{company}}: {{context}}",
      en: "In recent projects I moved from marketing sites to daily operations platforms—school dining, hospitality logistics, municipal management—always asking the same question: is it clear on first use? That is why {{role}} at {{company}} resonates: {{context}}",
    },
    closing: {
      es: "Me gustaría contarles cómo encajaría en el equipo. Portfolio: {{portfolio}}.",
      en: "I would welcome the chance to share how I could fit your team. Portfolio: {{portfolio}}.",
    },
  },
  {
    id: "ats",
    label: {
      es: "Requisitos ↔ evidencia",
      en: "Requirements ↔ evidence",
    },
    description: {
      es: "Apertura directa + cuerpo en viñetas (logros del CV). Ideal para portales y filtros ATS.",
      en: "Direct opening + bullet body (CV highlights). Good for job boards and ATS-heavy flows.",
    },
    suggestedHighlightIds: GENERAL_HIGHLIGHTS,
    opening: {
      es: "Postulo a {{role}} en {{company}}. Soy desarrollador Full Stack (React, Next.js, TypeScript) con experiencia en producción para sector público, educación, gastronomía e industria.",
      en: "I am applying for {{role}} at {{company}}. I am a Full Stack developer (React, Next.js, TypeScript) with production experience across public sector, education, hospitality, and industry.",
    },
    motivation: {
      es: "{{hook}} A continuación, cómo mi experiencia se relaciona con lo que buscan:",
      en: "{{hook}} Below is how my experience maps to what you are looking for:",
    },
    closing: {
      es: "Quedo a disposición para ampliar cualquier punto. Contacto y portfolio: {{portfolio}}.",
      en: "I am happy to expand on any point. Contact and portfolio: {{portfolio}}.",
    },
  },
  {
    id: "consultative",
    label: {
      es: "Consultiva / propuesta",
      en: "Consultative / proposal",
    },
    description: {
      es: "Mini-propuesta para freelance o cliente: qué entendiste y próximo paso (demo/llamada).",
      en: "Mini-proposal for freelance or clients: what you understood and next step (demo/call).",
    },
    suggestedHighlightIds: PUBLIC_SECTOR_HIGHLIGHTS,
    opening: {
      es: "Escribo a {{company}} porque {{context}} {{hook}}",
      en: "I am reaching out to {{company}} because {{context}} {{hook}}",
    },
    motivation: {
      es: "Propongo acompañarlos con desarrollo Full Stack (React, Next.js, TypeScript): sitio institucional o producto interno con foco en claridad operativa y mantenimiento a largo plazo. Referencias recientes incluyen gestión municipal, plataformas de operación y sitios orientados a confianza.",
      en: "I would support you with Full Stack development (React, Next.js, TypeScript): institutional sites or internal products focused on operational clarity and long-term maintainability. Recent work includes municipal management, operations platforms, and trust-oriented sites.",
    },
    closing: {
      es: "Si les sirve, coordinamos una demo de 20 minutos o revisamos juntos el alcance del {{role}}. Portfolio: {{portfolio}}.",
      en: "If helpful, we can schedule a 20-minute demo or review the scope of {{role}} together. Portfolio: {{portfolio}}.",
    },
  },
  {
    id: "referral",
    label: {
      es: "Referido / conexión",
      en: "Referral / connection",
    },
    description: {
      es: "Primera línea con quien te recomendó; luego encaje y cierre.",
      en: "Lead with who referred you; then fit and close.",
    },
    suggestedHighlightIds: GENERAL_HIGHLIGHTS,
    opening: {
      es: "{{referral}} me sugirió contactarlos respecto al puesto de {{role}} en {{company}}. {{hook}}",
      en: "{{referral}} suggested I reach out regarding the {{role}} position at {{company}}. {{hook}}",
    },
    motivation: {
      es: "Desarrollo productos web full stack con React, Next.js y TypeScript. {{context}} Destaco estos trabajos recientes:",
      en: "I build full stack web products with React, Next.js, and TypeScript. {{context}} Recent work I would highlight:",
    },
    closing: {
      es: "Gracias por considerar mi perfil. Quedo atento a coordinar una conversación; más detalle en {{portfolio}}.",
      en: "Thank you for considering my profile. I look forward to connecting; more detail at {{portfolio}}.",
    },
  },
];

export const DEFAULT_LETTER_MODEL_ID: LetterModelId = "problem-solution";

export function getLetterModel(id: LetterModelId): LetterModel {
  const found = LETTER_MODELS.find((m) => m.id === id);
  return found ?? LETTER_MODELS[0];
}

export function getModelParagraphs(
  id: LetterModelId,
  language: CoverLetterLanguage
): { opening: string; motivation: string; closing: string } {
  const model = getLetterModel(id);
  return {
    opening: model.opening[language],
    motivation: model.motivation[language],
    closing: model.closing[language],
  };
}
