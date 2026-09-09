const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden border-t border-white/5 bg-[#050505] px-8 pb-10 pt-20 font-sans sm:px-16 lg:px-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-3/4 -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 md:flex-row">
        <div className="flex max-w-sm flex-col gap-6">
          <h3 className="text-xs font-light uppercase tracking-[0.4em] text-white/90">
            Patrick Ordoñez
          </h3>
          <p className="mb-2 text-xs font-light leading-relaxed tracking-wider text-white/40 sm:text-sm">
            Front End Developer. Interfaces claras, producto real y atención al
            detalle en cada pantalla.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors duration-300 hover:scale-110 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C21.428 24 22.22 23.227 22.22 22.271V1.729C22.22.774 21.428 0 20.447 0z" />
              </svg>
            </a>
            <a
              href="https://github.com/Patrick9913"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors duration-300 hover:scale-110 hover:text-white"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="mailto:patrickyoel13@gmail.com"
              className="text-white/40 transition-colors duration-300 hover:scale-110 hover:text-white"
              aria-label="Email"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Explorar
            </h4>
            <a
              href="#works"
              className="w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white"
            >
              Proyectos
            </a>
            <a
              href="#about"
              className="w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white"
            >
              Sobre Mí
            </a>
            <a
              href="#tools"
              className="w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white"
            >
              Herramientas
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Contacto
            </h4>
            <a
              href="#contact"
              className="w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white"
            >
              Escribime
            </a>
            <a
              href="/cv"
              className="w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white"
            >
              Descargar CV
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
        <p className="text-[10px] font-light uppercase tracking-[0.2em] text-white/30">
          © {year} Patrick Ordoñez
        </p>
        <p className="text-[10px] font-light uppercase tracking-[0.2em] text-white/30">
          Diseñado con precisión.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
