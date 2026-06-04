"use client";

import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { getSectionMeta } from "../../scene/sections";
import { triggerContactFlash, sceneStore } from "../../scene/sceneStore";
import { useScene } from "../../scene/SceneContext";

type ContactPanelProps = {
  progress: number;
};

export function ContactPanel({ progress }: ContactPanelProps) {
  const { setContactFillProgress } = useScene();
  const meta = getSectionMeta("contact");
  const reveal = Math.min(1, Math.max(0, progress));

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const filled = [formData.name, formData.email, formData.subject, formData.message].filter(
      (v) => v.trim().length > 0
    ).length;
    const fillProgress = filled / 4;
    setContactFillProgress(fillProgress);
    sceneStore.contactFillProgress = fillProgress;
  }, [formData, setContactFillProgress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          subject: formData.subject,
          message: formData.message,
          to_email: "patrickyoel13@gmail.com",
        },
        "nIzwTNQpr1_X4EE_q"
      );
      setSubmitStatus("success");
      triggerContactFlash();
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="pointer-events-none w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24"
      style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 48}px)` }}
    >
      <header className="mb-10 md:mb-14">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <span className="font-mono text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.index}
          </span>
          <span className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/50">
            {meta.label}
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.02em] uppercase leading-[1.05]">
          HABLEMOS
          <br />
          <span className="font-medium text-white/50">AHORA</span>
        </h2>
        <p className="mt-6 text-sm font-light text-white/50 max-w-xl leading-[1.75]">
          Si querés integrar a alguien a tu equipo o intercambiar ideas sobre diseño y desarrollo, escribime.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-white/[0.08] pt-10"
        style={{ pointerEvents: reveal > 0.25 ? "auto" : "none" }}
        noValidate
      >
        {(["name", "email", "subject"] as const).map((field) => (
          <div key={field}>
            <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">
              {field === "name" ? "Nombre" : field === "email" ? "Email" : "Asunto"}
            </label>
            <input
              name={field}
              type={field === "email" ? "email" : "text"}
              required
              value={formData[field]}
              onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-white/[0.08] pb-3 text-sm font-light text-[#F0F0F0] focus:outline-none focus:border-white/40"
            />
          </div>
        ))}
        <div className="lg:col-span-2">
          <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">
            Mensaje
          </label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-transparent border-0 border-b border-white/[0.08] pb-3 text-sm font-light text-[#F0F0F0] focus:outline-none focus:border-white/40 resize-none"
          />
        </div>
        {submitStatus === "success" && (
          <p className="lg:col-span-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#F0F0F0]" role="status">
            Mensaje enviado — el cubo acaba de encenderse.
          </p>
        )}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-4 bg-[#F0F0F0] px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-black disabled:opacity-40"
          >
            {isSubmitting ? "Enviando…" : "Enviar mensaje →"}
          </button>
        </div>
      </form>
    </div>
  );
}
