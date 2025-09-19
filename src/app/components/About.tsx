import React from 'react';
import { FaCode } from "react-icons/fa6";
import { BiSolidZap } from "react-icons/bi";
import { BiSolidCoffee } from "react-icons/bi";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre mí
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Desarrollador apasionado por crear experiencias digitales excepcionales
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Con más de 3 años de experiencia en desarrollo front-end, me especializo en crear 
              aplicaciones web modernas y responsivas utilizando las últimas tecnologías. 
              Mi enfoque está en escribir código limpio, escalable y mantenible.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Disfruto transformar ideas creativas en soluciones digitales funcionales, 
              siempre buscando la mejor experiencia de usuario posible.
            </p>
            <a
              href="/cv.pdf"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
            >
              Descargar CV
            </a>
          </div>

          <div className="grid gap-6">
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaCode className="text-blue-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">Desarrollo Limpio</h4>
              </div>
              <p className="text-gray-600">
                Código bien estructurado, comentado y siguiendo las mejores prácticas de la industria.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <BiSolidZap className="text-yellow-600 mr-3" />
                <h4 className="text-xl font-semibold text-gray-900">Rendimiento</h4>
              </div>
              <p className="text-gray-600">
                Optimización constante para garantizar aplicaciones rápidas y eficientes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <BiSolidCoffee className="text-brown-600 mr-3" size={24} />
                <h4 className="text-xl font-semibold text-gray-900">Dedicación</h4>
              </div>
              <p className="text-gray-600">
                Comprometido con el aprendizaje continuo y la mejora constante de mis habilidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;