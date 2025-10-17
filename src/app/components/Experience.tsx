import React from 'react';
import { FaGraduationCap, FaCode, FaReact, FaDatabase } from "react-icons/fa";
import { SiTypescript, SiNextdotjs } from "react-icons/si";

export const Experience = () => {
  const experiences = [
    {
      year: "2023",
      title: "Curso Desarrollo Web",
      icon: <FaCode className="text-blue-600 text-2xl" />,
      description: "Fundamentos de desarrollo web moderno"
    },
    {
      year: "2023",
      title: "Curso JavaScript",
      icon: <FaCode className="text-yellow-500 text-2xl" />,
      description: "JavaScript moderno y ES6+"
    },
    {
      year: "2023",
      title: "Carrera Desarrollo Web con orientación en React",
      icon: <FaReact className="text-cyan-500 text-2xl" />,
      description: "Especialización en React y desarrollo frontend avanzado"
    },
    {
      year: "2023",
      title: "Base de datos Firebase y SQL",
      icon: <FaDatabase className="text-orange-600 text-2xl" />,
      description: "Gestión de bases de datos NoSQL y SQL"
    },
    {
      year: "2024",
      title: "TypeScript",
      icon: <SiTypescript className="text-blue-700 text-2xl" />,
      description: "TypeScript avanzado para desarrollo tipado y escalable"
    },
    {
      year: "2024",
      title: "NextJS",
      icon: <SiNextdotjs className="text-black text-2xl" />,
      description: "Framework de React para aplicaciones web modernas con SSR"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Formación
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        <div className="relative">
          {/* Línea vertical en el centro (solo visible en desktop) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Contenido */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                      {index % 2 !== 0 && <div className="md:hidden">{exp.icon}</div>}
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {exp.year}
                      </span>
                      {index % 2 === 0 && <div className="md:hidden">{exp.icon}</div>}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Círculo central con icono */}
                <div className="hidden md:flex w-2/12 justify-center relative z-10">
                  <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg">
                    {exp.icon}
                  </div>
                </div>

                {/* Espacio vacío en el otro lado */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Ícono de graduación al final */}
        <div className="flex justify-center mt-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
            <FaGraduationCap className="text-white text-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

