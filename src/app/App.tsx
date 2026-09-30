import Hero from "./components/Hero";
import About from "./components/About";
import Tools from "./components/Tools";
import Works from "./components/Works";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";
import { NavScrollListener } from "./components/NavScrollListener";

export const App = () => {
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden bg-[#050505] font-sans text-white antialiased">
      <NavScrollListener />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Tools />
        <Works />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
