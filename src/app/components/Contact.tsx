'use client';
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { IoMdMail } from "react-icons/io";
import { RiSmartphoneFill } from "react-icons/ri";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
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
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contacto
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Me encantaría saber de ti
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Información de Contacto</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mr-4">
                  <IoMdMail  className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">patrickyoel13@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mr-4">
                  <RiSmartphoneFill  className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Teléfono</h4>
                  <p className="text-gray-600">+54 11 4046 8176</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mr-4">
                  <FaMapMarkedAlt className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ubicación</h4>
                  <p className="text-gray-600">Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Por qué trabajar conmigo?
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                  Comunicación clara y constante
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                  Entrega puntual de proyectos
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                  Código limpio y bien documentado
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                  Soporte post-lanzamiento
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Asunto del mensaje"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                ></textarea>
              </div>

              {/* Mensajes de feedback */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ ¡Mensaje enviado exitosamente! Te contactaré pronto.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ Error al enviar el mensaje. Por favor, intenta nuevamente o contáctame directamente por email.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4 bg-gray-900 text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <AiOutlineLoading3Quarters size={20} className="mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <BsFillSendFill size={20} className="mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;