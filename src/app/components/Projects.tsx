'use client'
import React, { useState, useEffect } from 'react';
import { FaGithub } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Projects = () => {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'Estudio Jurídico - Landing Page',
      description: 'Sitio web profesional para estudio jurídico con más de 20 años de experiencia. Incluye secciones de servicios, equipo, casos exitosos y formulario de contacto.',
      image: '/juridico.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodelthree',
      live: 'https://landingmodelthree.vercel.app/',
    },
    {
      id: 2,
      title: 'Street Collection - E-commerce',
      description: 'Tienda online de ropa urbana con catálogo de productos, promociones especiales y sistema de newsletter. Diseño moderno y responsive.',
      image: '/ecommerce.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodeltwo',
      live: 'https://landingmodeltwo.vercel.app/',
    },
    {
      id: 3,
      title: 'ConsultoraPro - Business Landing',
      description: 'Landing page para consultora empresarial especializada en estrategia, optimización de procesos y desarrollo de equipos.',
      image: '/consultora.png',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/Patrick9913/landingmodelone',
      live: 'https://landingmodelone.vercel.app/',
    },
    {
      id: 4,
      title: 'Escuela Margarita Mazza - Institucional',
      description: 'Sitio web institucional para escuela secundaria con 99 años de historia. Incluye información académica, modalidades, eventos y sistema de contacto.',
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
    const interval = setInterval(nextProject, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = projects[currentProject];

  return (
    <section id="projects" className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Carrusel Container */}
      <div className="h-full w-full relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          {/* Mobile Layout */}
          <div className="block md:hidden w-full px-4">
            <div className="text-center">
              {/* Project Image - Mobile */}
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden shadow-2xl mx-auto max-w-sm">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Project Info - Mobile */}
              <div className="text-white">
                <h3 className="text-xl font-bold mb-3 leading-tight">
                  {current.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed px-2">
                  {current.description}
                </p>
                
                {/* Solo las 2 tecnologías principales en móvil */}
                <div className="flex justify-center gap-2 mb-4">
                  {current.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Botones más pequeños en móvil */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={current.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-sm"
                  >
                    <FaGithub size={16} className="mr-1" />
                    Código
                  </a>
                  <a
                    href={current.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium text-sm"
                  >
                    <GoLinkExternal size={16} className="mr-1" />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block w-full">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              {/* Project Info */}
              <div className="text-white">
                <h3 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                  {current.title}
                </h3>
                <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                  {current.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {current.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <a
                    href={current.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium"
                  >
                    <FaGithub size={20} className="mr-2" />
                    Ver Código
                  </a>
                  <a
                    href={current.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium"
                  >
                    <GoLinkExternal size={20} className="mr-2" />
                    Ver Demo
                  </a>
                </div>
              </div>

              {/* Project Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevProject}
          className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <FaChevronLeft size={16} className="md:hidden" />
          <FaChevronLeft size={20} className="hidden md:block" />
        </button>
        <button
          onClick={nextProject}
          className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <FaChevronRight size={16} className="md:hidden" />
          <FaChevronRight size={20} className="hidden md:block" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProject(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentProject
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Project Counter */}
        <div className="absolute top-4 md:top-8 right-4 md:right-8 z-20 text-white">
          <span className="text-sm md:text-lg font-medium">
            {currentProject + 1} / {projects.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Projects;