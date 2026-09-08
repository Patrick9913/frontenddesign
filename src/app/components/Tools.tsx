const TOOL_GROUPS = [
  {
    title: "Frameworks",
    items: ["React", "Next.js", "TypeScript", "JavaScript"],
  },
  {
    title: "Estilos",
    items: ["Tailwind CSS", "CSS Modules", "HTML5", "Responsive UI"],
  },
  {
    title: "Datos y backend",
    items: ["Firebase", "Node.js", "SQL", "REST APIs"],
  },
  {
    title: "Herramientas",
    items: ["Git", "Vercel", "Figma", "EmailJS"],
  },
] as const;

export const Tools = () => {
  return (
    <section
      id="tools"
      className="relative w-full overflow-hidden border-t border-white/[0.02] bg-[#050505] px-8 py-32 font-sans sm:px-16 lg:px-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-white/50 sm:text-sm">
            Arsenal Técnico
          </h2>
          <h3 className="text-4xl font-extralight uppercase tracking-widest text-white drop-shadow-xl md:text-5xl lg:text-6xl">
            Herramientas
          </h3>
          <div className="mx-auto mt-8 h-px w-12 bg-white/30" />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TOOL_GROUPS.map((group) => (
            <div
              key={group.title}
              className="group relative flex flex-col gap-6 overflow-hidden border border-white/5 bg-white/[0.01] p-8 transition-all duration-700 hover:-translate-y-1 hover:bg-white/[0.03]"
            >
              <h4 className="text-[10px] font-light uppercase tracking-[0.3em] text-white/50 md:text-xs">
                {group.title}
              </h4>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="h-1 w-1 rounded-full bg-white/20 transition-colors duration-500 group-hover:bg-white/60" />
                    <span className="text-sm font-light tracking-wide text-white/80 transition-colors duration-500 group-hover:text-white md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.03] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
