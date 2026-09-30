export type DemoProject = {
  title: string;
  description?: string;
};

export const CONTACT_DEMO_STORAGE_KEY = "portfolio-contact-demo";
export const CONTACT_DEMO_EVENT = "portfolio-contact-demo";

export function buildDemoMessage(project: DemoProject): string {
  const lines = [
    `Hola Patrick, me gustaría solicitar una demo del proyecto «${project.title}».`,
  ];

  if (project.description) {
    lines.push("");
    lines.push(`Contexto: ${project.description}`);
  }

  lines.push("");
  lines.push("¿Podemos coordinar una fecha para verla?");

  return lines.join("\n");
}

export function getDemoContactHref(project: DemoProject): string {
  const params = new URLSearchParams({ demo: project.title });
  return `/?${params.toString()}#contact`;
}

export function readDemoTitleFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("demo");
}

export function requestProjectDemo(project: DemoProject) {
  const message = buildDemoMessage(project);
  const payload = { message, project: project.title };

  sessionStorage.setItem(CONTACT_DEMO_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(CONTACT_DEMO_EVENT, { detail: payload }));
  window.history.replaceState(null, "", getDemoContactHref(project));

  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function focusContactMessageField() {
  window.setTimeout(() => {
    document.getElementById("contact-message")?.focus();
  }, 450);
}
