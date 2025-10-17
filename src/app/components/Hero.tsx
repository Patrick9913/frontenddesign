import React from 'react';
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Navbar } from './Navbar';

export const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-300 mb-6 leading-tight">
            Desarrollador
            <span className="block text-gray-600">Front End</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Especializado en React, creando experiencias digitales modernas y funcionales
          </p>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/Patrick9913"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:tu@email.com"
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110"
          >
            <IoMdMail />
          </a>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="#projects"
            className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-medium hover:scale-105"
          >
            Ver Proyectos
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 rounded-full bg-gray-900 text-white transition-all duration-300 font-medium hover:scale-105"
          >
            Contactar
          </a>
        </div>
        <div className="mt-16 animate-bounce">
          <a href="#about">
            <IoIosArrowDown className="text-gray-400 hover:text-gray-600 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;