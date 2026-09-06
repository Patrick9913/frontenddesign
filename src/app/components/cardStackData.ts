import type { ComponentType } from "react";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";

export interface CardItem {
  id: string;
  index: string;
  label: string;
  component: ComponentType;
}

export const CARDS: CardItem[] = [
  {
    id: "hero",
    index: "00",
    label: "Inicio",
    component: Hero,
  },
  {
    id: "about",
    index: "01",
    label: "Sobre mí",
    component: About,
  },
  {
    id: "projects",
    index: "02",
    label: "Proyectos",
    component: Projects,
  },
  {
    id: "contact",
    index: "03",
    label: "Contacto",
    component: Contact,
  },
];
