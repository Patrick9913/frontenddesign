import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoHeartOutline } from "react-icons/io5";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-24 border-t border-white/10 font-sans relative overflow-hidden">
      {/* Decorative gradient flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        
        <div className="grid md:grid-cols-4 gap-16 lg:gap-12 mb-24">
          
          {/* Brand & Bio */}
          <div className="md:col-span-2 lg:pr-16">
            <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-6">
              Patrick Ordoñez
            </h3>
            <p className="text-sm md:text-base font-light text-gray-400 mb-10 leading-relaxed max-w-sm">
              Diseño interactivo y desarrollo Front End. Especializado en crear experiencias digitales excepcionales con un enfoque meticuloso en la estética y el rendimiento.
            </p>
            <div className="flex items-center gap-6 text-white/40">
              <a
                href="https://github.com/Patrick9913"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/patrick-ordonez"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="mailto:patrickyoel13@gmail.com"
                className="hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Email"
              >
                <IoMdMail size={22} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-white/50 mb-8">Navegación</h4>
            <ul className="space-y-5">
              {[
                { name: 'Inicio', href: '#hero' },
                { name: 'Sobre mí', href: '#about' },
                { name: 'Habilidades', href: '#skills' },
                { name: 'Proyectos', href: '#projects' },
                { name: 'Contacto', href: '#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm md:text-base font-light tracking-wide text-gray-400 hover:text-white transition-colors flex items-center gap-3 group">
                    <span className="w-0 h-[1px] bg-white group-hover:w-4 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-white/50 mb-8">Servicios</h4>
            <ul className="space-y-5 text-sm md:text-base font-light tracking-wide text-gray-400">
              <li className="hover:text-white transition-colors cursor-default">Desarrollo Web</li>
              <li className="hover:text-white transition-colors cursor-default">Aplicaciones React</li>
              <li className="hover:text-white transition-colors cursor-default">UI / UX Meticuloso</li>
              <li className="hover:text-white transition-colors cursor-default">Motion & Animaciones</li>
              <li className="hover:text-white transition-colors cursor-default">Optimización Web</li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase font-light text-white/30 text-center md:text-left">
            © {currentYear} Patrick Ordoñez. Todos los derechos reservados.
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase font-light text-white/30 flex items-center">
            Hecho con <IoHeartOutline className="text-white/50 mx-2" size={14} /> y React
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;