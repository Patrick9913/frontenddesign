import React from 'react';

export const Skills = () => {
  const technologiesByArea = [
    {
      area: 'Frontend',
      icon: 'frontend',
      description: 'Interfaces modernas, accesibles y responsivas.',
      techs: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
    },
    {
      area: 'Backend y Datos',
      icon: 'backend',
      description: 'APIs, lógica de negocio e integración de servicios.',
      techs: ['Node.js', 'Firebase', 'MongoDB'],
    },
    {
      area: 'Testing y Calidad',
      icon: 'testing',
      description: 'Código mantenible con foco en estándares y buenas prácticas.',
      techs: ['Jest', 'ESLint', 'Prettier', 'Storybook'],
    },
    {
      area: 'Flujo de Trabajo',
      icon: 'workflow',
      description: 'Versionado, despliegue y colaboración continua.',
      techs: ['Git/GitHub', 'GitHub Actions', 'Docker', 'Vercel', 'Netlify'],
    },
  ];

  const renderCategoryIcon = (icon: string) => {
    if (icon === 'frontend') {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="13" rx="2"></rect>
          <path d="M8 20h8"></path>
          <path d="M12 17v3"></path>
        </svg>
      );
    }

    if (icon === 'backend') {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="7" ry="3"></ellipse>
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"></path>
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>
        </svg>
      );
    }

    if (icon === 'testing') {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 3h5v5"></path>
        <path d="M8 21H3v-5"></path>
        <path d="M21 3l-7 7"></path>
        <path d="M3 21l7-7"></path>
      </svg>
    );
  };

  return (
    <section id="skills" className="py-20 bg-gray-100/62 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tecnologías
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        <div className="space-y-5">
          {technologiesByArea.map((group) => (
            <div key={group.area} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{group.area}</h4>
                <span className="text-gray-500">{renderCategoryIcon(group.icon)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-2">
                {group.techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;