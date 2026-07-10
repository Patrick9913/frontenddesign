"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ExpandedContentPanel, ExpandedSection } from "./expanded/ExpandedSection";
import { ContactSectionDecor } from "./expanded/SectionDecors";

const SECTION_INDEX = "[ 05 ]";

const COPY = {
  overline: "Contacto",
  title: "HABLEMOS",
  accent: "AHORA",
  lead:
    "Si estás buscando integrar a alguien a tu equipo o simplemente querés intercambiar ideas sobre diseño, desarrollo o tecnología, no dudes en escribirme.",
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
  "w-full rounded-none border-0 border-b border-white/[0.08] bg-transparent pb-4 text-base font-light text-[#F0F0F0] transition-colors duration-500 placeholder:text-white/25 focus:border-white/40 focus:outline-none md:text-lg";

const labelClassName =
  "mb-3 block font-mono text-xs font-light uppercase tracking-[0.2em] text-white/50";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
          subject: formData.subject,
          message: formData.message,
          to_email: "patrickyoel13@gmail.com",
        },
        publicKey
      );

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
    <ExpandedSection
      id="contact"
      decor={<ContactSectionDecor />}
      index={SECTION_INDEX}
      overline={COPY.overline}
      title={COPY.title}
      accent={COPY.accent}
      lead={COPY.lead}
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20 xl:gap-24">
        <ExpandedContentPanel className="lg:col-span-5">
          <div className="flex flex-col gap-10 md:gap-12">
            {CONTACT_DETAILS.map((item) => (
              <div key={item.id} className="border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0">
                <div className="mb-3 flex items-baseline gap-4">
                  <span className="font-mono text-xs font-light uppercase tracking-[0.2em] text-white/50">
                    {item.id}
                  </span>
                  <h3 className="text-xs font-light uppercase tracking-[0.2em] text-white/50">
                    {item.label}
                  </h3>
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-base font-light tracking-wide text-white/50 transition-colors duration-500 hover:text-[#F0F0F0] md:text-lg inline-block min-h-[44px] flex items-center"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-base font-light tracking-wide text-white/50 md:text-lg">{item.value}</p>
                )}
              </div>
            ))}

            <div className="border-t border-white/[0.08] pt-8">
              <h3 className="mb-6 text-xs font-light uppercase tracking-[0.2em] text-white/50">
                Redes
              </h3>
              <nav className="flex flex-wrap gap-6" aria-label="Redes sociales">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-light uppercase tracking-[0.15em] text-white/40 transition-colors duration-500 hover:text-[#F0F0F0] inline-block min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </ExpandedContentPanel>

        <ExpandedContentPanel className="lg:col-span-6 lg:col-start-7 lg:border-l lg:pl-12 xl:pl-16">
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
                className={`${inputClassName} min-h-[120px] resize-none`}
                placeholder="Contame sobre tu proyecto..."
              />
            </div>

            {submitStatus === "success" ? (
              <p
                className="font-mono text-xs font-light uppercase tracking-[0.15em] text-[#F0F0F0]"
                role="status"
              >
                Mensaje enviado exitosamente.
              </p>
            ) : null}
            {submitStatus === "error" ? (
              <p
                className="font-mono text-xs font-light uppercase tracking-[0.15em] text-white/50"
                role="alert"
              >
                Ocurrió un error al enviar. Intentá de nuevo o escribime por email.
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
                    Enviar mensaje
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
