"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Desactivar en dispositivos táctiles (móviles)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setIsVisible(true);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        // Centrar exactamente el punto
        cursorDotRef.current.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      }
    };

    const animate = () => {
      // Movimiento con fricción (easing) más ligero para el anillo exterior
      const distX = mouseX - outlineX;
      const distY = mouseY - outlineY;
      
      // Aumentamos el factor (de 0.15 a 0.35) para que haya MENOS delay
      outlineX += distX * 0.35;
      outlineY += distY * 0.35;

      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate3d(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%), 0)`;
      }

      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Detectar si estamos sobre un elemento clickeable
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null;

      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    
    // Iniciar loop de animación
    const animId = requestAnimationFrame(animate);

    // Inyectar clase al body para ocultar el cursor nativo de forma sutil
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-cursor-active,
        .custom-cursor-active * {
          cursor: none !important;
        }
      `}} />
      
      {/* El punto sólido central que sigue al mouse sin delay */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* El anillo que tiene un retraso (easing) */}
      <div
        ref={cursorOutlineRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out flex items-center justify-center ${
          isHovering 
            ? "w-16 h-16 bg-white border-transparent mix-blend-difference" 
            : "w-8 h-8 border-[1px] border-white/50 bg-transparent"
        }`}
      >
        <span className={`text-[8px] font-bold text-black tracking-widest uppercase transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}>
          Click
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
