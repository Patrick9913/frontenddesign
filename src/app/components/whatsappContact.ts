export const WHATSAPP_PHONE = "541140468176";

export type SiteSection = "home" | "about" | "tools" | "works" | "contact";

export type WhatsAppIntent = "quick" | "project" | "demo";

const SECTION_REF: Record<SiteSection, string> = {
  home: "tu portfolio",
  about: "tu perfil y experiencia",
  tools: "tu stack y herramientas",
  works: "tus proyectos",
  contact: "la sección de contacto",
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppMessage(
  section: SiteSection,
  intent: WhatsAppIntent
): string {
  const ref = SECTION_REF[section];

  if (intent === "quick") {
    return `Hola Patrick, vi ${ref} y quiero hacer una consulta rápida. ¿Tenés un momento para charlar?`;
  }

  if (intent === "project") {
    return `Hola Patrick, vi ${ref} y tengo un proyecto en mente. Me gustaría contarte la idea y saber si podemos trabajar juntos.`;
  }

  if (section === "works") {
    return "Hola Patrick, estuve viendo tus proyectos en el portfolio y me gustaría solicitar una demo. ¿Podemos coordinar?";
  }

  return "Hola Patrick, me interesa conocer más de tu trabajo en acción. ¿Podemos coordinar una demo o una llamada breve?";
}

export function recommendedIntent(section: SiteSection): WhatsAppIntent {
  if (section === "works") return "demo";
  if (section === "contact" || section === "home") return "quick";
  return "project";
}

export const WHATSAPP_ACTIONS: {
  id: WhatsAppIntent;
  label: string;
  description: string;
}[] = [
  {
    id: "quick",
    label: "Consulta rápida",
    description: "Una duda puntual, respuesta ágil",
  },
  {
    id: "project",
    label: "Tengo un proyecto",
    description: "Idea, alcance o presupuesto",
  },
  {
    id: "demo",
    label: "Solicitar demo",
    description: "Ver casos reales del portfolio",
  },
];

export const SITE_SECTIONS: SiteSection[] = [
  "home",
  "about",
  "tools",
  "works",
  "contact",
];
