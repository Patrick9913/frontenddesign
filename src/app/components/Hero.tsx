import React from 'react';
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Navbar } from './Navbar';

export const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        preload="auto"
      >
        <source src="/fondoport.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay sutil para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Desarrollador
            <span className="block text-gray-200">Front End</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Especializado en React, Next.js y TypeScript. Creando experiencias digitales modernas y funcionales con más de 3 años de experiencia en desarrollo web.
          </p>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/Patrick9913"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver perfil de GitHub de Patrick Ordoñez"
            className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 hover:scale-110 border border-white/20"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver perfil de LinkedIn de Patrick Ordoñez"
            className="p-3 bg-blue-600/80 backdrop-blur-sm text-white rounded-full hover:bg-blue-700/90 transition-all duration-300 hover:scale-110 border border-blue-400/30"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:patrickyoel13@gmail.com"
            aria-label="Enviar email a Patrick Ordoñez"
            className="p-3 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/90 transition-all duration-300 hover:scale-110 border border-red-400/30"
          >
            <IoMdMail />
          </a>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="#projects"
            className="px-8 py-4 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 font-medium hover:scale-105 border border-white/20"
          >
            Ver Proyectos
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-white/30 rounded-full bg-transparent backdrop-blur-sm text-white hover:bg-white/10 transition-all duration-300 font-medium hover:scale-105"
          >
            Contactar
          </a>
        </div>
        <div className="mt-16 animate-bounce flex justify-center">
          <a href="#about">
            <IoIosArrowDown className="text-white/80 w-6 h-6  hover:text-white transition-colors drop-shadow-lg" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;