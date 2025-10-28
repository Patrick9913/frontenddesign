import React from 'react';

export const Skills = () => {
  const skills = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'HTML/CSS', level: 95 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Git/GitHub', level: 90 },
  ];

  const tools = [
    'VS Code', 'Figma', 'Postman', 'Chrome DevTools',
    'npm/yarn', 'Webpack', 'Vite', 'Vercel',
    'ESLint', 'Prettier', 'Storybook', 'Jest',
    'React DevTools', 'Redux DevTools', 'Insomnia', 'Docker',
    'GitHub Actions', 'Netlify', 'Firebase', 'MongoDB'
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Habilidades
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Tecnologías</h3>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.name} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Herramientas</h3>
            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center hover:scale-105"
                >
                  <span className="font-medium text-gray-900">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;