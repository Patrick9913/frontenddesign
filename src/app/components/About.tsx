"use client";

import { useState, type MouseEvent } from "react";
import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { AboutSectionDecor } from "./expanded/SectionDecors";

const SECTION_INDEX = "[ 01 ]";

const COPY = {
  overline: "Sobre mí",
  title: "CÓDIGO QUE",
  accent: "RESPIRA DISEÑO",
  lead:
    "Mi perfil se construye en la intersección exacta entre la estructura analítica y la experiencia visual. Como estudiante de Ciencia de Datos y desarrollador web, entiendo la lógica profunda detrás del software, pero me apasiona obsesivamente cómo ese código se ve y se siente al usarlo.",
  paragraphs: [
    "A través de formación universitaria, cursos intensivos y años de aprendizaje autodidacta, he cultivado un enfoque donde el diseño es el pilar central. Me motiva el uso estratégico del espacio, la tipografía y el ritmo para crear interfaces limpias y coherentes, logrando que la estética siempre acompañe al mensaje.",
    "Creo firmemente que una buena interfaz no es un simple recurso cosmético; es la capa humana que traduce sistemas y datos complejos. Cuando la precisión técnica y el diseño visual están perfectamente alineados, la experiencia se vuelve intuitiva, memorable y clara.",
  ],
} as const;

export const About = () => {
  const [showCvNotice, setShowCvNotice] = useState(false);

  const handleCvClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCvNotice(true);
  };

  return (
    <ExpandedSection
      id="about"
      decor={<AboutSectionDecor />}
      index={SECTION_INDEX}
      overline={COPY.overline}
      title={COPY.title}
      accent={COPY.accent}
      lead={COPY.lead}
    >
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <ExpandedContentPanel className="lg:col-span-5">
          <div className="space-y-8">
            {COPY.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-6 md:gap-8">
                <span
                  className="shrink-0 pt-1 font-mono text-[10px] font-light tracking-[0.2em] text-white/50"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-light leading-[1.75] tracking-wide text-white/50 transition-colors duration-500 hover:text-white/80 md:text-base">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.08] pt-8">
            <a
              href="/cv.pdf"
              onClick={handleCvClick}
              className="group inline-flex w-fit items-center gap-4 border border-white/20 bg-transparent px-8 py-4 text-[10px] font-light uppercase tracking-[0.2em] text-white/50 transition-[color,border-color] duration-500 hover:border-white/40 hover:text-[#F0F0F0] md:text-xs"
            >
              Descargar CV
              <span
                className="text-base transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
            {showCvNotice ? (
              <p
                className="font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/25 md:text-xs"
                role="status"
              >
                Currículum actualizándose.
              </p>
            ) : null}
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
