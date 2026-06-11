"use client";

import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { FooterSectionDecor } from "./expanded/SectionDecors";

const NAV_LINKS = [
  { name: "Inicio", href: "#hero" },
  { name: "Sobre mí", href: "#about" },
  { name: "Formación", href: "#experience" },
  { name: "Tecnologías", href: "#skills" },
  { name: "Proyectos", href: "#projects" },
  { name: "Contacto", href: "#contact" },
  { name: "Cierre", href: "#footer" },
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

const SECTION_INDEX = "[ 06 ]";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <ExpandedSection
      id="footer"
      decor={<FooterSectionDecor />}
      index={SECTION_INDEX}
      overline="Cierre"
      title="PATRICK"
      accent="ORDOÑEZ"
      lead="Navegación, servicios y redes. El cierre del portfolio en una última hoja del stack."
    >
      <ExpandedContentPanel>
        <div className="grid grid-cols-1 gap-16 border-b border-white/[0.08] pb-16 md:grid-cols-12 lg:gap-12 md:pb-20 lg:pb-24">
          <div className="md:col-span-5 lg:col-span-4">
            <span className="mb-6 block font-mono text-[10px] font-light uppercase tracking-[0.25em] text-white/50">
              Portfolio
            </span>
            <h3 className="mb-6 text-xl font-light uppercase tracking-[0.1em] text-[#F0F0F0] md:text-2xl">
              Patrick Ordoñez
            </h3>
            <p className="mb-10 max-w-sm text-sm font-light leading-[1.75] tracking-wide text-white/50 md:text-base">
              Diseño interactivo y desarrollo Front End. Especializado en crear experiencias digitales
              excepcionales con un enfoque meticuloso en la estética y el rendimiento.
            </p>
            <nav className="flex flex-wrap gap-6" aria-label="Redes sociales">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith("mailto")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="font-mono text-[10px] font-light uppercase tracking-[0.15em] text-white/40 transition-colors duration-500 hover:text-[#F0F0F0] md:text-xs"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 md:border-l md:border-white/[0.08] md:pl-10 lg:col-span-4 lg:pl-12">
            <h4 className="mb-8 font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50">
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
                    className="group inline-flex items-center gap-3 text-sm font-light tracking-wide text-white/50 transition-colors duration-500 hover:text-[#F0F0F0] md:text-base"
                  >
                    <span
                      className="h-px w-0 bg-[#F0F0F0] transition-all duration-500 group-hover:w-4"
                      aria-hidden
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:border-l md:border-white/[0.08] md:pl-10 lg:col-span-4 lg:pl-12">
            <h4 className="mb-8 font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/50">
              Servicios
            </h4>
            <ul className="space-y-5" role="list">
              {SERVICES.map((service, index) => (
                <li
                  key={service}
                  className="flex items-baseline gap-4 text-sm font-light tracking-wide text-white/50 md:text-base"
                >
                  <span
                    className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-white/25"
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

        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <p className="text-center font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/25 md:text-left">
            © {currentYear} Patrick Ordoñez. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] font-light uppercase tracking-[0.2em] text-white/25">
            Hecho con React
          </p>
        </div>
      </ExpandedContentPanel>
    </ExpandedSection>
  );
};

export default Footer;
