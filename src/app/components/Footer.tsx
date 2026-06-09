import React from "react";

const NAV_LINKS = [
  { name: "Inicio", href: "#hero" },
  { name: "Sobre mí", href: "#about" },
  { name: "Formación", href: "#experience" },
  { name: "Tecnologías", href: "#skills" },
  { name: "Proyectos", href: "#projects" },
  { name: "Contacto", href: "#contact" },
] as const;

const SERVICES = [
  "Desarrollo Web",
  "Aplicaciones React",
  "UI / UX Meticuloso",
  "Motion y Animaciones",
  "Optimización Web",
] as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Patrick9913" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
  },
  { label: "Email", href: "mailto:patrickyoel13@gmail.com" },
] as const;

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-[#F0F0F0] py-24 lg:py-32 border-t border-white/[0.08] font-sans">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-12 pb-16 md:pb-20 lg:pb-24 border-b border-white/[0.08]">
          {/* Marca */}
          <div className="md:col-span-5 lg:col-span-4">
            <span className="font-mono text-[10px] font-light tracking-[0.25em] uppercase text-white/50 block mb-6">
              Portfolio
            </span>
            <h3 className="text-xl md:text-2xl font-light tracking-[0.1em] uppercase text-[#F0F0F0] mb-6">
              Patrick Ordoñez
            </h3>
            <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide max-w-sm mb-10">
              Diseño interactivo y desarrollo Front End. Especializado en crear experiencias digitales excepcionales con un enfoque meticuloso en la estética y el rendimiento.
            </p>
            <nav className="flex flex-wrap gap-6" aria-label="Redes sociales">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith("mailto")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="font-mono text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Navegación */}
          <div className="md:col-span-3 lg:col-span-4 md:border-l md:border-white/[0.08] md:pl-10 lg:pl-12">
            <h4 className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/50 mb-8">
              Navegación
            </h4>
            <ul className="space-y-5" role="list">
              {NAV_LINKS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const sectionId = item.href.replace("#", "");
                      window.dispatchEvent(
                        new CustomEvent("nav-to-section", { detail: { sectionId } })
                      );
                    }}
                    className="group inline-flex items-center gap-3 text-sm md:text-base font-light tracking-wide text-white/50 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                  >
                    <span
                      className="w-0 h-px bg-[#F0F0F0] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-4"
                      aria-hidden
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div className="md:col-span-4 lg:col-span-4 md:border-l md:border-white/[0.08] md:pl-10 lg:pl-12">
            <h4 className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/50 mb-8">
              Servicios
            </h4>
            <ul className="space-y-5" role="list">
              {SERVICES.map((service, index) => (
                <li
                  key={service}
                  className="flex items-baseline gap-4 text-sm md:text-base font-light tracking-wide text-white/50"
                >
                  <span
                    className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/25 shrink-0"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-light text-white/25 text-center md:text-left">
            © {currentYear} Patrick Ordoñez. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-light text-white/25">
            Hecho con React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
