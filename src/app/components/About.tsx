"use client";

import { parallaxStyle, useMouseParallax } from "./useMouseParallax";

const ABOUT_IMAGES = [
  {
    src: "/exapone.jpg",
    alt: "Código en pantalla — desarrollo front end",
    depth: 10,
    className:
      "absolute top-0 left-[5%] z-10 h-[35%] w-[45%] shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-[z-index] duration-700 hover:z-40",
    imgClass:
      "h-full w-full border border-white/5 object-cover opacity-100 transition-all duration-500 md:opacity-60 md:grayscale md:hover:opacity-100 md:hover:grayscale-0",
  },
  {
    src: "/exaptwo.jpg",
    alt: "Editor de código en entorno oscuro",
    depth: 22,
    className:
      "absolute top-[20%] right-0 z-20 h-[55%] w-[45%] shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-[z-index] duration-700 hover:z-40",
    imgClass:
      "h-full w-full border border-white/10 object-cover opacity-100 transition-all duration-500 md:opacity-80 md:grayscale md:hover:opacity-100 md:hover:grayscale-0",
  },
  {
    src: "/exapthree.jpg",
    alt: "Diseño de interfaz y prototipo UI",
    depth: 34,
    className:
      "absolute bottom-[5%] left-0 z-30 h-[40%] w-[55%] shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-[z-index] duration-700 hover:z-40",
    imgClass:
      "h-full w-full border border-white/20 object-cover opacity-100 transition-all duration-500 md:grayscale md:hover:grayscale-0",
  },
] as const;

export const About = () => {
  const pointer = useMouseParallax();

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
          <div className="mt-4 flex flex-col items-start gap-4">
            <a
              href="/cv"
              download="Patrick-Ordonez-CV.pdf"
              className="w-fit border border-white/20 bg-transparent px-10 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
            >
              Descargar CV
            </a>
            <a
              href="#works"
              className="w-fit border border-white/20 bg-transparent px-10 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
            >
              Ver Proyectos
            </a>
          </div>
        </div>

        <div className="relative order-1 flex aspect-square w-full items-center justify-center lg:order-2 lg:aspect-auto lg:h-[650px]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[500px]">
            {ABOUT_IMAGES.map((item) => (
              <div
                key={item.src}
                className={`${item.className} will-change-transform`}
                style={parallaxStyle(pointer.x, pointer.y, item.depth)}
              >
                <img src={item.src} alt={item.alt} className={item.imgClass} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
