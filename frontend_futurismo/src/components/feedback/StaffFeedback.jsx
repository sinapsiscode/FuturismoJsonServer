import React, { useState } from 'react';
import { 
  UserIcon as User,
  ChatBubbleLeftRightIcon as MessageCircle,
  ArrowTrendingUpIcon as TrendingUp,
  TrophyIcon as Award,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  PlusIcon as Plus,
  XMarkIcon as X,
  PaperAirplaneIcon as Send,
  HandThumbUpIcon as ThumbsUp,
  HandThumbDownIcon as ThumbsDown,
  LightBulbIcon as Lightbulb
} from '@heroicons/react/24/outline';

const StaffFeedback = ({ staffMember, onFeedbackSubmit, existingFeedback = null }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [feedback, setFeedback] = useState({
    performance: { comments: '', suggestions: [], recognition: [] },
    communication: { comments: '', suggestions: [], recognition: [] },
    professionalism: { comments: '', suggestions: [], recognition: [] },
    knowledge: { comments: '', suggestions: [], recognition: [] },
    punctuality: { comments: '', suggestions: [], recognition: [] },
    teamwork: { comments: '', suggestions: [], recognition: [] }
  });

  const [newItem, setNewItem] = useState({});
  const [itemType, setItemType] = useState('suggestion');

  const evaluationCategories = [
    {
      key: 'performance',
      label: 'Desempeño General',
      icon: TrendingUp,
      description: 'Calidad del trabajo y resultados',
      color: 'text-blue-600'
    },
    {
      key: 'communication',
      label: 'Comunicación',
      icon: MessageCircle,
      description: 'Habilidades comunicativas',
      color: 'text-green-600'
    },
    {
      key: 'professionalism',
      label: 'Profesionalismo',
      icon: Award,
      description: 'Actitud y presentación',
      color: 'text-purple-600'
    },
    {
      key: 'knowledge',
      label: 'Conocimiento Técnico',
      icon: User,
      description: 'Habilidades y competencias',
      color: 'text-orange-600'
    },
    {
      key: 'punctuality',
      label: 'Puntualidad',
      icon: Clock,
      description: 'Cumplimiento de horarios',
      color: 'text-yellow-600'
    },
    {
      key: 'teamwork',
      label: 'Trabajo en Equipo',
      icon: CheckCircle,
      description: 'Colaboración y apoyo',
      color: 'text-red-600'
    }
  ];

  const itemTypes = [
    { 
      value: 'suggestion', 
      label: 'Sugerencia de Mejora', 
      icon: Lightbulb,
      color: 'bg-blue-100 text-blue-800 border-blue-300' 
    },
    { 
      value: 'recognition', 
      label: 'Reconocimiento', 
      icon: ThumbsUp,
      color: 'bg-green-100 text-green-800 border-green-300' 
    }
  ];

  const handleCategoryToggle = (categoryKey) => {
    setSelectedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleCommentsChange = (categoryKey, comments) => {
    setFeedback(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        comments
      }
    }));
  };

  const handleAddItem = (categoryKey) => {
    const itemText = newItem[categoryKey]?.trim();
    if (!itemText) return;

    const targetArray = itemType === 'suggestion' ? 'suggestions' : 'recognition';
    
    setFeedback(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [targetArray]: [...prev[categoryKey][targetArray], {
          id: Date.now(),
          text: itemText,
          type: itemType,
          timestamp: new Date().toISOString(),
          submittedBy: 'current_user_id'
        }]
      }
    }));

    setNewItem(prev => ({
      ...prev,
      [categoryKey]: ''
    }));
  };

  const handleRemoveItem = (categoryKey, itemId, arrayType) => {
    setFeedback(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [arrayType]: prev[categoryKey][arrayType].filter(item => item.id !== itemId)
      }
    }));
  };

  const handleSubmit = () => {
    const feedbackData = {
      staffMemberId: staffMember.id,
      categories: selectedCategories.reduce((acc, categoryKey) => {
        acc[categoryKey] = feedback[categoryKey];
        return acc;
      }, {}),
      submittedBy: 'current_user_id',
      timestamp: new Date().toISOString(),
      summary: {
        totalSuggestions: selectedCategories.reduce((total, categoryKey) => 
          total + feedback[categoryKey].suggestions.length, 0),
        totalRecognitions: selectedCategories.reduce((total, categoryKey) => 
          total + feedback[categoryKey].recognition.length, 0),
        categoriesEvaluated: selectedCategories.length
      }
    };

    onFeedbackSubmit(feedbackData);
  };

  const getItemTypeInfo = (type) => {
    return itemTypes.find(it => it.value === type) || itemTypes[0];
  };

  const isComplete = selectedCategories.length > 0 && selectedCategories.every(categoryKey => 
    feedback[categoryKey].comments.trim().length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="text-blue-600" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Opiniones y Sugerencias sobre Personal
            </h2>
            <p className="text-gray-600">
              {staffMember.name} - {staffMember.role}
            </p>
            <p className="text-sm text-gray-500">
              Comparte tu experiencia y sugerencias para el desarrollo profesional
            </p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Selecciona las áreas sobre las que quieres dar retroalimentación:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {evaluationCategories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategories.includes(category.key);
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryToggle(category.key)}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-2">
                  <IconComponent className={`${category.color} mr-2`} size={20} />
                  <span className="font-medium text-gray-800">{category.label}</span>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Type Selector */}
      {selectedCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Tipo de retroalimentación:
          </h3>
          <div className="flex flex-wrap gap-2">
            {itemTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setItemType(type.value)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                    itemType === type.value
                      ? type.color
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <IconComponent size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback Forms */}
      {selectedCategories.length > 0 && (
        <div className="space-y-6">
          {selectedCategories.map((categoryKey) => {
            const category = evaluationCategories.find(c => c.key === categoryKey);
            const IconComponent = category.icon;
            
            return (
              <div key={categoryKey} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <IconComponent className={`${category.color} mr-2`} size={24} />
                  <h4 className="text-xl font-semibold text-gray-800">{category.label}</h4>
                </div>

                {/* Comments Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu opinión sobre {category.label.toLowerCase()} de {staffMember.name}:
                  </label>
                  <textarea
                    value={feedback[categoryKey].comments}
                    onChange={(e) => handleCommentsChange(categoryKey, e.target.value)}
                    placeholder={`Comparte tu experiencia sobre ${category.label.toLowerCase()}...`}
                    className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {feedback[categoryKey].comments.length}/500 caracteres
                  </div>
                </div>

                {/* Suggestions Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sugerencias de Mejora:
                  </label>
                  
                  {feedback[categoryKey].suggestions.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {feedback[categoryKey].suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 border-blue-300"
                        >
                          <div className="flex items-center gap-2">
                            <Lightbulb size={16} className="text-blue-600" />
                            <span className="text-sm text-blue-800">{suggestion.text}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(categoryKey, suggestion.id, 'suggestions')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recognition Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reconocimientos:
                  </label>
                  
                  {feedback[categoryKey].recognition.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {feedback[categoryKey].recognition.map((recognition) => (
                        <div
                          key={recognition.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-300"
                        >
                          <div className="flex items-center gap-2">
                            <ThumbsUp size={16} className="text-green-600" />
                            <span className="text-sm text-green-800">{recognition.text}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(categoryKey, recognition.id, 'recognition')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem[categoryKey] || ''}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      [categoryKey]: e.target.value
                    }))}
                    placeholder={`Añade ${itemType === 'suggestion' ? 'una sugerencia' : 'un reconocimiento'}...`}
                    className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={200}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(categoryKey);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddItem(categoryKey)}
                    disabled={!newItem[categoryKey]?.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary and Submit */}
      {selectedCategories.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-800">Resumen de Retroalimentación</h4>
              <p className="text-sm text-gray-600">
                {selectedCategories.length} áreas evaluadas • {
                  selectedCategories.reduce((total, categoryKey) => 
                    total + feedback[categoryKey].suggestions.length, 0
                  )
                } sugerencias • {
                  selectedCategories.reduce((total, categoryKey) => 
                    total + feedback[categoryKey].recognition.length, 0
                  )
                } reconocimientos
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
              Enviar Retroalimentación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffFeedback;