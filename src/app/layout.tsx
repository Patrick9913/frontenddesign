import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Patrick Ordoñez - Desarrollador Front End | React, Next.js, TypeScript",
    template: "%s | Patrick Ordoñez - Desarrollador Front End"
  },
  description: "Desarrollador Front End especializado en React, Next.js y TypeScript. Más de 3 años de experiencia creando aplicaciones web modernas y responsivas. Portfolio con proyectos destacados en desarrollo web.",
  keywords: [
    "desarrollador front end",
    "react developer",
    "nextjs developer", 
    "typescript developer",
    "desarrollador web",
    "programador frontend",
    "desarrollo web argentina",
    "portfolio desarrollador",
    "react portfolio",
    "nextjs portfolio"
  ],
  authors: [{ name: "Patrick Ordoñez" }],
  creator: "Patrick Ordoñez",
  publisher: "Patrick Ordoñez",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://patrick-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://patrick-portfolio.vercel.app',
    title: 'Patrick Ordoñez - Desarrollador Front End',
    description: 'Desarrollador Front End especializado en React, Next.js y TypeScript. Portfolio con proyectos destacados en desarrollo web moderno.',
    siteName: 'Patrick Ordoñez Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Patrick Ordoñez - Desarrollador Front End',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrick Ordoñez - Desarrollador Front End',
    description: 'Desarrollador Front End especializado en React, Next.js y TypeScript. Portfolio con proyectos destacados.',
    images: ['/og-image.png'],
    creator: '@patrick_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#111827" />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Patrick Ordoñez",
              "jobTitle": "Desarrollador Front End",
              "description": "Desarrollador Front End especializado en React, Next.js y TypeScript",
              "url": "https://patrick-portfolio.vercel.app",
              "image": "https://patrick-portfolio.vercel.app/og-image.png",
              "sameAs": [
                "https://github.com/Patrick9913",
                "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Buenos Aires",
                "addressCountry": "Argentina"
              },
              "email": "patrickyoel13@gmail.com",
              "telephone": "+54 11 4046 8176",
              "knowsAbout": [
                "React",
                "Next.js", 
                "TypeScript",
                "JavaScript",
                "HTML",
                "CSS",
                "Tailwind CSS",
                "Firebase",
                "SQL"
              ],
              "alumniOf": "Desarrollo Web con orientación en React",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
