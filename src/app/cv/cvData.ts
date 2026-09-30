export type CvContent = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  profile: string;
  experience: readonly {
    org: string;
    location: string;
    role: string;
    period: string;
    bullets: readonly string[];
  }[];
  skills: readonly string[];
  education: readonly {
    title: string;
    place: string;
    period: string;
  }[];
};

export const cv: CvContent = {
  name: "Patrick Ordoñez",
  role: "Full Stack Developer",
  location: "Buenos Aires, Argentina",
  email: "patrickyoel13@gmail.com",
  phone: "+54 11 4046 8176",
  website: "https://patrick-portfolio.vercel.app",
  github: "https://github.com/Patrick9913",
  linkedin: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
  profile:
    "Full Stack Developer (React, Next.js, TypeScript). Diseño e implemento sitios y plataformas de gestión para municipio, industria, gastronomía y educación. Co-founder de Lumino Campus.",
  experience: [
    {
      org: "Lumino Campus",
      location: "Buenos Aires",
      role: "Co-founder · Full Stack",
      period: "2026 — Actualidad",
      bullets: [
        "Diseño e implemento la interfaz de una plataforma integral de gestión académica.",
        "Defino producto y UX en paralelo al desarrollo front (React, Next.js, TypeScript).",
        "Unifico flujos de alumnos, docentes y administración en un solo producto.",
      ],
    },
    {
      org: "Grupo Sheina",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Actualidad",
      bullets: [
        "Plataforma de gestión gastronómica: menús, logística de transportes en tiempo real, fichas de stock y arqueos.",
        "Unifico cocina, logística y administración en una sola interfaz de operación diaria.",
      ],
    },
    {
      org: "Colegio Wolfsohn",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Actualidad",
      bullets: [
        "Sistema de gestión de comedor: cargas, seguimiento y operación diaria.",
        "Plataforma interna de uso cotidiano para el equipo de la institución.",
      ],
    },
    {
      org: "Aditamentos Piazza",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Actualidad",
      bullets: [
        "Armé el sitio comercial y una plataforma de gestión operativa y administrativa.",
        "Unifiqué presencia web y operación interna con React y Next.js.",
      ],
    },
    {
      org: "BNS Abogados",
      location: "CABA",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Actualidad",
      bullets: [
        "Sitio web del estudio: asesoría legal para empresas en CABA.",
      ],
    },
    {
      org: "Municipalidad de Calingasta",
      location: "San Juan",
      role: "Full Stack Developer · Freelance",
      period: "2024 — Actualidad",
      bullets: [
        "Desarrollé el sitio institucional y una plataforma interna de gestión municipal.",
        "Organicé trámites y operación diaria en una interfaz clara para uso interno.",
      ],
    },
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Firebase",
    "Git",
    "Vercel",
  ],
  education: [
    {
      title: "Ciencia de Datos",
      place: "Universidad de Buenos Aires (UBA)",
      period: "En curso",
    },
    {
      title: "Desarrollo de Software",
      place: "Coderhouse",
      period: "Completado",
    },
  ],
};

export const cvEn: CvContent = {
  name: "Patrick Ordoñez",
  role: "Full Stack Developer",
  location: "Buenos Aires, Argentina",
  email: "patrickyoel13@gmail.com",
  phone: "+54 11 4046 8176",
  website: "https://patrick-portfolio.vercel.app",
  github: "https://github.com/Patrick9913",
  linkedin: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/",
  profile:
    "Full Stack Developer (React, Next.js, TypeScript). I design and build websites and management platforms for municipalities, industry, hospitality, and education. Co-founder of Lumino Campus.",
  experience: [
    {
      org: "Lumino Campus",
      location: "Buenos Aires",
      role: "Co-founder · Full Stack",
      period: "2026 — Present",
      bullets: [
        "Design and build the interface of an end-to-end academic management platform.",
        "Shape product and UX alongside front-end development (React, Next.js, TypeScript).",
        "Bring student, faculty, and admin workflows into a single product.",
      ],
    },
    {
      org: "Grupo Sheina",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Present",
      bullets: [
        "Hospitality management platform: menus, real-time transport logistics, inventory records, and cash reconciliations.",
        "Unite kitchen, logistics, and administration in one daily operations interface.",
      ],
    },
    {
      org: "Colegio Wolfsohn",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Present",
      bullets: [
        "Cafeteria management system: intake, tracking, and day-to-day operations.",
        "Internal platform used daily by the school team.",
      ],
    },
    {
      org: "Aditamentos Piazza",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Present",
      bullets: [
        "Built the commercial website and an operational and administrative management platform.",
        "Brought the public site and internal operations together with React and Next.js.",
      ],
    },
    {
      org: "BNS Abogados",
      location: "Buenos Aires",
      role: "Full Stack Developer · Freelance",
      period: "2025 — Present",
      bullets: [
        "Law firm website: legal advisory for companies in Buenos Aires.",
      ],
    },
    {
      org: "Municipalidad de Calingasta",
      location: "San Juan",
      role: "Full Stack Developer · Freelance",
      period: "2024 — Present",
      bullets: [
        "Built the institutional website and an internal municipal management platform.",
        "Organized procedures and daily operations into a clear interface for internal use.",
      ],
    },
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Firebase",
    "Git",
    "Vercel",
  ],
  education: [
    {
      title: "Data Science",
      place: "Universidad de Buenos Aires (UBA)",
      period: "In progress",
    },
    {
      title: "Software Development",
      place: "Coderhouse",
      period: "Completed",
    },
  ],
};
