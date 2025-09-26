import React, { useState } from 'react';
import { 
  ClockIcon as Clock,
  EyeIcon as Eye,
  CheckCircleIcon as CheckCircle,
  ExclamationTriangleIcon as AlertCircle,
  XMarkIcon as X,
  ChatBubbleLeftRightIcon as MessageCircle,
  UserIcon as User,
  CalendarIcon as Calendar,
  TagIcon as Tag,
  ArrowRightIcon as ArrowRight,
  PencilIcon as Edit3,
  PaperAirplaneIcon as Send
} from '@heroicons/react/24/outline';

const SuggestionTracker = ({ suggestions = [], onUpdateStatus, onAddResponse }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    {
      value: 'pending',
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock,
      description: 'Esperando revisión inicial'
    },
    {
      value: 'reviewed',
      label: 'Revisado',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Eye,
      description: 'Evaluado por el equipo'
    },
    {
      value: 'in_progress',
      label: 'En Progreso',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: AlertCircle,
      description: 'Siendo implementado'
    },
    {
      value: 'implemented',
      label: 'Implementado',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle,
      description: 'Completado exitosamente'
    },
    {
      value: 'rejected',
      label: 'No Viable',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: X,
      description: 'No se puede implementar'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-800' }
  ];

  // Mock data for demonstration
  const mockSuggestions = [
    {
      id: 1,
      title: 'Sistema de notificaciones push',
      description: 'Implementar notificaciones push para mantener informados a los clientes sobre el estado de sus reservas',
      submittedBy: 'Cliente Premium',
      area: 'communication',
      type: 'suggestion',
      priority: 'high',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      responses: [],
      estimatedDays: 14
    },
    {
      id: 2,
      title: 'Mejorar proceso de check-in',
      description: 'Simplificar el proceso de check-in para tours, actualmente toma demasiado tiempo',
      submittedBy: 'Guía Turístico A',
      area: 'operations',
      type: 'improvement',
      priority: 'medium',
      status: 'in_progress',
      submittedAt: '2024-01-12T14:15:00Z',
      responses: [
        {
          id: 1,
          message: 'Estamos evaluando diferentes opciones para optimizar este proceso.',
          respondedBy: 'Manager Operativo',
          respondedAt: '2024-01-13T09:00:00Z'
        }
      ],
      estimatedDays: 21
    },
    {
      id: 3,
      title: 'Programa de reconocimiento',
      description: 'Crear un programa formal de reconocimiento para el personal destacado',
      submittedBy: 'Recursos Humanos',
      area: 'staff',
      type: 'recognition',
      priority: 'medium',
      status: 'implemented',
      submittedAt: '2024-01-08T11:45:00Z',
      responses: [
        {
          id: 1,
          message: 'Excelente sugerencia. Hemos desarrollado un programa piloto.',
          respondedBy: 'Director RH',
          respondedAt: '2024-01-10T16:30:00Z'
        },
        {
          id: 2,
          message: 'El programa ha sido implementado y ya está en funcionamiento.',
          respondedBy: 'Director RH',
          respondedAt: '2024-01-14T12:00:00Z'
        }
      ],
      estimatedDays: 0,
      completedAt: '2024-01-14T12:00:00Z'
    }
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPriorityInfo = (priority) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysElapsed = (submittedAt) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffTime = Math.abs(now - submitted);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStatusUpdate = (suggestionId, status) => {
    if (onUpdateStatus) {
      onUpdateStatus(suggestionId, status);
    }
    setSelectedSuggestion(null);
    setNewStatus('');
  };

  const handleAddResponse = (suggestionId) => {
    if (response.trim() && onAddResponse) {
      onAddResponse(suggestionId, {
        message: response,
        respondedBy: 'Current User', // Should be replaced with actual user
        respondedAt: new Date().toISOString()
      });
      setResponse('');
    }
  };

  const SuggestionCard = ({ suggestion }) => {
    const statusInfo = getStatusInfo(suggestion.status);
    const priorityInfo = getPriorityInfo(suggestion.priority);
    const StatusIcon = statusInfo.icon;
    const daysElapsed = getDaysElapsed(suggestion.submittedAt);

    return (
      <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{suggestion.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                {priorityInfo.label}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{suggestion.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{suggestion.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(suggestion.submittedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span className="capitalize">{suggestion.area}</span>
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${statusInfo.color}`}>
            <StatusIcon size={14} />
            <span className="text-sm font-medium">{statusInfo.label}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{daysElapsed} días transcurridos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                suggestion.status === 'implemented' 
                  ? 'bg-green-500' 
                  : suggestion.status === 'in_progress' 
                    ? 'bg-orange-500' 
                    : suggestion.status === 'reviewed'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
              }`}
              style={{ 
                width: suggestion.status === 'implemented' 
                  ? '100%' 
                  : suggestion.status === 'in_progress' 
                    ? '60%' 
                    : suggestion.status === 'reviewed'
                      ? '30%'
                      : '10%'
              }}
            ></div>
          </div>
        </div>

        {/* Responses */}
        {suggestion.responses && suggestion.responses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Respuestas del Equipo:</h4>
            <div className="space-y-2">
              {suggestion.responses.map((resp) => (
                <div key={resp.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 mb-1">{resp.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{resp.respondedBy}</span>
                    <span>{formatDate(resp.respondedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {suggestion.status !== 'implemented' && suggestion.status !== 'rejected' && (
              <button
                onClick={() => setSelectedSuggestion(suggestion)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit3 size={14} />
                Actualizar Estado
              </button>
            )}
          </div>
          
          {suggestion.status === 'implemented' && suggestion.completedAt && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle size={14} />
              <span>Completado {formatDate(suggestion.completedAt)}</span>
            </div>
          )}
        </div>

        {/* Add Response Section */}
        {suggestion.status !== 'implemented' && suggestion.status !== 'rejected' && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Añadir respuesta o actualización..."
                className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddResponse(suggestion.id);
                  }
                }}
              />
              <button
                onClick={() => handleAddResponse(suggestion.id)}
                disabled={!response.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Send size={14} />
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seguimiento de Sugerencias
          </h1>
          <p className="text-gray-600">
            Gestiona y da seguimiento a todas las sugerencias recibidas
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statusOptions.map((status) => {
            const StatusIcon = status.icon;
            const count = mockSuggestions.filter(s => s.status === status.value).length;
            
            return (
              <div key={status.value} className={`rounded-lg p-4 border ${status.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon size={20} />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm font-medium">{status.label}</p>
                <p className="text-xs opacity-75">{status.description}</p>
              </div>
            );
          })}
        </div>

        {/* Suggestions List */}
        <div className="space-y-6">
          {mockSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>

        {/* Status Update Modal */}
        {selectedSuggestion && (
          <div className="modal-overlay p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Actualizar Estado
                </h3>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                {selectedSuggestion.title}
              </p>
              
              <div className="space-y-3 mb-6">
                {statusOptions.map((status) => {
                  const StatusIcon = status.icon;
                  return (
                    <button
                      key={status.value}
                      onClick={() => setNewStatus(status.value)}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                        newStatus === status.value
                          ? `${status.color} border-current`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <StatusIcon size={18} />
                      <div>
                        <p className="font-medium">{status.label}</p>
                        <p className="text-xs opacity-75">{status.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedSuggestion.id, newStatus)}
                  disabled={!newStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionTracker;