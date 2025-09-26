import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, StarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FeedbackSectionSimple = ({ userRole = 'agency' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  
  // Solo las agencias pueden agregar comentarios
  const canAddFeedback = userRole === 'agency';
  // Los admins pueden ver todo, las agencias ven solo lo suyo
  const canViewFeedback = userRole === 'agency' || userRole === 'admin';

  const handleSubmit = () => {
    if (!canAddFeedback) {
      alert('Solo las agencias pueden enviar comentarios');
      return;
    }
    if (!message.trim()) {
      alert('Por favor, escribe tu comentario');
      return;
    }
    alert(`¡Gracias por tu feedback! Calificación: ${rating}/5`);
    setMessage('');
    setRating(0);
  };

  // Configuración de textos según el rol
  const getTexts = () => {
    if (userRole === 'admin') {
      return {
        title: 'Feedback de agencias',
        subtitle: 'Comentarios y sugerencias recibidos de las agencias',
        formTitle: 'Vista de administrador'
      };
    }
    return {
      title: 'Opiniones y sugerencias',
      subtitle: 'Ayúdanos a mejorar nuestro servicio',
      formTitle: 'Comparte tu opinión'
    };
  };

  const texts = getTexts();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-pink-100 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{texts.title}</h3>
            <p className="text-sm text-gray-500">{texts.subtitle}</p>
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
          {/* Formulario simple - Solo para agencias */}
          {canAddFeedback && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                💡 {texts.formTitle}
              </h4>
            
            <div className="space-y-4">
              {/* Calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación general *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <StarIcon className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-400'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && `${rating}/5`}
                  </span>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu comentario *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos tu experiencia y cómo podemos mejorar..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || rating === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Enviar feedback
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Vista para administradores */}
          {userRole === 'admin' && !canAddFeedback && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">
                👁️ Vista de administrador
              </h4>
              <p className="text-sm text-gray-600">
                Como administrador, puedes ver todos los comentarios y sugerencias enviados por las agencias.
                Las agencias pueden enviar feedback para ayudarnos a mejorar la plataforma.
              </p>
            </div>
          )}

          {/* Historial básico */}
          {canViewFeedback && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {userRole === 'admin' ? 'Todos los comentarios' : 'Tu feedback anterior'}
              </h4>
            
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Mejora en el sistema de reservas</span>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <StarIcon className="w-3 h-3 text-gray-300" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  20 Jun 2024 {userRole === 'admin' && '• Agencia: Viajes El Dorado'}
                </p>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                  <strong>Respuesta:</strong> Gracias por tu sugerencia. Estamos trabajando en mejoras.
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Dashboard más intuitivo</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  15 Jun 2024 {userRole === 'admin' && '• Agencia: Turismo Express'}
                </p>
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                  <strong>Implementado:</strong> ¡Ya está disponible en la versión 2.1!
                </div>
              </div>
            </div>
            </div>
          )}

          {/* Información */}
          {canViewFeedback && (
            <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
              <p className="text-sm text-pink-800">
                <span className="font-medium">
                  {userRole === 'admin' ? '👁️ Información:' : '💡 Tu opinión importa:'}
                </span>{' '}
                {userRole === 'admin' 
                  ? 'Aquí puedes ver todos los comentarios de las agencias y gestionar las respuestas.'
                  : 'Revisamos cada comentario para mejorar continuamente nuestra plataforma.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackSectionSimple;