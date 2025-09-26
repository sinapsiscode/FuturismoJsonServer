import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, StarIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, LightBulbIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
// Usando solo outline icons para evitar problemas de dependencias

const FeedbackSection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [feedback, setFeedback] = useState({
    category: '',
    rating: 0,
    subject: '',
    message: '',
    suggestions: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousFeedbacks, setPreviousFeedbacks] = useState([
    {
      id: 1,
      date: '2024-06-20',
      category: 'funcionalidad',
      subject: 'Mejora en el sistema de reservas',
      rating: 4,
      status: 'reviewed',
      response: 'Gracias por tu sugerencia. Estamos trabajando en mejorar la interfaz de reservas.'
    },
    {
      id: 2,
      date: '2024-06-15',
      category: 'interfaz',
      subject: 'Dashboard más intuitivo',
      rating: 5,
      status: 'implemented',
      response: 'Implementado en la versión 2.1. ¡Gracias por tu feedback!'
    },
    {
      id: 3,
      date: '2024-06-10',
      category: 'soporte',
      subject: 'Tiempo de respuesta del soporte',
      rating: 3,
      status: 'in_progress',
      response: 'Estamos expandiendo nuestro equipo de soporte para mejorar los tiempos de respuesta.'
    }
  ]);

  const categories = {
    funcionalidad: 'Funcionalidad',
    interfaz: 'Interfaz de usuario',
    rendimiento: 'Rendimiento',
    soporte: 'Soporte técnico',
    documentacion: 'Documentación',
    integracion: 'Integraciones',
    otro: 'Otro'
  };

  const priorities = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  const statusLabels = {
    pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    reviewed: { text: 'Revisado', color: 'bg-blue-100 text-blue-800' },
    in_progress: { text: 'En progreso', color: 'bg-purple-100 text-purple-800' },
    implemented: { text: 'Implementado', color: 'bg-green-100 text-green-800' },
    declined: { text: 'Declinado', color: 'bg-red-100 text-red-800' }
  };

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async () => {
    if (!feedback.category || !feedback.subject || !feedback.message || feedback.rating === 0) {
      alert('⚠️ Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        category: feedback.category,
        subject: feedback.subject,
        rating: feedback.rating,
        status: 'pending',
        response: null
      };

      setPreviousFeedbacks([newFeedback, ...previousFeedbacks]);
      
      // Reset form
      setFeedback({
        category: '',
        rating: 0,
        subject: '',
        message: '',
        suggestions: '',
        priority: 'medium'
      });
      
      setIsSubmitting(false);
      alert('✅ ¡Gracias por tu feedback! Tu opinión es muy importante para nosotros.');
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-pink-100 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Opiniones y sugerencias</h3>
            <p className="text-sm text-gray-500">Ayúdanos a mejorar nuestro servicio</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div>
          {/* Formulario de feedback */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6 mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              Comparte tu opinión
            </h4>
            
            <div className="space-y-4">
              {/* Categoría y Prioridad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={feedback.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={feedback.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    {Object.entries(priorities).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación general *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className="transition-colors"
                    >
                      {star <= feedback.rating ? (
                        <StarIconSolid className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {feedback.rating > 0 && `${feedback.rating}/5`}
                  </span>
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  value={feedback.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Resumen breve de tu comentario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje detallado *
                </label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Describe tu experiencia, problemas encontrados o sugerencias..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Sugerencias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sugerencias de mejora (opcional)
                </label>
                <textarea
                  value={feedback.suggestions}
                  onChange={(e) => handleInputChange('suggestions', e.target.value)}
                  placeholder="¿Cómo crees que podríamos mejorar? Comparte tus ideas..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !feedback.category || !feedback.subject || !feedback.message || feedback.rating === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Enviar feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Historial de feedback previo */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Feedback anterior</h4>
            
            {previousFeedbacks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aún no has enviado ningún feedback</p>
              </div>
            ) : (
              <div className="space-y-4">
                {previousFeedbacks.map((item) => {
                  const status = statusLabels[item.status];
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-medium text-gray-900">{item.subject}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatDate(item.date)}</span>
                            <span className="capitalize">{categories[item.category]}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid
                                  key={i}
                                  className={`w-3 h-3 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-1">{item.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        
                        {item.status === 'implemented' && (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      
                      {item.response && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium mb-1">Respuesta del equipo:</p>
                          <p className="text-sm text-blue-700">{item.response}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <p className="text-sm text-pink-800">
              <span className="font-medium">💡 Tu opinión importa:</span> Revisamos cada comentario y trabajamos continuamente para mejorar nuestra plataforma. Recibirás una respuesta en un plazo máximo de 48 horas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;