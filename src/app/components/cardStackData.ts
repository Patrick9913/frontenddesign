import type { ComponentType } from "react";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";

export interface CardItem {
  id: string;
  index: string;
  label: string;
  previewTitle: string;
  previewSubtitle: string;
  previewDesc: string;
  component: ComponentType;
}

export const CARDS: CardItem[] = [
  {
    id: "hero",
    index: "00",
    label: "Inicio",
    previewTitle: "FRONT END",
    previewSubtitle: "DEVELOPER",
    previewDesc:
      "Especializado en React, Next.js y TypeScript. Creando interfaces inmersivas, esculpiendo componentes y diseñando experiencias de usuario dinámicas.",
    component: Hero,
  },
  {
    id: "about",
    index: "01",
    label: "Sobre mí",
    previewTitle: "CÓDIGO QUE",
    previewSubtitle: "RESPIRA DISEÑO",
    previewDesc:
      "Mi perfil se construye en la intersección exacta entre la estructura analítica y la experiencia visual. Estudiante de Ciencia de Datos y diseñador web.",
    component: About,
  },
  {
    id: "experience",
    index: "02",
    label: "Formación",
    previewTitle: "TRAYECTORIA",
    previewSubtitle: "ACADÉMICA",
    previewDesc:
      "Ciencia de Datos en la Universidad de Buenos Aires y formación continua autodidacta sobre el ecosistema técnico y experiencia de usuario.",
    component: Experience,
  },
  {
    id: "skills",
    index: "03",
    label: "Habilidades",
    previewTitle: "STACK",
    previewSubtitle: "TÉCNICO",
    previewDesc:
      "Interfaces modernas, APIs robustas y flujos de despliegue optimizados. Especialización en el ecosistema React moderno y diseño estructurado.",
    component: Skills,
  },
  {
    id: "projects",
    index: "04",
    label: "Proyectos",
    previewTitle: "DEMOS",
    previewSubtitle: "REPRESENTATIVAS",
    previewDesc:
      "Galería de trabajos interactivos con Next.js, TypeScript y Tailwind, diseñados con extremo detalle visual y funcional.",
    component: Projects,
  },
  {
    id: "contact",
    index: "05",
    label: "Contacto",
    previewTitle: "HABLEMOS",
    previewSubtitle: "AHORA",
    previewDesc:
      "¿Estás buscando integrar a alguien a tu equipo o querés charlar sobre diseño y tecnología? Escribime ahora.",
    component: Contact,
  },
  {
    id: "footer",
    index: "06",
    label: "Cierre",
    previewTitle: "PATRICK",
    previewSubtitle: "ORDOÑEZ",
    previewDesc:
      "Navegación, servicios y redes. Todo el cierre del portfolio en una última hoja del stack.",
    component: Footer,
  },
];
