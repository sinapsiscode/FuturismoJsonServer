import React, { useState } from 'react';
import { 
  StarIcon as Star, 
  UserIcon as User, 
  ClockIcon as Clock, 
  PhoneIcon as Phone, 
  CogIcon as Settings, 
  MapIcon as Map, 
  ShieldCheckIcon as Shield 
} from '@heroicons/react/24/outline';

const ServiceAreaRating = ({ serviceId, onRatingSubmit, initialRatings = {} }) => {
  const [ratings, setRatings] = useState({
    customerService: initialRatings.customerService || 0,
    operations: initialRatings.operations || 0,
    punctuality: initialRatings.punctuality || 0,
    communication: initialRatings.communication || 0,
    logistics: initialRatings.logistics || 0,
    safety: initialRatings.safety || 0,
    ...initialRatings
  });

  const [comments, setComments] = useState({
    customerService: '',
    operations: '',
    punctuality: '',
    communication: '',
    logistics: '',
    safety: ''
  });

  const serviceAreas = [
    {
      key: 'customerService',
      label: 'Atención al Cliente',
      icon: User,
      description: 'Calidad del servicio y atención recibida'
    },
    {
      key: 'operations',
      label: 'Operativa',
      icon: Settings,
      description: 'Organización y ejecución del servicio'
    },
    {
      key: 'punctuality',
      label: 'Puntualidad',
      icon: Clock,
      description: 'Cumplimiento de horarios establecidos'
    },
    {
      key: 'communication',
      label: 'Comunicación',
      icon: Phone,
      description: 'Claridad y efectividad en la comunicación'
    },
    {
      key: 'logistics',
      label: 'Logística',
      icon: Map,
      description: 'Coordinación y gestión de recursos'
    },
    {
      key: 'safety',
      label: 'Seguridad',
      icon: Shield,
      description: 'Medidas de seguridad y protección'
    }
  ];

  const handleRatingChange = (area, rating) => {
    setRatings(prev => ({
      ...prev,
      [area]: rating
    }));
  };

  const handleCommentChange = (area, comment) => {
    setComments(prev => ({
      ...prev,
      [area]: comment
    }));
  };

  const handleSubmit = () => {
    const ratingData = {
      serviceId,
      ratings,
      comments,
      timestamp: new Date().toISOString(),
      averageRating: Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length
    };
    
    onRatingSubmit(ratingData);
  };

  const renderStars = (area, currentRating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(area, star)}
            className={`transition-colors ${
              star <= currentRating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star
              size={20}
              fill={star <= currentRating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : 'Sin calificar'}
        </span>
      </div>
    );
  };

  const isComplete = Object.values(ratings).every(rating => rating > 0);
  const averageRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Valoración por Áreas de Servicio
        </h2>
        <p className="text-gray-600">
          Evalúa cada área del servicio para ayudarnos a mejorar la calidad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {serviceAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <div key={area.key} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <IconComponent className="text-blue-600 mr-2" size={20} />
                <h3 className="font-semibold text-gray-800">{area.label}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{area.description}</p>
              
              <div className="mb-3">
                {renderStars(area.key, ratings[area.key])}
              </div>
              
              <textarea
                value={comments[area.key]}
                onChange={(e) => handleCommentChange(area.key, e.target.value)}
                placeholder={`Comentarios sobre ${area.label.toLowerCase()}...`}
                className="w-full p-2 border rounded-md text-sm resize-none"
                rows={2}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {comments[area.key].length}/200 caracteres
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-800">Resumen de Valoración</h4>
              <p className="text-blue-600">
                Promedio general: {averageRating.toFixed(1)}/5
              </p>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Enviar Valoración
        </button>
      </div>
    </div>
  );
};

export default ServiceAreaRating;