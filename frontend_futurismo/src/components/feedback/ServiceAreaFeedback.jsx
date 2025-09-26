import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon as MessageCircle,
  UserIcon as User,
  ClockIcon as Clock,
  PhoneIcon as Phone,
  CogIcon as Settings,
  MapIcon as Map,
  ShieldCheckIcon as Shield,
  PaperAirplaneIcon as Send,
  PlusIcon as Plus,
  XMarkIcon as X
} from '@heroicons/react/24/outline';

const ServiceAreaFeedback = ({ serviceId, onFeedbackSubmit, existingFeedback = null }) => {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [feedback, setFeedback] = useState({
    customerService: { opinion: '', suggestions: [] },
    operations: { opinion: '', suggestions: [] },
    punctuality: { opinion: '', suggestions: [] },
    communication: { opinion: '', suggestions: [] },
    logistics: { opinion: '', suggestions: [] },
    safety: { opinion: '', suggestions: [] }
  });

  const [newSuggestion, setNewSuggestion] = useState({});
  const [feedbackType, setFeedbackType] = useState('positive'); // positive, negative, neutral

  const serviceAreas = [
    {
      key: 'customerService',
      label: 'Atención al Cliente',
      icon: User,
      description: 'Calidad del servicio y trato recibido',
      color: 'text-blue-600'
    },
    {
      key: 'operations',
      label: 'Operativa',
      icon: Settings,
      description: 'Organización y ejecución del servicio',
      color: 'text-green-600'
    },
    {
      key: 'punctuality',
      label: 'Puntualidad',
      icon: Clock,
      description: 'Cumplimiento de horarios',
      color: 'text-yellow-600'
    },
    {
      key: 'communication',
      label: 'Comunicación',
      icon: Phone,
      description: 'Claridad en la información',
      color: 'text-purple-600'
    },
    {
      key: 'logistics',
      label: 'Logística',
      icon: Map,
      description: 'Coordinación y recursos',
      color: 'text-orange-600'
    },
    {
      key: 'safety',
      label: 'Seguridad',
      icon: Shield,
      description: 'Medidas de protección',
      color: 'text-red-600'
    }
  ];

  const feedbackTypes = [
    { value: 'positive', label: 'Positiva', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'negative', label: 'Negativa', color: 'bg-red-100 text-red-800 border-red-300' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    { value: 'suggestion', label: 'Sugerencia', color: 'bg-blue-100 text-blue-800 border-blue-300' }
  ];

  const handleAreaToggle = (areaKey) => {
    setSelectedAreas(prev => 
      prev.includes(areaKey) 
        ? prev.filter(key => key !== areaKey)
        : [...prev, areaKey]
    );
  };

  const handleOpinionChange = (areaKey, opinion) => {
    setFeedback(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        opinion
      }
    }));
  };

  const handleAddSuggestion = (areaKey) => {
    const suggestion = newSuggestion[areaKey]?.trim();
    if (!suggestion) return;

    setFeedback(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        suggestions: [...prev[areaKey].suggestions, {
          id: Date.now(),
          text: suggestion,
          type: feedbackType,
          timestamp: new Date().toISOString()
        }]
      }
    }));

    setNewSuggestion(prev => ({
      ...prev,
      [areaKey]: ''
    }));
  };

  const handleRemoveSuggestion = (areaKey, suggestionId) => {
    setFeedback(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        suggestions: prev[areaKey].suggestions.filter(s => s.id !== suggestionId)
      }
    }));
  };

  const handleSubmit = () => {
    const feedbackData = {
      serviceId,
      areas: selectedAreas.reduce((acc, areaKey) => {
        acc[areaKey] = feedback[areaKey];
        return acc;
      }, {}),
      submittedBy: 'current_user_id',
      timestamp: new Date().toISOString(),
      totalSuggestions: selectedAreas.reduce((total, areaKey) => 
        total + feedback[areaKey].suggestions.length, 0
      )
    };

    onFeedbackSubmit(feedbackData);
  };

  const getSuggestionTypeClass = (type) => {
    return feedbackTypes.find(ft => ft.value === type)?.color || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const isComplete = selectedAreas.length > 0 && selectedAreas.every(areaKey => 
    feedback[areaKey].opinion.trim().length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Opiniones y Sugerencias por Áreas
        </h2>
        <p className="text-gray-600">
          Comparte tu experiencia y sugerencias para mejorar nuestros servicios
        </p>
      </div>

      {/* Area Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Selecciona las áreas sobre las que quieres opinar:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceAreas.map((area) => {
            const IconComponent = area.icon;
            const isSelected = selectedAreas.includes(area.key);
            return (
              <button
                key={area.key}
                onClick={() => handleAreaToggle(area.key)}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-2">
                  <IconComponent className={`${area.color} mr-2`} size={20} />
                  <span className="font-medium text-gray-800">{area.label}</span>
                </div>
                <p className="text-sm text-gray-600">{area.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Type Selector */}
      {selectedAreas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Tipo de retroalimentación:
          </h3>
          <div className="flex flex-wrap gap-2">
            {feedbackTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFeedbackType(type.value)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                  feedbackType === type.value
                    ? type.color
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Forms */}
      {selectedAreas.length > 0 && (
        <div className="space-y-6">
          {selectedAreas.map((areaKey) => {
            const area = serviceAreas.find(a => a.key === areaKey);
            const IconComponent = area.icon;
            
            return (
              <div key={areaKey} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <IconComponent className={`${area.color} mr-2`} size={24} />
                  <h4 className="text-xl font-semibold text-gray-800">{area.label}</h4>
                </div>

                {/* Opinion Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu opinión sobre {area.label.toLowerCase()}:
                  </label>
                  <textarea
                    value={feedback[areaKey].opinion}
                    onChange={(e) => handleOpinionChange(areaKey, e.target.value)}
                    placeholder={`Comparte tu experiencia con ${area.label.toLowerCase()}...`}
                    className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {feedback[areaKey].opinion.length}/500 caracteres
                  </div>
                </div>

                {/* Suggestions Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sugerencias para mejorar:
                  </label>
                  
                  {/* Existing Suggestions */}
                  {feedback[areaKey].suggestions.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {feedback[areaKey].suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${getSuggestionTypeClass(suggestion.type)}`}
                        >
                          <span className="text-sm">{suggestion.text}</span>
                          <button
                            onClick={() => handleRemoveSuggestion(areaKey, suggestion.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Suggestion */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSuggestion[areaKey] || ''}
                      onChange={(e) => setNewSuggestion(prev => ({
                        ...prev,
                        [areaKey]: e.target.value
                      }))}
                      placeholder="Añade una sugerencia..."
                      className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={200}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSuggestion(areaKey);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddSuggestion(areaKey)}
                      disabled={!newSuggestion[areaKey]?.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary and Submit */}
      {selectedAreas.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-800">Resumen</h4>
              <p className="text-sm text-gray-600">
                {selectedAreas.length} áreas seleccionadas • {
                  selectedAreas.reduce((total, areaKey) => 
                    total + feedback[areaKey].suggestions.length, 0
                  )
                } sugerencias totales
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isComplete
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
              Enviar Opiniones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaFeedback;