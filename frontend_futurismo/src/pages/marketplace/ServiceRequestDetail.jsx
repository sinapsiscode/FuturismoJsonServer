import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ServiceRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    serviceRequests, 
    getGuideById, 
    updateServiceRequest, 
    addMessageToRequest 
  } = useMarketplaceStore();
  
  const [request, setRequest] = useState(null);
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const statusConfig = {
    pending: {
      label: 'Pendiente',
      icon: ClockIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    accepted: {
      label: 'Aceptado',
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    rejected: {
      label: 'Rechazado',
      icon: XCircleIcon,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    },
    completed: {
      label: 'Completado',
      icon: CheckCircleIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    cancelled: {
      label: 'Cancelado',
      icon: ExclamationCircleIcon,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200'
    }
  };

  useEffect(() => {
    loadRequestData();
  }, [requestId]);

  const loadRequestData = async () => {
    setIsLoading(true);
    try {
      const foundRequest = serviceRequests.find(r => r.id === requestId);
      if (foundRequest) {
        setRequest(foundRequest);
        const guideData = getGuideById(foundRequest.guideId);
        setGuide(guideData);
      } else {
        navigate('/marketplace/requests');
      }
    } catch (error) {
      console.error('Error loading request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      const message = {
        from: user.role === 'agency' ? 'agency' : 'guide',
        message: newMessage.trim()
      };
      
      addMessageToRequest(requestId, message);
      setNewMessage('');
      toast.success('Mensaje enviado');
      
      // Recargar datos
      loadRequestData();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCancelRequest = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      updateServiceRequest(requestId, { 
        status: 'cancelled',
        timeline: {
          ...request.timeline,
          cancelledAt: new Date().toISOString()
        }
      });
      toast.success('Solicitud cancelada');
      loadRequestData();
    }
  };

  const handleCompleteService = () => {
    navigate(`/marketplace/review/${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!request || !guide) {
    return null;
  }

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/marketplace/requests')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver a solicitudes
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Solicitud {request.requestCode}
                </h1>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.textColor}`}>
                  <StatusIcon className="h-5 w-5" />
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
              
              {request.status === 'pending' && (
                <button
                  onClick={handleCancelRequest}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Cancelar solicitud
                </button>
              )}
              
              {request.status === 'completed' && !request.hasReview && (
                <button
                  onClick={handleCompleteService}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Calificar servicio
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles del servicio */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Servicio</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tipo de servicio</p>
                    <p className="font-medium capitalize">{request.serviceDetails.type}</p>
                  </div>
                  {request.serviceDetails.tourName && (
                    <div>
                      <p className="text-sm text-gray-500">Tour</p>
                      <p className="font-medium">{request.serviceDetails.tourName}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium">
                        {new Date(request.serviceDetails.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Horario</p>
                      <p className="font-medium">
                        {request.serviceDetails.startTime} - {request.serviceDetails.endTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        ({request.serviceDetails.duration} horas)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Punto de encuentro</p>
                    <p className="font-medium">{request.serviceDetails.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Grupo</p>
                      <p className="font-medium">
                        {request.serviceDetails.groupSize} personas ({request.serviceDetails.groupType})
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Idiomas</p>
                    <div className="flex gap-2 mt-1">
                      {request.serviceDetails.languages.map(lang => (
                        <span key={lang} className="text-sm font-medium">
                          {lang === 'es' && '🇪🇸 Español'}
                          {lang === 'en' && '🇺🇸 Inglés'}
                          {lang === 'fr' && '🇫🇷 Francés'}
                          {lang === 'de' && '🇩🇪 Alemán'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {request.serviceDetails.specialRequirements && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Requerimientos especiales</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {request.serviceDetails.specialRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat/Mensajes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Conversación
              </h2>
              
              {/* Lista de mensajes */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {request.messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay mensajes aún. Inicia la conversación.
                  </p>
                ) : (
                  request.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.from === 'agency' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.from === 'agency'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.from === 'agency' ? 'text-cyan-200' : 'text-gray-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Input de mensaje */}
              {['pending', 'accepted'].includes(request.status) && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSendingMessage}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Línea de tiempo</h2>
              
              <div className="space-y-4">
                {request.timeline.requestedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Solicitud enviada</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timeline.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {request.timeline.respondedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Respuesta del guía</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timeline.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {request.timeline.acceptedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Servicio confirmado</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timeline.acceptedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {request.timeline.completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Servicio completado</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timeline.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {request.timeline.cancelledAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Solicitud cancelada</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timeline.cancelledAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Información del guía */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guía asignado</h3>
              
              <div className="text-center">
                <img
                  src={guide.profile.avatar}
                  alt={guide.fullName}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <h4 className="font-semibold text-gray-900">{guide.fullName}</h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {guide.ratings.overall.toFixed(1)} ({guide.ratings.totalReviews} reseñas)
                  </span>
                </div>
                
                <button
                  onClick={() => navigate(`/marketplace/guide/${guide.id}`)}
                  className="mt-4 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                >
                  Ver perfil completo →
                </button>
              </div>
              
              {request.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Información de contacto</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Teléfono:</span>{' '}
                      <span className="font-medium">{guide.phone}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span>{' '}
                      <span className="font-medium">{guide.email}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Información de pago */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5" />
                Información de pago
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarifa acordada</span>
                  <span className="font-semibold">S/. {request.pricing.finalRate}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Términos de pago</p>
                  <p className="text-sm font-medium">{request.pricing.paymentTerms}</p>
                </div>
                
                {guide.preferences.requiresDeposit && request.status === 'accepted' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Depósito requerido: S/. {(request.pricing.finalRate * guide.preferences.depositPercentage / 100).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Políticas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Política de cancelación</h4>
              <p className="text-sm text-gray-600">
                {guide.preferences.cancellationPolicy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetail;