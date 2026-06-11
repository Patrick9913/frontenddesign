import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { ExperienceSectionDecor } from "./expanded/SectionDecors";

const SECTION_INDEX = "[ 02 ]";

const COPY = {
  overline: "Formación",
  title: "TRAYECTORIA",
  accent: "ACADÉMICA",
} as const;

const FORMATION = [
  {
    id: "01",
    title: "Ciencia de Datos",
    institution: "Universidad de Buenos Aires (UBA)",
    period: "Actualidad",
    description:
      "Formación académica enfocada en el pensamiento lógico, análisis estructural y desarrollo algorítmico profundo. Una base sólida para la resolución de problemas complejos.",
  },
  {
    id: "02",
    title: "Desarrollo de Software",
    institution: "Coderhouse",
    period: "Completado",
    description:
      "Cursos intensivos enfocados en desarrollo web y programación. Práctica directa sobre el ecosistema moderno y la construcción de proyectos funcionales.",
  },
  {
    id: "03",
    title: "Formación Autodidacta",
    institution: "Desarrollo Visual y Técnico",
    period: "Múltiples años",
    description:
      "Años de exploración independiente y aprendizaje continuo en tecnologías, experiencia de usuario y diseño de interfaces. Construyendo mi propio criterio a través de la práctica.",
  },
] as const;

export const Experience = () => {
  return (
    <ExpandedSection
      id="experience"
      decor={<ExperienceSectionDecor />}
      index={SECTION_INDEX}
      overline={COPY.overline}
      title={COPY.title}
      accent={COPY.accent}
    >
      <ExpandedContentPanel>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-8 lg:gap-12">
          {FORMATION.map((item, index) => (
            <article
              key={item.id}
              className={`group border-t border-white/[0.08] pt-10 md:pt-12 ${
                index > 0 ? "md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12" : ""
              }`}
            >
              <div className="mb-6 flex items-baseline justify-between gap-4 md:mb-8">
                <span className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50 transition-colors duration-500 group-hover:text-white/80 md:text-xs">
                  {item.id}
                </span>
                <span className="font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/25 md:text-xs">
                  {item.period}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-light leading-snug tracking-wide text-[#F0F0F0] transition-colors duration-500 group-hover:text-white md:text-2xl">
                {item.title}
                <span
                  className="ml-2 inline-block -translate-x-1 text-white/50 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                >
                  →
                </span>
              </h3>

              <p className="mb-6 text-[10px] font-light uppercase tracking-[0.2em] text-white/50 md:mb-8 md:text-xs">
                {item.institution}
              </p>

              <p className="text-sm font-light leading-[1.75] tracking-wide text-white/50 transition-colors duration-500 group-hover:text-white/70 md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </ExpandedContentPanel>
    </ExpandedSection>
  );
};

export default Experience;
