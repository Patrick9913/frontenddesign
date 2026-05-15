import React from "react";

const SECTION_INDEX = "[ 03 ]";

const COPY = {
  overline: "Tecnologías",
  title: "STACK",
  accent: "TÉCNICO",
  lead:
    "Especializado en el ecosistema React moderno. Combino tecnologías sólidas con diseño meticuloso para construir interfaces fluidas, escalables y visualmente excepcionales. El rendimiento y la atención al detalle guían cada línea de código.",
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
  const iconClass = "w-5 h-5 stroke-current";

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
    <section
      id="skills"
      className="py-32 lg:py-48 bg-black text-[#F0F0F0] font-sans border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <header className="mb-16 md:mb-20 lg:mb-24">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 md:mb-10">
            <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {SECTION_INDEX}
            </span>
            <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {COPY.overline}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase">
            {COPY.title}
            <br />
            <span className="font-medium text-white/50">{COPY.accent}</span>
          </h2>

          <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-8 md:mt-10" aria-hidden />

          <p className="mt-10 md:mt-12 text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide max-w-2xl">
            {COPY.lead}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-x-12 xl:gap-x-16">
          {TECHNOLOGIES_BY_AREA.map((group, index) => (
            <article
              key={group.id}
              className={`group border-t border-white/[0.08] py-10 md:py-12 ${
                index % 2 === 1 ? "lg:border-l lg:border-white/[0.08] lg:pl-12 xl:pl-16" : ""
              } ${index >= 2 ? "lg:mt-0" : ""}`}
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="shrink-0 font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/50">
                    {group.id}
                  </span>
                  <h3 className="text-lg md:text-xl font-light tracking-wide text-[#F0F0F0] uppercase transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white">
                    {group.area}
                  </h3>
                </div>
                <span className="shrink-0 text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white/60">
                  {renderCategoryIcon(group.icon)}
                </span>
              </div>

              <p className="text-sm font-light text-white/50 leading-[1.75] tracking-wide mb-8 max-w-md">
                {group.description}
              </p>

              <ul className="flex flex-wrap gap-x-4 gap-y-3" role="list">
                {group.techs.map((tech) => (
                  <li key={tech}>
                    <span className="inline-block text-[10px] md:text-xs font-mono font-light tracking-[0.15em] uppercase text-white/40 border border-white/[0.08] px-3 py-2 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0] hover:border-white/20">
                      {tech}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
