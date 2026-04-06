import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Navbar } from './Navbar';

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative h-screen w-screen flex flex-col bg-black text-white overflow-hidden font-sans"
    >
      {/* Background Image Setup */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('/secondbacks.jpg')" }}
      ></div>

      {/* Dark gradient overlay to ensure text is highly readable and adds depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>

      {/* Gradient to smooth out the bottom edge if scrolling down */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-0"></div>

      {/* Navbar positioning */}
      <div className="relative z-10 w-full pt-4">
        <Navbar />
      </div>
      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex items-center w-full px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-4xl mt-12 mb-24">

          <div className="flex items-center gap-6 mb-8">
            <span className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-gray-300">
              Portfolio
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-white mb-8 leading-[1]">
            FRONT END<br />
            <span className="font-medium text-gray-100">DEVELOPER</span>
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-12 max-w-xl font-light leading-relaxed tracking-wide">
            Especializado en React, Next.js y TypeScript. Creando interfaces inmersivas, esculpiendo componentes y diseñando experiencias de usuario dinámicas con profunda atención al detalle y la estética visual.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a
              href="#projects"
              className="group flex items-center justify-center gap-4 px-10 py-4 bg-white text-black text-xs md:text-sm font-medium tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300"
            >
              Explorar Proyectos
              <IoIosArrowRoundForward className="text-2xl group-hover:translate-x-2 transition-transform" />
            </a>

            <a
              href="#contact"
              className="flex items-center justify-center px-10 py-4 border border-white/20 text-white text-xs md:text-sm font-light tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              Contactar
            </a>
          </div>

        </div>
      </div>

      {/* Socials Floating on the Right */}
      <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col gap-8 text-white/40">
        <a
          href="https://github.com/Patrick9913"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-white hover:scale-110 transition-all duration-300"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-white hover:scale-110 transition-all duration-300"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="mailto:patrickyoel13@gmail.com"
          aria-label="Email"
          className="hover:text-white hover:scale-110 transition-all duration-300"
        >
          <IoMdMail size={26} />
        </a>
      </div>

      {/* Scroll indicator (absolute bottom center or right, moved to bottom right to avoid left content overlap) */}
      <div className="absolute bottom-12 right-8 md:right-16 lg:right-24 z-10 hidden md:flex flex-col items-center gap-6">
        <div className="w-[1px] h-16 bg-white/30 relative overflow-hidden">
          <div className="w-full h-1/2 bg-white absolute top-0 left-0 animate-[scrollDown_2s_ease-in-out_infinite]"></div>
        </div>
        <span
          className="text-[10px] uppercase tracking-[0.3em] font-light text-white/60 mb-8"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Scroll
        </span>
      </div>

      {/* Inline animation keyframes for the scroll indicator */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scrollDown {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}} />
    </section>
  );
};

export default Hero;
