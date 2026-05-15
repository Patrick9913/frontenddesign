"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SECTION_INDEX = "[ 05 ]";

const COPY = {
  overline: "Contacto",
  title: "HABLEMOS",
  accent: "AHORA",
  lead:
    "Si estás buscando integrar a alguien a tu equipo o simplemente quieres intercambiar ideas sobre diseño, desarrollo o tecnología, no dudes en escribirme.",
} as const;

type ContactDetail = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

const CONTACT_DETAILS: ContactDetail[] = [
  {
    id: "01",
    label: "Email",
    value: "patrickyoel13@gmail.com",
    href: "mailto:patrickyoel13@gmail.com",
  },
  {
    id: "02",
    label: "Teléfono",
    value: "+54 11 4046 8176",
    href: "tel:+541140468176",
  },
  {
    id: "03",
    label: "Ubicación",
    value: "Buenos Aires, Argentina (Remoto)",
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/" },
  { label: "GitHub", href: "https://github.com/Patrick9913" },
] as const;

const FORM_FIELDS = [
  { id: "name", name: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
  { id: "email", name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
  { id: "subject", name: "subject", label: "Asunto", type: "text", placeholder: "Asunto del mensaje" },
] as const;

const inputClassName =
  "w-full bg-transparent border-0 border-b border-white/[0.08] pb-4 text-[#F0F0F0] font-light text-sm md:text-base focus:outline-none focus:border-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-white/25 rounded-none";

const labelClassName =
  "block font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/50 mb-3";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const serviceId = "service_kjmlf1a";
      const templateId = "template_xf807za";
      const publicKey = "nIzwTNQpr1_X4EE_q";

      await emailjs.send(serviceId, templateId, {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "patrickyoel13@gmail.com",
      }, publicKey);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
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
      className="py-32 lg:py-48 bg-black text-[#F0F0F0] font-sans border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <header className="mb-16 md:mb-20 lg:mb-24">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 md:mb-10">
            <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {SECTION_INDEX}
            </span>
            <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
              {COPY.overline}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase">
            {COPY.title}
            <br />
            <span className="font-medium text-white/50">{COPY.accent}</span>
          </h2>

          <div className="w-8 md:w-12 h-px bg-white/[0.08] mt-8 md:mt-10" aria-hidden />

          <p className="mt-10 md:mt-12 text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide max-w-xl">
            {COPY.lead}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 xl:gap-24 border-t border-white/[0.08] pt-12 md:pt-16">
          {/* Información de contacto */}
          <div className="lg:col-span-5 flex flex-col gap-10 md:gap-12">
            {CONTACT_DETAILS.map((item) => (
              <div key={item.id} className="border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/50">
                    {item.id}
                  </span>
                  <h3 className="text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50">
                    {item.label}
                  </h3>
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm md:text-base font-light text-white/50 tracking-wide transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm md:text-base font-light text-white/50 tracking-wide">
                    {item.value}
                  </p>
                )}
              </div>
            ))}

            <div className="border-t border-white/[0.08] pt-8">
              <h3 className="text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-white/50 mb-6">
                Redes
              </h3>
              <nav className="flex flex-wrap gap-6" aria-label="Redes sociales">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-white/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#F0F0F0]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-6 lg:col-start-7 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-12 xl:pl-16 pt-12 lg:pt-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-12" noValidate>
              {FORM_FIELDS.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className={labelClassName}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    required
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className={labelClassName}>
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClassName} resize-none min-h-[120px]`}
                  placeholder="Contame sobre tu proyecto..."
                />
              </div>

              {submitStatus === "success" && (
                <p
                  className="font-mono text-[10px] font-light tracking-[0.15em] uppercase text-[#F0F0F0]"
                  role="status"
                >
                  Mensaje enviado exitosamente.
                </p>
              )}
              {submitStatus === "error" && (
                <p
                  className="font-mono text-[10px] font-light tracking-[0.15em] uppercase text-white/50"
                  role="alert"
                >
                  Ocurrió un error al enviar. Intentá de nuevo o escribime por email.
                </p>
              )}

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex w-fit items-center gap-4 px-8 py-4 bg-[#F0F0F0] text-black text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="inline-block w-3 h-3 border border-black/20 border-t-black rounded-full animate-spin"
                        aria-hidden
                      />
                      Enviando
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <span
                        className="text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
