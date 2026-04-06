'use client'
import React, { useState, useEffect } from 'react';
import { FaGithub } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const Projects = () => {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'Estudio Jurídico',
      subtitle: 'Landing Page Comercial',
      description: 'Sitio web profesional para estudio jurídico con más de 20 años de experiencia. Arquitectura limpia e informativa diseñada para la conversión y generación de confianza.',
      image: '/juridico.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodelthree',
      live: 'https://landingmodelthree.vercel.app/',
    },
    {
      id: 2,
      title: 'Street Collection',
      subtitle: 'E-commerce',
      description: 'Tienda online de ropa urbana con catálogo interactivo, promociones y sistema headless. Diseño minimalista enfocado en la exposición visual del producto.',
      image: '/ecommerce.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodeltwo',
      live: 'https://landingmodeltwo.vercel.app/',
    },
    {
      id: 3,
      title: 'ConsultoraPro',
      subtitle: 'Business Landing',
      description: 'Landing page B2B para consultora empresarial especializada en estrategia, optimización de procesos y desarrollo de equipos de alto rendimiento.',
      image: '/consultora.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodelone',
      live: 'https://landingmodelone.vercel.app/',
    },
    {
      id: 4,
      title: 'Escuela Margarita',
      subtitle: 'Portal Institucional',
      description: 'Plataforma web para institución educativa centenaria. Incluye información académica, modalidades, historia y contacto administrable.',
      image: '/escuela.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/margaweb',
      live: 'https://margaweb.vercel.app/',
    },
  ];

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToProject = (index: number) => {
    setCurrentProject(index);
  };

  // Auto-play carrusel
  useEffect(() => {
    const interval = setInterval(nextProject, 7000);
    return () => clearInterval(interval);
  }, []);

  const current = projects[currentProject];

  return (
    <section id="projects" className="min-h-[800px] lg:min-h-screen w-full relative overflow-hidden bg-black font-sans border-t border-white/10 flex flex-col items-center justify-center">
      
      {/* Absolute Centered Header directly matching the user's reference */}
      <div className="absolute top-8 md:top-24 left-1/2 -translate-x-1/2 z-30 text-center flex flex-col items-center w-full px-6 pointer-events-none">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] text-white uppercase mt-4 md:mt-0">
          Demos representativas
        </h2>
        <div className="w-8 md:w-12 h-[1px] bg-white/20 mt-4 md:mt-8"></div>
      </div>

      {/* Carrusel Container */}
      <div className="absolute inset-0 z-0">
        {/* Background Image transitioning */}
        <div className="absolute inset-0">
          <img
            key={`img-${currentProject}`}
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-20 animate-[slideInBackground_1s_ease-out]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-80"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 h-full flex flex-col justify-center pt-40 pb-32 lg:pt-48 lg:pb-24 mt-12 md:mt-0">
        
        {/* Desktop & Mobile responsive grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          
          {/* Project Info */}
          <div key={`info-${currentProject}`} className="text-white animate-[fadeInLeft_0.8s_ease-out]">
            <span className="block text-[9px] md:text-xs font-light tracking-[0.3em] uppercase text-white/50 mb-3 md:mb-4 w-full">
              {current.subtitle}
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wide mb-6 leading-[1.1]">
              {current.title}
            </h3>
            
            <p className="text-xs md:text-base text-gray-400 mb-8 md:mb-10 leading-relaxed font-light tracking-wide max-w-lg">
              {current.description}
            </p>
            
            <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12 cursor-default">
              {current.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-transparent text-white/70 text-[9px] md:text-[10px] uppercase font-light tracking-[0.1em] border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href={current.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-white text-black text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase hover:bg-gray-200 transition-all duration-300"
              >
                Ver Código
                <FaGithub size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={current.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 border border-white/20 text-white text-[10px] md:text-xs font-light tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Ver Demo
                <GoLinkExternal size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Project Image Panel */}
          <div key={`panel-${currentProject}`} className="hidden md:block relative animate-[fadeInRight_0.8s_ease-out]">
            <div className="relative border border-white/10 overflow-hidden group">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-80 lg:h-[450px] object-cover object-top opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Bottom area) */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 pointer-events-none">
        
        {/* Project Counter */}
        <div className="text-white mb-6 md:mb-0 hidden md:block">
          <span className="text-xs font-light tracking-[0.3em] uppercase text-white/50">
            0{currentProject + 1} <span className="mx-2">/</span> 0{projects.length}
          </span>
        </div>

        {/* Dots & Nav */}
        <div className="flex items-center gap-12 pointer-events-auto">
          <button
            onClick={prevProject}
            className="text-white/50 hover:text-white transition-colors duration-300 p-2"
            aria-label="Proyecto anterior"
          >
            <IoIosArrowBack size={24} />
          </button>
          
          <div className="flex space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                aria-label={`Ir al proyecto ${index + 1}`}
                className={`w-1 transition-all duration-500 rounded-full ${
                  index === currentProject
                    ? 'h-6 bg-white'
                    : 'h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextProject}
            className="text-white/50 hover:text-white transition-colors duration-300 p-2"
            aria-label="Siguiente proyecto"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </div>

      {/* Inline animations for slider transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideInBackground {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 0.2; transform: scale(1); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </section>
  );
};

export default Projects;