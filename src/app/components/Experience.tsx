import React from "react";

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
    <section
      id="experience"
      className="py-32 lg:py-48 bg-black text-[#F0F0F0] font-sans border-t border-white/[0.08] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/newbackimage.jpg')" }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        <header className="mb-20 md:mb-28 lg:mb-32">
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

          <div
            className="w-8 md:w-12 h-px bg-white/[0.08] mt-8 md:mt-10"
            aria-hidden
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-12">
          {FORMATION.map((item, index) => (
            <article
              key={item.id}
              className={`group border-t border-white/[0.08] pt-10 md:pt-12 ${
                index > 0 ? "md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8">
                <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white/80">
                  {item.id}
                </span>
                <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-white/25">
                  {item.period}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-light tracking-wide text-[#F0F0F0] mb-3 leading-snug transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white">
                {item.title}
                <span
                  className="inline-block ml-2 opacity-0 -translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 text-white/50"
                  aria-hidden
                >
                  →
                </span>
              </h3>

              <p className="text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 mb-6 md:mb-8">
                {item.institution}
              </p>

              <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white/70">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
