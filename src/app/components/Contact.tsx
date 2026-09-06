"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { ContactSectionDecor } from "./expanded/SectionDecors";

const inputClassName =
  "w-full rounded-none border-0 border-b border-white/[0.08] bg-transparent pb-4 text-base font-light text-[#F0F0F0] transition-colors duration-500 placeholder:text-white/40 focus:border-white/40 focus:outline-none md:text-lg";

const labelClassName =
  "mb-3 block font-mono text-xs font-light uppercase tracking-[0.2em] text-white/65";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const serviceId = "service_kjmlf1a";
      const templateId = "template_xf807za";
      const publicKey = "nIzwTNQpr1_X4EE_q";

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: "Contacto desde el portfolio",
          message: formData.message,
          to_email: "patrickyoel13@gmail.com",
        },
        publicKey
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
    <ExpandedSection
      id="contact"
      decor={<ContactSectionDecor />}
      title="HABLEMOS"
      accent="AHORA"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-sm font-light leading-[1.75] tracking-wide text-white/75 md:text-base">
            Un proyecto, un equipo o una idea. Escribime.
          </p>
          <a
            href="mailto:patrickyoel13@gmail.com"
            className="mt-6 inline-flex min-h-[44px] items-center text-sm font-light tracking-wide text-[#F0F0F0] transition-colors duration-500 hover:text-white md:text-base"
          >
            patrickyoel13@gmail.com
          </a>
        </div>

        <ExpandedContentPanel className="lg:col-span-7 lg:col-start-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
            <div>
              <label htmlFor="name" className={labelClassName}>
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                placeholder="tu@email.com"
              />
            </div>

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
                className={`${inputClassName} min-h-[120px] resize-none`}
                placeholder="Contame sobre tu proyecto..."
              />
            </div>

            {submitStatus === "success" ? (
              <p
                className="font-mono text-xs font-light uppercase tracking-[0.15em] text-[#F0F0F0]"
                role="status"
              >
                Mensaje enviado.
              </p>
            ) : null}
            {submitStatus === "error" ? (
              <p
                className="font-mono text-xs font-light uppercase tracking-[0.15em] text-white/70"
                role="alert"
              >
                No se pudo enviar. Probá de nuevo o escribime por email.
              </p>
            ) : null}

            <div className="border-t border-white/[0.08] pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full sm:w-fit items-center justify-center gap-4 bg-[#F0F0F0] px-8 py-5 min-h-[44px] text-xs font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-500 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block h-3 w-3 animate-spin rounded-full border border-black/20 border-t-black"
                      aria-hidden
                    />
                    Enviando
                  </>
                ) : (
                  <>
                    Enviar
                    <span
                      className="text-base transition-transform duration-500 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </ExpandedContentPanel>
      </div>
    </ExpandedSection>
  );
};

export default Contact;
