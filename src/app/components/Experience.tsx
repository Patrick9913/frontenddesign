import React from 'react';

export const Experience = () => {
  const formation = [
    {
      id: "01",
      title: "Ciencia de Datos",
      institution: "Universidad de Buenos Aires (UBA)",
      period: "Actualidad",
      description: "Formación académica enfocada en el pensamiento lógico, análisis estructural y desarrollo algorítmico profundo. Una base sólida para la resolución de problemas complejos."
    },
    {
      id: "02",
      title: "Desarrollo de Software",
      institution: "Coderhouse",
      period: "Completado",
      description: "Cursos intensivos enfocados en desarrollo web y programación. Práctica directa sobre el ecosistema moderno y la construcción de proyectos funcionales."
    },
    {
      id: "03",
      title: "Formación Autodidacta",
      institution: "Desarrollo Visual y Técnico",
      period: "Múltiples años",
      description: "Años de exploración independiente y aprendizaje continuo en tecnologías, experiencia de usuario y diseño de interfaces. Construyendo mi propio criterio a través de la práctica."
    }
  ];

  return (
    <section id="experience" className="py-32 lg:py-48 bg-black w-full relative border-t border-white/10 text-white font-sans overflow-hidden">
      
      {/* Background Image Setup */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/newbackimage.jpg')" }}
      ></div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        
        <header className="mb-20 md:mb-32">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] text-white uppercase mt-4 md:mt-0">
            Formación
          </h2>
          <div className="w-8 md:w-12 h-[1px] bg-white/20 mt-8"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
          {formation.map((item) => (
            <div 
              key={item.id} 
              className="relative group border-t border-white/10 pt-8"
            >
              <span className="block text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-white/40 mb-6 group-hover:text-white/80 transition-colors duration-500">
                {item.id} — {item.period}
              </span>
              
              <h3 className="text-xl md:text-2xl font-light tracking-wide mb-3 text-white group-hover:text-gray-200 transition-colors duration-500 line-clamp-2">
                {item.title}
              </h3>
              
              <h4 className="text-xs font-medium tracking-[0.1em] text-gray-400 mb-6 uppercase">
                {item.institution}
              </h4>
              
              <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed tracking-wide">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Experience;

