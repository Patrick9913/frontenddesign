import React from 'react';
import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiJavascript } from 'react-icons/si';

export const Skills = () => {
  const scatteredSkills = [
    { icon: <FaReact className="text-4xl md:text-5xl" />, name: 'React', posClass: 'top-[5%] left-[5%]', delay: '0s' },
    { icon: <SiTypescript className="text-4xl md:text-5xl" />, name: 'TypeScript', posClass: 'top-[20%] left-[45%]', delay: '2s' },
    { icon: <SiNextdotjs className="text-4xl md:text-5xl" />, name: 'Next.js', posClass: 'top-[45%] right-[5%]', delay: '1s' },
    { icon: <SiTailwindcss className="text-4xl md:text-5xl" />, name: 'Tailwind CSS', posClass: 'top-[75%] left-[20%]', delay: '0.5s' },
    { icon: <SiJavascript className="text-4xl md:text-5xl" />, name: 'JavaScript', posClass: 'top-[65%] right-[25%]', delay: '1.5s' },
  ];

  return (
    <section id="skills" className="py-32 bg-black text-white font-sans border-t border-white/10 relative overflow-hidden">

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left: Text Content */}
          <div className="z-10 relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase mb-8">
              Habilidades
            </h2>
            <div className="w-12 h-[1px] bg-white/20 mb-10"></div>
            <p className="text-sm md:text-base font-light text-white/50 leading-relaxed max-w-md tracking-wide">
              Especializado en el ecosistema React moderno. Combino tecnologías sólidas con diseño meticuloso para construir interfaces fluidas, escalables y visualmente excepcionales. El rendimiento y la atención al detalle guián cada línea de código.
            </p>
          </div>

          {/* Right: Scattered Circles Map (Responsive Aspect Ratio) */}
          <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            {scatteredSkills.map((skill, index) => (
              <div
                key={index}
                className={`absolute ${skill.posClass} w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center transition-all duration-500 hover:bg-white/10 hover:border-white/30 group`}
                style={{ animation: `float 6s ease-in-out infinite`, animationDelay: skill.delay }}
              >
                <div className="text-white/40 group-hover:text-white transition-colors duration-500 group-hover:scale-110">
                  {skill.icon}
                </div>

                {/* Tooltip on hover */}
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-light tracking-[0.2em] uppercase text-white/70">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />
    </section>
  );
};

export default Skills;
