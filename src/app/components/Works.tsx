"use client";

import type { MouseEvent } from "react";
import {
  getDemoContactHref,
  requestProjectDemo,
  type DemoProject,
} from "./contactDemo";
import { META_LABEL } from "./portfolioAccents";

type WorkThumb = {
  src: string;
  objectPosition?: string;
};

type WorkItem = DemoProject & {
  id: string;
  client: string;
  role: string;
  year: string;
  tags: string[];
  thumb?: WorkThumb;
  href?: string;
};

const WORKS: WorkItem[] = [
  {
    id: "01",
    title: "Grupo Sheina",
    client: "Freelance",
    role: "Full Stack",
    year: "2025",
    tags: ["Next.js", "Gestión", "Tiempo real"],
    thumb: { src: "/about-sheina.png", objectPosition: "center 20%" },
    description:
      "Plataforma gastronómica: menús, seguimiento logístico en tiempo real, stock y arqueos. Operación diaria de cocina, logística y administración.",
    href: "https://gruposheina-five.vercel.app/views/login",
  },
  {
    id: "02",
    title: "Colegio Wolfsohn",
    client: "Freelance",
    role: "Full Stack",
    year: "2025",
    tags: ["Interno", "Comedor", "Operación"],
    description:
      "Sistema interno de gestión de comedor: cargas, seguimiento y operación diaria para el equipo de la institución.",
  },
  {
    id: "03",
    title: "BNS Abogados",
    client: "Freelance",
    role: "Full Stack",
    year: "2025",
    tags: ["Institucional", "Next.js", "Confianza"],
    thumb: { src: "/about-bns.png", objectPosition: "center 22%" },
    description:
      "Sitio del estudio jurídico en CABA. Arquitectura clara, orientada a confianza y consulta.",
    href: "https://bnsabogados.vercel.app/",
  },
  {
    id: "04",
    title: "Aditamentos Piazza",
    client: "Freelance",
    role: "Full Stack",
    year: "2025",
    tags: ["Comercial", "Gestión", "Metalúrgica"],
    description:
      "Sitio comercial y plataforma de gestión operativa para empresa metalúrgica.",
  },
  {
    id: "05",
    title: "Municipalidad de Calingasta",
    client: "Freelance",
    role: "Full Stack",
    year: "2024",
    tags: ["Gobierno", "Trámites", "Institucional"],
    thumb: { src: "/about-calingasta.png", objectPosition: "center 28%" },
    description:
      "Sitio institucional y plataforma interna de gestión para el municipio de San Juan.",
    href: "https://www.calingasta.gob.ar/",
  },
  {
    id: "06",
    title: "Escuela Margarita",
    client: "Freelance",
    role: "Full Stack",
    year: "2025",
    tags: ["Educación", "CMS", "Institucional"],
    thumb: { src: "/about-marga.png", objectPosition: "center 42%" },
    description:
      "Portal institucional educativo: oferta académica, historia y contacto administrable.",
    href: "https://margaweb.vercel.app/",
  },
  {
    id: "07",
    title: "Lumino Campus",
    client: "Co-founder",
    role: "Full Stack",
    year: "2026",
    tags: ["Producto", "Campus", "Full Stack"],
    description:
      "Producto propio: plataforma full stack orientada a experiencia de campus y operación digital.",
    href: "https://luminocampus.com",
  },
];

function handleDemoClick(event: MouseEvent<HTMLAnchorElement>, work: WorkItem) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  requestProjectDemo(work);
}

function WorkThumbnail({ work }: { work: WorkItem }) {
  if (work.thumb) {
    return (
      <div className="hidden shrink-0 overflow-hidden border border-white/10 bg-[#0a0a0a] md:block md:h-[3.25rem] md:w-[5.5rem]">
        <img
          src={work.thumb.src}
          alt=""
          className="h-full w-full object-cover opacity-80 grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
          style={{ objectPosition: work.thumb.objectPosition ?? "center" }}
        />
      </div>
    );
  }

  const initials = work.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="hidden shrink-0 items-center justify-center border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent font-mono text-[10px] tracking-widest text-white/35 md:flex md:h-[3.25rem] md:w-[5.5rem]">
      {initials}
    </div>
  );
}

export const Works = () => {
  return (
    <section
      id="works"
      className="relative w-full overflow-hidden border-t border-white/[0.02] bg-[#050505] px-8 py-32 font-sans sm:px-16 lg:px-24"
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col">
        <div className="mb-24 flex flex-col items-start">
          <h2 className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-white/50 sm:text-sm">
            Experiencia
          </h2>
          <h3 className="text-4xl font-extralight uppercase tracking-widest text-white drop-shadow-xl md:text-5xl lg:text-6xl">
            Proyectos Destacados
          </h3>
        </div>

        <div className="flex w-full flex-col border-t border-white/10">
          {WORKS.map((work) => {
            const hasLiveLink = Boolean(work.href);
            const actionLabel = hasLiveLink ? "Ver sitio →" : "Solicitar demo →";

            const Inner = (
              <>
                <div className="relative z-10 flex flex-col justify-between gap-6 px-4 md:flex-row md:items-center">
                  <div className="flex w-full items-start gap-4 md:w-5/12 md:items-center md:gap-6">
                    <WorkThumbnail work={work} />
                    <span className="text-sm font-light tracking-widest text-white/30 transition-colors duration-500 group-hover:text-white/60">
                      {work.id}
                    </span>
                    <h4 className="min-w-0 flex-1 text-3xl font-extralight tracking-wide text-white/80 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white md:text-4xl lg:text-5xl">
                      {work.title}
                    </h4>
                  </div>
                  <div className="mt-4 flex w-full flex-col justify-between gap-8 md:mt-0 md:w-7/12 md:flex-row md:items-center md:gap-4">
                    <div className="flex flex-col">
                      <span
                        className={`mb-1 text-[9px] uppercase tracking-[0.3em] ${META_LABEL.client}`}
                      >
                        Cliente
                      </span>
                      <span className="text-sm font-light tracking-widest text-white/80">
                        {work.client}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`mb-1 text-[9px] uppercase tracking-[0.3em] ${META_LABEL.role}`}
                      >
                        Rol
                      </span>
                      <span className="text-sm font-light tracking-widest text-white/80">
                        {work.role}
                      </span>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span
                        className={`mb-1 text-[9px] uppercase tracking-[0.28em] ${META_LABEL.year}`}
                      >
                        {work.year}
                      </span>
                      <span className="translate-x-0 text-xs font-light tracking-widest text-white/80 opacity-100 transition-all duration-500 md:translate-x-4 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                        {actionLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-0 max-h-0 overflow-hidden px-4 opacity-0 transition-all duration-700 ease-in-out group-hover:mt-6 group-hover:max-h-56 group-hover:opacity-100 md:pl-24">
                  <ul
                    className="mb-4 flex max-w-3xl flex-wrap gap-2 pl-6 md:pl-6"
                    role="list"
                  >
                    {work.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-block border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 group-hover:border-[#6eb0d4]/25 group-hover:text-white/60">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="max-w-3xl border-l border-white/20 pl-6 text-sm font-light leading-relaxed text-white/60 md:text-base">
                    {work.description}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.01] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </>
            );

            const className =
              "group relative cursor-pointer overflow-hidden border-b border-white/10 py-10 transition-colors duration-500 hover:border-white/40";

            if (hasLiveLink) {
              return (
                <a
                  key={work.id}
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {Inner}
                </a>
              );
            }

            return (
              <a
                key={work.id}
                href={getDemoContactHref(work)}
                className={className}
                onClick={(event) => handleDemoClick(event, work)}
              >
                {Inner}
              </a>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="#contact"
            className="inline-block border border-white/20 bg-transparent px-10 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
          >
            Ver Lista Completa
          </a>
        </div>
      </div>
    </section>
  );
};

export default Works;
