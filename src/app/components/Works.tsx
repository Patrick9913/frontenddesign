type WorkItem = {
  id: string;
  title: string;
  client: string;
  role: string;
  year: string;
  description: string;
  href?: string;
};

const WORKS: WorkItem[] = [
  {
    id: "01",
    title: "Grupo Sheina",
    client: "Freelance",
    role: "Front End",
    year: "2025",
    description:
      "Plataforma gastronómica: menús, seguimiento logístico en tiempo real, stock y arqueos. Operación diaria de cocina, logística y administración.",
    href: "https://gruposheina-five.vercel.app/views/login",
  },
  {
    id: "02",
    title: "Colegio Wolfsohn",
    client: "Freelance",
    role: "Front End",
    year: "2025",
    description:
      "Sistema interno de gestión de comedor: cargas, seguimiento y operación diaria para el equipo de la institución.",
  },
  {
    id: "03",
    title: "BNS Abogados",
    client: "Freelance",
    role: "Front End",
    year: "2025",
    description:
      "Sitio del estudio jurídico en CABA. Arquitectura clara, orientada a confianza y consulta.",
    href: "https://bnsabogados.vercel.app/",
  },
  {
    id: "04",
    title: "Aditamentos Piazza",
    client: "Freelance",
    role: "Front End",
    year: "2025",
    description:
      "Sitio comercial y plataforma de gestión operativa para empresa metalúrgica.",
  },
  {
    id: "05",
    title: "Municipalidad de Calingasta",
    client: "Freelance",
    role: "Front End",
    year: "2024",
    description:
      "Sitio institucional y plataforma interna de gestión para el municipio de San Juan.",
  },
  {
    id: "06",
    title: "Escuela Margarita",
    client: "Freelance",
    role: "Front End",
    year: "2025",
    description:
      "Portal institucional educativo: oferta académica, historia y contacto administrable.",
    href: "https://margaweb.vercel.app/",
  },
  {
    id: "07",
    title: "Lumino Campus",
    client: "Co-founder",
    role: "Front End",
    year: "2026",
    description:
      "Producto propio: interfaz front end orientada a experiencia de campus y operación digital.",
    href: "https://luminocampus.com",
  },
];

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
            const Inner = (
              <>
                <div className="relative z-10 flex flex-col justify-between gap-6 px-4 md:flex-row md:items-center">
                  <div className="flex w-full items-start gap-6 md:w-5/12 md:items-center md:gap-12">
                    <span className="text-sm font-light tracking-widest text-white/30 transition-colors duration-500 group-hover:text-white/60">
                      {work.id}
                    </span>
                    <h4 className="text-3xl font-extralight tracking-wide text-white/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-white md:text-4xl lg:text-5xl">
                      {work.title}
                    </h4>
                  </div>
                  <div className="mt-4 flex w-full flex-col justify-between gap-8 md:mt-0 md:w-7/12 md:flex-row md:items-center md:gap-4">
                    <div className="flex flex-col">
                      <span className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/40">
                        Cliente
                      </span>
                      <span className="text-sm font-light tracking-widest text-white/80">
                        {work.client}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/40">
                        Rol
                      </span>
                      <span className="text-sm font-light tracking-widest text-white/80">
                        {work.role}
                      </span>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/40">
                        {work.year}
                      </span>
                      <span className="hidden translate-x-4 text-xs font-light tracking-widest text-white/80 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                        Ver Detalles →
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-0 max-h-0 overflow-hidden px-4 opacity-0 transition-all duration-700 ease-in-out group-hover:mt-6 group-hover:max-h-40 group-hover:opacity-100 md:pl-24">
                  <p className="max-w-3xl border-l border-white/20 pl-6 text-sm font-light leading-relaxed text-white/60 md:text-base">
                    {work.description}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.01] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </>
            );

            const className =
              "group relative cursor-pointer overflow-hidden border-b border-white/10 py-10 transition-colors duration-500 hover:border-white/40";

            return work.href ? (
              <a
                key={work.id}
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {Inner}
              </a>
            ) : (
              <div key={work.id} className={className}>
                {Inner}
              </div>
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
