"use client";

import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";

const COPY = {
  title: "CÓDIGO QUE",
  accent: "RESPIRA DISEÑO",
  body:
    "Estudio Ciencia de Datos en la UBA y diseño interfaces. Me interesa el punto donde el código y el diseño se encuentran: que se vea bien y se sienta claro al usarlo.",
} as const;

const FORMATION = [
  { title: "Ciencia de Datos", meta: "UBA · Actualidad" },
  { title: "Desarrollo de Software", meta: "Coderhouse · Completado" },
  { title: "Autodidacta", meta: "Visual y técnico · Continuo" },
] as const;

const STACK = ["React", "Next.js", "TypeScript", "Tailwind CSS"] as const;

export const About = () => {
  return (
    <ExpandedSection
      id="about"
      title={COPY.title}
      accent={COPY.accent}
    >
      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <ExpandedContentPanel className="lg:col-span-5">
          <p className="text-sm font-light leading-[1.75] tracking-wide text-white/75 md:text-base">
            {COPY.body}
          </p>

          <ul className="mt-10 space-y-5 border-t border-white/[0.08] pt-8" role="list">
            {FORMATION.map((item) => (
              <li key={item.title} className="flex flex-col gap-1">
                <span className="text-sm font-light tracking-wide text-[#F0F0F0] md:text-base">
                  {item.title}
                </span>
                <span className="font-mono text-[10px] font-light uppercase tracking-[0.18em] text-white/55 md:text-xs">
                  {item.meta}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-3" role="list">
            {STACK.map((tech) => (
              <li key={tech}>
                <span className="expanded-tech-tag">{tech}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.08] pt-8">
            <a
              href="/cv"
              download="Patrick-Ordonez-CV.pdf"
              className="group inline-flex w-fit items-center gap-4 border border-white/20 bg-transparent px-8 py-4 text-[10px] font-light uppercase tracking-[0.2em] text-white/75 transition-[color,border-color] duration-500 hover:border-white/40 hover:text-[#F0F0F0] md:text-xs"
            >
              Descargar CV
              <span
                className="text-base transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </ExpandedContentPanel>

        <div className="relative mx-auto aspect-[4/5] w-full min-h-[280px] max-w-md sm:min-h-[340px] lg:col-span-6 lg:col-start-7 lg:mx-0 lg:max-w-none lg:min-h-[400px]">
          <div className="panel-preview-layer panel-preview-layer--back absolute left-0 top-0 z-[1] h-[78%] w-[58%] overflow-hidden border border-white/[0.08] sm:w-[56%]">
            <img
              src="/wireone.png"
              alt="Composición visual — capa posterior"
              className="h-full w-full object-cover object-center grayscale contrast-[1.02] transition-[filter,transform] duration-500 hover:scale-[1.02] hover:grayscale-0 motion-reduce:scale-100 motion-reduce:grayscale-0"
              loading="lazy"
            />
          </div>
          <div className="panel-preview-layer panel-preview-layer--front absolute bottom-0 right-0 z-[2] h-[72%] w-[58%] overflow-hidden border border-white/[0.08] sm:w-[56%]">
            <img
              src="/wiretwo.png"
              alt="Composición visual — capa frontal"
              className="h-full w-full object-cover object-center grayscale contrast-[1.02] transition-[filter,transform] duration-500 hover:scale-[1.02] hover:grayscale-0 motion-reduce:scale-100 motion-reduce:grayscale-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </ExpandedSection>
  );
};

export default About;
