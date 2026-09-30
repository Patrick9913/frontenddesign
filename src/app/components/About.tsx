"use client";

import { CvDownloadTrigger } from "./CvDownloadTrigger";
import { TrustedBy } from "./TrustedBy";
import { parallaxStyle, useMouseParallax } from "./useMouseParallax";

type AboutPreview = {
  src: string;
  alt: string;
  label: string;
  meta: string;
  href: string;
  objectPosition: string;
  frameClassName: string;
  depth: number;
};

const ABOUT_PREVIEWS: AboutPreview[] = [
  {
    src: "/about-bns.png",
    alt: "BNS Abogados — sitio institucional",
    label: "BNS Abogados",
    meta: "Sitio · 2025",
    href: "https://bnsabogados.vercel.app/",
    objectPosition: "center 22%",
    frameClassName: "absolute left-0 top-[6%] z-10 w-[82%]",
    depth: 6,
  },
  {
    src: "/about-calingasta.png",
    alt: "Municipalidad de Calingasta — portal institucional",
    label: "Calingasta",
    meta: "Gobierno · 2024",
    href: "https://www.calingasta.gob.ar/",
    objectPosition: "center 28%",
    frameClassName: "absolute right-0 top-0 z-[12] w-[62%]",
    depth: 7,
  },
  {
    src: "/about-marga.png",
    alt: "Escuela Margarita — portal educativo",
    label: "Escuela Margarita",
    meta: "Institucional · 2025",
    href: "https://margaweb.vercel.app/",
    objectPosition: "center 42%",
    frameClassName: "absolute bottom-[4%] right-0 z-20 w-[72%]",
    depth: 10,
  },
];

function PreviewChrome({
  preview,
  pointerX,
  pointerY,
}: {
  preview: AboutPreview;
  pointerX: number;
  pointerY: number;
}) {
  return (
    <a
      href={preview.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block ${preview.frameClassName} will-change-transform transition-transform duration-700 md:hover:scale-[1.012]`}
      style={parallaxStyle(pointerX, pointerY, preview.depth)}
    >
      <div className="overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_28px_60px_-32px_rgba(0,0,0,0.95)]">
        <div
          className="flex items-center gap-1.5 border-b border-white/10 bg-[#0c0c0c] px-3 py-2.5"
          aria-hidden
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="ml-2 truncate font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
            {preview.label}
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
          <img
            src={preview.src}
            alt={preview.alt}
            className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-out md:group-hover:scale-[1.02]"
            style={{
              objectPosition: preview.objectPosition,
              filter: "saturate(0.88) contrast(1.04) brightness(0.94)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent"
            aria-hidden
          />
        </div>

        <div className="border-t border-white/10 bg-[#080808] px-3 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 transition-colors duration-300 group-hover:text-white/80">
            {preview.label}
          </p>
          <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/35">
            {preview.meta}
          </p>
        </div>
      </div>
    </a>
  );
}

export const About = () => {
  const pointer = useMouseParallax(0.45);

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#050505] px-8 py-32 font-sans sm:px-16 lg:px-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 flex flex-col gap-8 lg:order-1">
          <div>
            <h2 className="mb-6 text-xs font-light uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              Detrás de la interfaz
            </h2>
            <h3 className="text-4xl font-extralight leading-tight tracking-wide text-white md:text-5xl lg:text-6xl">
              Sobre Mí
            </h3>
          </div>
          <div className="flex max-w-xl flex-col gap-6 text-base font-light leading-relaxed text-white/70 md:text-lg">
            <p>
              Estudio Ciencia de Datos en la UBA y diseño interfaces. Me interesa
              el punto donde el código y el diseño se encuentran: que se vea bien
              y se sienta claro al usarlo.
            </p>
            <p>
              Trabajo con React, Next.js y TypeScript en productos reales:
              plataformas de gestión, sitios institucionales y experiencias web
              con atención al detalle.
            </p>
          </div>
          <TrustedBy />
          <div className="mt-2 flex flex-col items-start gap-4">
            <CvDownloadTrigger variant="button" />
            <a
              href="#works"
              className="w-fit border border-white/20 bg-transparent px-10 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
            >
              Ver Proyectos
            </a>
          </div>
        </div>

        <div className="relative order-1 flex aspect-square w-full items-center justify-center lg:order-2 lg:aspect-auto lg:h-[580px]">
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-[480px] lg:max-w-[520px]">
            {ABOUT_PREVIEWS.map((preview) => (
              <PreviewChrome
                key={preview.src}
                preview={preview}
                pointerX={pointer.x}
                pointerY={pointer.y}
              />
            ))}
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;
