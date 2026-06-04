"use client";

import React, { useEffect, useRef, useState } from "react";
import { setScenePointer } from "../scene/sceneStore";

export const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setScenePointer(mouseX, mouseY);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      }
    };

    const animate = () => {
      outlineX += (mouseX - outlineX) * 0.35;
      outlineY += (mouseY - outlineY) * 0.35;
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate3d(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%), 0)`;
      }
      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    const animId = requestAnimationFrame(animate);
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
      <style
        dangerouslySetInnerHTML={{
          __html: `.custom-cursor-active,.custom-cursor-active *{cursor:none!important}`,
        }}
      />
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(245,200,66,0.12)_0%,transparent_70%)] mix-blend-screen motion-reduce:hidden"
        aria-hidden
      />
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-white pointer-events-none mix-blend-difference transition-opacity duration-300 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        ref={cursorOutlineRef}
        className={`fixed top-0 left-0 z-[9998] flex items-center justify-center rounded-full pointer-events-none mix-blend-difference transition-[width,height,background-color,border-color] duration-300 ease-out ${
          isHovering
            ? "h-16 w-16 border-transparent bg-white mix-blend-difference"
            : "h-8 w-8 border border-white/50 bg-transparent"
        }`}
      >
        <span className={`text-[8px] font-bold uppercase tracking-widest text-black transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}>
          Click
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
