import React from 'react';
import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiJavascript } from 'react-icons/si';

export const Skills = () => {
  const scatteredSkills = [
    {
      icon: <FaReact className="text-4xl md:text-5xl" />,
      name: 'React',
      posClass: 'top-[5%] left-[5%]',
      delay: '0s',
      hoverClass: 'hover:bg-cyan-500/15 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]',
      iconHoverClass: 'group-hover:text-cyan-300',
    },
    {
      icon: <SiTypescript className="text-4xl md:text-5xl" />,
      name: 'TypeScript',
      posClass: 'top-[20%] left-[45%]',
      delay: '2s',
      hoverClass: 'hover:bg-blue-500/15 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(96,165,250,0.35)]',
      iconHoverClass: 'group-hover:text-blue-300',
    },
    {
      icon: <SiNextdotjs className="text-4xl md:text-5xl" />,
      name: 'Next.js',
      posClass: 'top-[45%] right-[5%]',
      delay: '1s',
      hoverClass: 'hover:bg-zinc-200/10 hover:border-zinc-200/50 hover:shadow-[0_0_30px_rgba(244,244,245,0.25)]',
      iconHoverClass: 'group-hover:text-zinc-100',
    },
    {
      icon: <SiTailwindcss className="text-4xl md:text-5xl" />,
      name: 'Tailwind CSS',
      posClass: 'top-[75%] left-[20%]',
      delay: '0.5s',
      hoverClass: 'hover:bg-sky-500/15 hover:border-sky-400/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]',
      iconHoverClass: 'group-hover:text-sky-300',
    },
    {
      icon: <SiJavascript className="text-4xl md:text-5xl" />,
      name: 'JavaScript',
      posClass: 'top-[65%] right-[25%]',
      delay: '1.5s',
      hoverClass: 'hover:bg-yellow-400/15 hover:border-yellow-300/60 hover:shadow-[0_0_30px_rgba(253,224,71,0.35)]',
      iconHoverClass: 'group-hover:text-yellow-300',
    },
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
                className={`absolute ${skill.posClass} ${skill.hoverClass} w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center transition-all duration-500 group`}
                style={{ animation: `float 6s ease-in-out infinite`, animationDelay: skill.delay }}
              >
                <div className={`text-white/40 ${skill.iconHoverClass} transition-all duration-500 group-hover:scale-110`}>
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
