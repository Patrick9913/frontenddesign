'use client';

import React, { useState, useEffect } from 'react';
import { 
  MdEmail, 
  MdVisibility, 
  MdVisibilityOff, 
  MdDelete, 
  MdCalendarToday, 
  MdPerson, 
  MdMessage,
  MdRefresh
} from 'react-icons/md';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const Admin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  // Simulación de datos - aquí conectarías con Supabase
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockMessages: ContactMessage[] = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          subject: 'Consulta sobre proyecto web',
          message: 'Hola, me interesa desarrollar una aplicación web para mi empresa. ¿Podrías ayudarme con más información sobre tus servicios?',
          read: false,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria@example.com',
          subject: 'Propuesta de colaboración',
          message: 'Buenos días, soy diseñadora UX y me gustaría proponer una colaboración en futuros proyectos.',
          read: true,
          created_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          name: 'Carlos López',
          email: 'carlos@startup.com',
          subject: 'Desarrollo de MVP',
          message: 'Necesitamos desarrollar un MVP para nuestra startup. ¿Tienes experiencia con aplicaciones de fintech?',
          read: false,
          created_at: '2024-01-13T09:15:00Z'
        }
      ];
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'read') return msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona los mensajes recibidos a través del formulario de contacto
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <MdEmail className="text-blue-600 mr-3 text-2xl" />
              <div>
                <p className="text-sm text-gray-600">Total de mensajes</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <MdVisibilityOff className="text-orange-600 mr-3 text-2xl" />
              <div>
                <p className="text-sm text-gray-600">Sin leer</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <MdVisibility className="text-green-600 mr-3 text-2xl" />
              <div>
                <p className="text-sm text-gray-600">Leídos</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length - unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de mensajes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mensajes</h2>
                
                {/* Filtros */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === 'all' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === 'unread' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Sin leer
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === 'read' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Leídos
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No hay mensajes para mostrar
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read) {
                          markAsRead(message.id);
                        }
                      }}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <h3 className={`text-sm font-medium truncate ${
                              !message.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {message.name}
                            </h3>
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Detalle del mensaje */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MdPerson className="mr-1 text-base" />
                          {selectedMessage.name}
                        </div>
                        <div className="flex items-center">
                          <MdEmail className="mr-1 text-base" />
                          {selectedMessage.email}
                        </div>
                        <div className="flex items-center">
                          <MdCalendarToday className="mr-1 text-base" />
                          {formatDate(selectedMessage.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar mensaje"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <MdMessage className="text-gray-400 mr-2 text-xl" />
                    <h3 className="text-lg font-medium text-gray-900">Mensaje</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Responder por Email
                    </a>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MdEmail className="mx-auto mb-4 text-gray-300 text-5xl" />
                  <p className="text-lg font-medium">Selecciona un mensaje</p>
                  <p className="text-sm">Haz clic en un mensaje de la lista para ver los detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;