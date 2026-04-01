'use client';
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Configuración de EmailJS
      const serviceId = 'service_kjmlf1a';
      const templateId = 'template_xf807za';
      const publicKey = 'nIzwTNQpr1_X4EE_q';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'patrickyoel13@gmail.com',
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setSubmitStatus('error');
      
      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-black text-white font-sans border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32">
          
          {/* Left Column - Contact Info */}
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-light tracking-[0.4em] uppercase text-white/40 mb-4 block">
              Contacto
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] text-white uppercase mb-12">
              Hablemos
            </h2>

            <p className="text-xs md:text-sm font-light tracking-wide text-white/50 leading-relaxed mb-16 max-w-sm">
              Si estás buscando integrar a alguien a tu equipo o simplemente quieres intercambiar ideas sobre diseño, desarrollo o tecnología, no dudes en escribirme.
            </p>
            
            <div className="grid gap-12">
              <div>
                <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30 mb-3">Email</h4>
                <p className="text-xs md:text-sm font-light text-white/70 tracking-wide">patrickyoel13@gmail.com</p>
              </div>

              <div>
                <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30 mb-3">Teléfono</h4>
                <p className="text-xs md:text-sm font-light text-white/70 tracking-wide">+54 11 4046 8176</p>
              </div>

              <div>
                <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30 mb-3">Ubicación</h4>
                <p className="text-xs md:text-sm font-light text-white/70 tracking-wide">Buenos Aires, Argentina (Remoto)</p>
              </div>

              <div>
                <h4 className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30 mb-3">Redes</h4>
                <div className="flex gap-6">
                  <a href="https://www.linkedin.com/in/patrick-ord%C3%B3%C3%B1ez-14904221a/" target="_blank" rel="noreferrer" className="text-xs md:text-sm font-light text-white/70 hover:text-white transition-colors tracking-wide">LinkedIn</a>
                  <a href="https://github.com/Patrick9913" target="_blank" rel="noreferrer" className="text-xs md:text-sm font-light text-white/70 hover:text-white transition-colors tracking-wide">GitHub</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative pt-6 lg:pt-16">
             <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 pb-4 text-white font-light text-xs md:text-sm focus:outline-none focus:border-white/40 transition-colors placeholder-white/30"
                    placeholder="Nombre Completo"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 pb-4 text-white font-light text-xs md:text-sm focus:outline-none focus:border-white/40 transition-colors placeholder-white/30"
                    placeholder="Correo Electrónico"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 pb-4 text-white font-light text-xs md:text-sm focus:outline-none focus:border-white/40 transition-colors placeholder-white/30"
                    placeholder="Asunto"
                  />
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={1}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 pb-16 text-white font-light text-xs md:text-sm focus:outline-none focus:border-white/40 transition-colors resize-none placeholder-white/30"
                    placeholder="Tu Mensaje"
                  ></textarea>
                </div>

                {/* Feedback */}
                {submitStatus === 'success' && (
                  <div className="text-green-400 text-[10px] font-light tracking-[0.1em] uppercase">
                    Mensaje enviado exitosamente.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="text-red-400 text-[10px] font-light tracking-[0.1em] uppercase">
                    Ocurrió un error al enviar.
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-block px-10 py-4 border border-white/10 bg-transparent text-white/50 text-[9px] md:text-[10px] font-medium tracking-[0.3em] uppercase hover:bg-white/5 hover:text-white hover:border-white/30 transition-all duration-500 mt-4 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <AiOutlineLoading3Quarters size={12} className="animate-spin" />
                        ENVIANDO
                      </span>
                    ) : (
                      'ENVIAR MENSAJE'
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
