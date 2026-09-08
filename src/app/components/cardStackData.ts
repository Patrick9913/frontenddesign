import type { ComponentType } from "react";
import Hero from "./Hero";
import About from "./About";
import Tools from "./Tools";
import Works from "./Works";
import Contact from "./Contact";

export interface CardItem {
  id: string;
  index: string;
  label: string;
  component: ComponentType;
}

export const CARDS: CardItem[] = [
  { id: "home", index: "00", label: "Inicio", component: Hero },
  { id: "about", index: "01", label: "Sobre mí", component: About },
  { id: "tools", index: "02", label: "Herramientas", component: Tools },
  { id: "works", index: "03", label: "Proyectos", component: Works },
  { id: "contact", index: "04", label: "Contacto", component: Contact },
];
