const CLIENTS = [
  "BNS Abogados",
  "Calingasta",
  "Escuela Margarita",
  "Grupo Sheina",
  "Lumino Campus",
] as const;

export function TrustedBy() {
  return (
    <div className="flex flex-col gap-5 border-l border-[#6eb0d4]/25 pl-5 md:pl-6">
      <div>
        <p className="text-[9px] uppercase tracking-[0.28em] text-[#c4a574]/80">
          Experiencia en producción
        </p>
        <p className="mt-3 max-w-md text-sm font-light italic leading-relaxed text-white/55 md:text-base">
          “Prioriza la operación real: interfaces claras para equipos que las usan
          todos los días.”
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
          Contexto · institucional & gestión
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#a992d4]/80">
          Proyectos con
        </span>
        <ul className="flex flex-wrap gap-2" role="list">
          {CLIENTS.map((name) => (
            <li key={name}>
              <span className="inline-block border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50 transition-colors duration-300 hover:border-white/20 hover:text-white/70">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TrustedBy;
