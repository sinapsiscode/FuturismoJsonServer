import React, { useState } from 'react';
import { CalendarIcon, BriefcaseIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const ExperienceSection = ({ guide, onUpdate }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [experienceStartDate, setExperienceStartDate] = useState(
    guide?.professionalStartDate || ''
  );

  // Calcular años de experiencia basado en la fecha de inicio
  const calculateYearsOfExperience = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(years);
  };

  const handleSave = () => {
    const yearsExperience = calculateYearsOfExperience(experienceStartDate);
    onUpdate({
      professionalStartDate: experienceStartDate,
      stats: {
        ...guide.stats,
        yearsExperience
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setExperienceStartDate(guide?.professionalStartDate || '');
    setIsEditing(false);
  };

  const yearsOfExperience = calculateYearsOfExperience(
    experienceStartDate || guide?.professionalStartDate
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Experiencia Profesional
          </h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:text-green-700"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inicio como guía profesional
          </label>
          {isEditing ? (
            <input
              type="date"
              value={experienceStartDate}
              onChange={(e) => setExperienceStartDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <div className="flex items-center gap-2 text-gray-900">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              {experienceStartDate || guide?.professionalStartDate ? (
                <>
                  {new Date(experienceStartDate || guide?.professionalStartDate).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long'
                  })}
                  <span className="text-gray-500">
                    ({yearsOfExperience} años de experiencia)
                  </span>
                </>
              ) : (
                <span className="text-gray-500 italic">No especificado</span>
              )}
            </div>
          )}
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> La experiencia profesional se calcula desde la fecha de inicio 
            como guía profesional, no desde el registro en la plataforma.
          </p>
        </div>

        {/* Comparación */}
        {guide?.createdAt && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Registrado en la plataforma:</p>
                <p className="font-medium text-gray-900">
                  {new Date(guide.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Experiencia total:</p>
                <p className="font-medium text-gray-900">
                  {yearsOfExperience} años
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;