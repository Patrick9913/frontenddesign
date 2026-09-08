"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(
        "service_kjmlf1a",
        "template_xf807za",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: "Contacto desde el portfolio",
          message: formData.message,
          to_email: "patrickyoel13@gmail.com",
        },
        "nIzwTNQpr1_X4EE_q"
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden border-t border-white/[0.02] bg-[#050505] px-8 py-32 font-sans sm:px-16 lg:px-24"
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:gap-24">
        <div className="flex w-full flex-col md:w-5/12">
          <div className="mb-12 flex flex-col items-start">
            <h2 className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              Contacto
            </h2>
            <h3 className="text-4xl font-extralight uppercase tracking-widest text-white drop-shadow-xl md:text-5xl lg:text-6xl">
              Hablemos
            </h3>
          </div>

          <p className="mb-12 text-sm font-light leading-relaxed tracking-wide text-white/60 md:text-base">
            Si estás buscando integrar a alguien a tu equipo o simplemente
            querés intercambiar ideas sobre diseño y desarrollo web, escribime.
          </p>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
                Email
              </span>
              <a
                href="mailto:patrickyoel13@gmail.com"
                className="text-sm font-light tracking-widest text-white/80 transition-colors hover:text-white"
              >
                patrickyoel13@gmail.com
              </a>
            </div>
            <div className="flex flex-col">
              <span className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
                Ubicación
              </span>
              <span className="text-sm font-light tracking-widest text-white/80">
                Buenos Aires, Argentina (Remoto)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="mb-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
                Redes
              </span>
              <div className="flex gap-6">
                <a
                  href="https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light tracking-widest text-white/80 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Patrick9913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light tracking-widest text-white/80 transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col md:mt-24 md:w-7/12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
            <div className="group relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
                className="peer w-full border-b border-white/20 bg-transparent py-4 font-light tracking-wide text-white/80 transition-colors duration-500 placeholder-transparent focus:border-white/60 focus:outline-none"
              />
              <label className="absolute left-0 top-4 text-sm font-light tracking-widest text-white/30 transition-all duration-500 peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-white/60 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/60">
                Nombre Completo
              </label>
            </div>
            <div className="group relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="peer w-full border-b border-white/20 bg-transparent py-4 font-light tracking-wide text-white/80 transition-colors duration-500 placeholder-transparent focus:border-white/60 focus:outline-none"
              />
              <label className="absolute left-0 top-4 text-sm font-light tracking-widest text-white/30 transition-all duration-500 peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-white/60 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/60">
                Correo Electrónico
              </label>
            </div>
            <div className="group relative">
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Mensaje"
                className="peer w-full resize-none border-b border-white/20 bg-transparent py-4 font-light tracking-wide text-white/80 transition-colors duration-500 placeholder-transparent focus:border-white/60 focus:outline-none"
              />
              <label className="absolute left-0 top-4 text-sm font-light tracking-widest text-white/30 transition-all duration-500 peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-white/60 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/60">
                Tu Mensaje
              </label>
            </div>

            {submitStatus === "success" ? (
              <p className="text-xs font-light uppercase tracking-[0.15em] text-white/80" role="status">
                Mensaje enviado.
              </p>
            ) : null}
            {submitStatus === "error" ? (
              <p className="text-xs font-light uppercase tracking-[0.15em] text-white/60" role="alert">
                No se pudo enviar. Probá de nuevo o escribime por email.
              </p>
            ) : null}

            <div className="mt-4 flex">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block bg-white/90 px-12 py-4 text-xs font-medium uppercase tracking-[0.2em] text-black transition-all duration-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
