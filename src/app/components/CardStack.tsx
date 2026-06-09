"use client";

import React, { useState, useEffect, useRef } from "react";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import { IoMdClose } from "react-icons/io";

interface CardStackProps {
  setActiveSection: (index: number) => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
}

interface CardItem {
  id: string;
  index: string;
  label: string;
  previewTitle: string;
  previewSubtitle: string;
  previewDesc: string;
  component: React.ComponentType;
}

const CARDS: CardItem[] = [
  {
    id: "hero",
    index: "00",
    label: "Inicio",
    previewTitle: "FRONT END",
    previewSubtitle: "DEVELOPER",
    previewDesc: "Especializado en React, Next.js y TypeScript. Creando interfaces inmersivas, esculpiendo componentes y diseñando experiencias de usuario dinámicas.",
    component: Hero,
  },
  {
    id: "about",
    index: "01",
    label: "Sobre mí",
    previewTitle: "CÓDIGO QUE",
    previewSubtitle: "RESPIRA DISEÑO",
    previewDesc: "Mi perfil se construye en la intersección exacta entre la estructura analítica y la experiencia visual. Estudiante de Ciencia de Datos y diseñador web.",
    component: About,
  },
  {
    id: "experience",
    index: "02",
    label: "Formación",
    previewTitle: "TRAYECTORIA",
    previewSubtitle: "ACADÉMICA",
    previewDesc: "Ciencia de Datos en la Universidad de Buenos Aires y formación continua autodidacta sobre el ecosistema técnico y experiencia de usuario.",
    component: Experience,
  },
  {
    id: "skills",
    index: "03",
    label: "Habilidades",
    previewTitle: "STACK",
    previewSubtitle: "TÉCNICO",
    previewDesc: "Interfaces modernas, APIs robustas y flujos de despliegue optimizados. Especialización en el ecosistema React moderno y diseño estructurado.",
    component: Skills,
  },
  {
    id: "projects",
    index: "04",
    label: "Proyectos",
    previewTitle: "DEMOS",
    previewSubtitle: "REPRESENTATIVAS",
    previewDesc: "Galería de trabajos interactivos con Next.js, TypeScript y Tailwind, diseñados con extremo detalle visual y funcional.",
    component: Projects,
  },
  {
    id: "contact",
    index: "05",
    label: "Contacto",
    previewTitle: "HABLEMOS",
    previewSubtitle: "AHORA",
    previewDesc: "¿Estás buscando integrar a alguien a tu equipo o querés charlar sobre diseño y tecnología? Escribime ahora.",
    component: Contact,
  },
];

export const CardStack = ({ setActiveSection, expandedCardId, setExpandedCardId }: CardStackProps) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Configure card references array size
  if (cardRefs.current.length !== CARDS.length) {
    cardRefs.current = Array(CARDS.length).fill(null);
  }

  // Monitor scroll to calculate stacked elements and active section
  useEffect(() => {
    if (expandedCardId) return; // Disable sticky calculations when expanded

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let highestStuckIndex = 0;

          cardRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const rect = ref.getBoundingClientRect();
            // Calculate the theoretical sticky top threshold for this index
            const threshold = window.innerHeight * 0.05 + index * 48;

            // If card top is close to or above the sticky threshold
            if (rect.top <= threshold + 8) {
              highestStuckIndex = index;
            }
          });

          setActiveCardIndex(highestStuckIndex);
          setActiveSection(highestStuckIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [expandedCardId, setActiveSection]);

  // Listen to navigation events from Navbar
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>;
      const { sectionId } = customEvent.detail;
      const index = CARDS.findIndex((c) => c.id === sectionId);

      if (index !== -1) {
        const cardElement = cardRefs.current[index];
        if (cardElement) {
          // Scroll target position: we want the card's top to sit at its sticky threshold
          const threshold = window.innerHeight * 0.05 + index * 48;
          const elementWorldPos = cardElement.getBoundingClientRect().top + window.scrollY;
          
          window.scrollTo({
            top: elementWorldPos - threshold + 2,
            behavior: "smooth",
          });

          // Expand the card after smooth scroll finishes
          if (sectionId !== "hero") {
            setTimeout(() => {
              setExpandedCardId(sectionId);
            }, 600);
          } else {
            setExpandedCardId(null);
          }
        }
      }
    };

    window.dispatchEvent(new CustomEvent("nav-to-section")); // Keep listener registered
    window.addEventListener("nav-to-section", handleNav);
    return () => window.removeEventListener("nav-to-section", handleNav);
  }, []);

  // Keyboard shortcut listener for ESC to close expanded card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedCardId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Control body overflow when modal is active
  useEffect(() => {
    if (expandedCardId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedCardId]);

  return (
    <div className="card-stack-container max-w-5xl mx-auto px-4 md:px-8 mt-4">
      {CARDS.map((card, index) => {
        const isStuck = index < activeCardIndex;
        const depth = activeCardIndex - index;

        // Sticky styles calculation based on current stack state
        const stickyTop = `calc(5vh + ${index * 48}px)`;

        // 3D transform properties for cards stacked underneath the active card
        let transformStyle = "scale(1) translateY(0px)";
        let opacityStyle = "1";

        if (isStuck && !expandedCardId) {
          const scale = 1 - depth * 0.018;
          const yOffset = -depth * 10;
          transformStyle = `scale(${scale}) translateY(${yOffset}px)`;
          opacityStyle = `${1 - depth * 0.08}`;
        }

        const isHero = card.id === "hero";
        const Component = card.component;

        return (
          <div
            key={card.id}
            id={`card-${card.id}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="card-stack-item cursor-pointer relative"
            style={{
              top: stickyTop,
              transform: transformStyle,
              opacity: opacityStyle,
              zIndex: 10 + index,
              backgroundColor: isHero ? "transparent" : "#050505",
            }}
            onClick={() => {
              if (isHero) {
                // Clicking hero scrolls to top
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                setExpandedCardId(card.id);
              }
            }}
          >
            {/* Overlay de oscurecimiento acelerado por hardware (reemplaza filter: brightness) */}
            {isStuck && !expandedCardId ? (
              <div 
                className="absolute inset-0 bg-black pointer-events-none z-20 transition-opacity duration-500"
                style={{ opacity: Math.min(depth * 0.15, 0.65) }}
              />
            ) : null}

            {/* Header (Always Visible at Top when Stacked) */}
            <header className="h-12 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0a0a0a] select-none">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] font-light tracking-[0.2em] text-white/45">
                  [ {card.index} ]
                </span>
                <span className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/75">
                  {card.label}
                </span>
              </div>
              {!isHero && (
                <span className="font-mono text-[9px] font-light tracking-[0.15em] text-white/30 uppercase group-hover:text-white/60">
                  [ VER DETALLES ]
                </span>
              )}
            </header>

            {/* Preview Body (Only shown when not expanded) */}
            {isHero ? (
              // Hero component handles its own full display
              <div className="h-[calc(100%-3rem)] overflow-hidden">
                <Component />
              </div>
            ) : (
              // Structured Preview layout for internal sections
              <div className="h-[calc(100%-3rem)] flex flex-col justify-between p-8 md:p-12 text-left relative z-10 bg-gradient-to-b from-[#050505] to-[#000000]">
                {/* Floating graphic wireframe overlay in preview for visual style */}
                <div 
                  className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.03] pointer-events-none bg-cover bg-right bg-no-repeat"
                  style={{ backgroundImage: `url('/wireone.png')` }}
                  aria-hidden
                />

                <div className="max-w-xl">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 block mb-6">
                    Preview
                  </span>
                  <h2 className="text-4xl md:text-6xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase mb-4">
                    {card.previewTitle}
                    <br />
                    <span className="font-medium text-white/40">{card.previewSubtitle}</span>
                  </h2>
                  <div className="w-8 h-px bg-white/[0.08] my-6" />
                  <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide">
                    {card.previewDesc}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
                    CLIC PARA AMPLIAR HOJA
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 transition-colors duration-300">
                    <span className="text-white text-base">↗</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Full Screen Expanded Overlay (Frosted glass cinematic panel) */}
      {expandedCardId && (() => {
        const activeCard = CARDS.find((c) => c.id === expandedCardId);
        if (!activeCard) return null;
        const ExpandedComponent = activeCard.component;

        return (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl overflow-y-auto expanded-content-scroll flex flex-col">
            {/* Header / Actions Panel */}
            <div className="sticky top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.08] px-8 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/40">
                  [ {activeCard.index} ]
                </span>
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/80">
                  {activeCard.label}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCardId(null);
                }}
                className="group flex items-center gap-3 px-4 py-2 border border-white/10 hover:border-white/30 bg-transparent text-[10px] font-mono tracking-[0.15em] uppercase text-white/60 hover:text-white transition-all duration-300"
                aria-label="Cerrar detalles"
              >
                <span>[ ESC ] CERRAR</span>
                <IoMdClose className="h-4 w-4" />
              </button>
            </div>

            {/* Core Component Content */}
            <main className="flex-grow w-full relative">
              <ExpandedComponent />
            </main>

            {/* Sutil Footer of Expanded Card */}
            <footer className="py-12 border-t border-white/[0.08] bg-black/50 text-center select-none">
              <button
                type="button"
                onClick={() => setExpandedCardId(null)}
                className="font-mono text-[10px] tracking-[0.2em] text-white/40 hover:text-white/80 transition-colors duration-300"
              >
                ← VOLVER AL PORTAFOLIO DE HOJAS
              </button>
            </footer>
          </div>
        );
      })()}
    </div>
  );
};

export default CardStack;
