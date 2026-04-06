"use client";

import React, { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";

export const About = () => {
  const [showCvNotice, setShowCvNotice] = useState(false);

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCvNotice(true);
  };

  return (
    <section
      id="about"
      className="py-32 bg-black text-white font-sans relative border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        {/* Título (línea decorativa tipo wireframe + encabezado existente) */}
        <header className="mb-14 md:mb-16 lg:mb-20">
          <div className="flex items-center gap-3 md:gap-4 mb-8 max-w-2xl">
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-white leading-[1.1] text-left">
            CÓDIGO QUE <br />
            <span className="font-medium text-gray-300">RESPIRA</span> DISEÑO
          </h2>
        </header>

        {/* Dos columnas: texto izquierda · composición imágenes derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 xl:gap-24 lg:items-center">
          {/* Columna izquierda: solo copy alineado a la izquierda */}
          <div className="flex flex-col gap-8 text-left min-w-0 lg:pr-4">
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 leading-relaxed">
              Mi perfil se construye en la intersección exacta entre la estructura analítica y la experiencia visual. Como estudiante de Ciencia de Datos y desarrollador web, entiendo la lógica profunda detrás del software, pero me apasiona obsesivamente cómo ese código se ve y se siente al usarlo.
            </p>
            <div className="space-y-6">
              <p className="text-base text-gray-400 leading-relaxed font-light tracking-wide">
                A través de formación universitaria, cursos intensivos y años de aprendizaje autodidacta, he cultivado un enfoque donde el diseño es el pilar central. Me motiva el uso estratégico del espacio, la tipografía y el ritmo para crear interfaces limpias y coherentes, logrando que la estética siempre acompañe al mensaje.
              </p>
              <p className="text-base text-gray-400 leading-relaxed font-light tracking-wide">
                Creo firmemente que una buena interfaz no es un simple recurso cosmético; es la capa humana que traduce sistemas y datos complejos. Cuando la precisión técnica y el diseño visual están perfectamente alineados, la experiencia se vuelve intuitiva, memorable y clara.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <a
                href="/cv.pdf"
                onClick={handleCvClick}
                className="group inline-flex w-fit items-center gap-6 px-10 py-5 border border-white/20 text-white text-xs md:text-sm font-light tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
              >
                Descargar CV
                <HiOutlineDownload className="text-2xl group-hover:-translate-y-1 transition-transform" />
              </a>
              {showCvNotice && (
                <p
                  className="text-xs md:text-sm font-light tracking-wide text-gray-500"
                  role="status"
                >
                  Currículum actualizándose.
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha: rectángulos superpuestos (wireone atrás / wiretwo delante) */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 lg:justify-self-end aspect-[4/5] min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] lg:aspect-[5/6]">
            {/* wireone: escala en el marco (no zoom interno); reposo B/N → color al hover */}
            <div className="group/wireone absolute top-0 left-0 w-[58%] sm:w-[56%] h-[78%] z-[1] border border-white/10 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] origin-bottom-left scale-100 transition-all duration-500 ease-in-out hover:scale-[1.015] hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.52)] hover:border-white/14 motion-reduce:scale-100 motion-reduce:transition-none">
              <img
                src="/wireone.png"
                alt=""
                className="w-full h-full object-cover object-center grayscale contrast-[1.02] transition-[filter] duration-500 ease-in-out group-hover/wireone:grayscale-0 group-hover/wireone:contrast-100 motion-reduce:grayscale-0 motion-reduce:transition-none"
                loading="lazy"
              />
            </div>
            {/* wiretwo: misma lógica; origen abajo-derecha para que el scale se sienta natural */}
            <div className="group/wiretwo absolute bottom-0 right-0 w-[58%] sm:w-[56%] h-[72%] z-[2] border border-white/15 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] origin-bottom-right scale-100 transition-all duration-500 ease-in-out hover:scale-[1.015] hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.48)] hover:border-white/18 motion-reduce:scale-100 motion-reduce:transition-none">
              <img
                src="/wiretwo.png"
                alt=""
                className="w-full h-full object-cover object-center grayscale contrast-[1.02] transition-[filter] duration-500 ease-in-out group-hover/wiretwo:grayscale-0 group-hover/wiretwo:contrast-100 motion-reduce:grayscale-0 motion-reduce:transition-none"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
