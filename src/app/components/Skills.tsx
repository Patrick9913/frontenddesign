import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { SkillsConstellationField } from "./skills/SkillsConstellationField";

const SECTION_INDEX = "[ 03 ]";

const COPY = {
  overline: "Tecnologías",
  title: "STACK",
  accent: "TÉCNICO",
  lead:
    "Especializado en el ecosistema React moderno. Combino tecnologías sólidas con diseño meticuloso para construir interfaces fluidas, escalables y visualmente excepcionales.",
} as const;

const TECHNOLOGIES_BY_AREA = [
  {
    id: "01",
    area: "Frontend",
    icon: "frontend",
    description: "Interfaces modernas, accesibles y responsivas.",
    techs: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"],
  },
  {
    id: "02",
    area: "Backend y Datos",
    icon: "backend",
    description: "APIs, lógica de negocio e integración de servicios.",
    techs: ["Node.js", "Firebase", "MongoDB"],
  },
  {
    id: "03",
    area: "Testing y Calidad",
    icon: "testing",
    description: "Código mantenible con foco en estándares y buenas prácticas.",
    techs: ["Jest", "ESLint", "Prettier", "Storybook"],
  },
  {
    id: "04",
    area: "Flujo de Trabajo",
    icon: "workflow",
    description: "Versionado, despliegue y colaboración continua.",
    techs: ["Git/GitHub", "GitHub Actions", "Docker", "Vercel", "Netlify"],
  },
] as const;

const renderCategoryIcon = (icon: string) => {
  const iconClass = "h-5 w-5 stroke-current";

  if (icon === "frontend") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="13" rx="0" />
        <path d="M8 20h8M12 17v3" />
      </svg>
    );
  }

  if (icon === "backend") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  if (icon === "testing") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth="1.5">
        <path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth="1.5">
      <path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7" />
    </svg>
  );
};

export const Skills = () => {
  return (
    <ExpandedSection
      id="skills"
      index={SECTION_INDEX}
      overline={COPY.overline}
      title={COPY.title}
      accent={COPY.accent}
      lead={COPY.lead}
    >
      <div className="relative mb-12 h-[min(46vh,400px)] overflow-hidden border border-white/[0.08] bg-black/40 md:mb-16">
        <SkillsConstellationField variant="expanded" className="absolute inset-0" />
      </div>

      <ExpandedContentPanel>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {TECHNOLOGIES_BY_AREA.map((group, index) => (
            <article
              key={group.id}
              className={`group border-t border-white/[0.08] py-10 md:py-12 ${
                index % 2 === 1 ? "lg:border-l lg:border-white/[0.08] lg:pl-12 xl:pl-16" : ""
              }`}
            >
              <div className="mb-6 flex items-start justify-between gap-6">
                <div className="flex min-w-0 items-baseline gap-4">
                  <span className="shrink-0 font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50">
                    {group.id}
                  </span>
                  <h3 className="text-lg font-light uppercase tracking-wide text-[#F0F0F0] transition-colors duration-500 group-hover:text-white md:text-xl">
                    {group.area}
                  </h3>
                </div>
                <span className="shrink-0 text-white/40 transition-colors duration-500 group-hover:text-white/60">
                  {renderCategoryIcon(group.icon)}
                </span>
              </div>

              <p className="mb-8 max-w-md text-sm font-light leading-[1.75] tracking-wide text-white/50">
                {group.description}
              </p>

              <ul className="flex flex-wrap gap-x-4 gap-y-3" role="list">
                {group.techs.map((tech) => (
                  <li key={tech}>
                    <span className="expanded-tech-tag">{tech}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ExpandedContentPanel>
    </ExpandedSection>
  );
};

export default Skills;
