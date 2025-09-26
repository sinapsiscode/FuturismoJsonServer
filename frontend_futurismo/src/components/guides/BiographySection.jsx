import React, { useState } from 'react';
import { DocumentTextIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const BiographySection = ({ guide, onUpdate }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [biography, setBiography] = useState(guide?.biography || '');
  const [skills, setSkills] = useState(guide?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const defaultBiography = `Soy un guía profesional con experiencia en turismo cultural y aventura. 
Me apasiona compartir la riqueza histórica y cultural de nuestro país con visitantes de todo el mundo.`;

  const handleSave = () => {
    onUpdate({
      biography,
      skills
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setBiography(guide?.biography || '');
    setSkills(guide?.skills || []);
    setIsEditing(false);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const characterCount = biography.length;
  const maxCharacters = 500;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DocumentTextIcon className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Resumen Profesional
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
        {/* Biografía */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sobre mí
          </label>
          {isEditing ? (
            <div>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                maxLength={maxCharacters}
                rows={5}
                placeholder="Describe tu experiencia, especialidades y lo que te apasiona del turismo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
              <div className="mt-1 text-right">
                <span className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
                  {characterCount}/{maxCharacters} caracteres
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {biography || <span className="italic text-gray-500">{defaultBiography}</span>}
            </p>
          )}
        </div>

        {/* Habilidades destacadas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habilidades y competencias destacadas
          </label>
          {isEditing ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-purple-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Escribe una habilidad y presiona Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ejemplos: Manejo de grupos grandes, Primeros auxilios, Fotografía profesional
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">
                  No hay habilidades destacadas agregadas
                </span>
              )}
            </div>
          )}
        </div>

        {/* Generador automático de resumen */}
        {!isEditing && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Resumen de competencias (generado automáticamente)
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <p>
                Guía {guide?.guideType === 'freelance' ? 'freelance' : 'de planta'} con{' '}
                {guide?.stats?.yearsExperience || 0} años de experiencia.
                {' '}Especializado en {guide?.specializations?.museums?.length || 0} museos
                {' '}y dominio de {guide?.specializations?.languages?.length || 0} idiomas.
                {' '}Ha completado {guide?.stats?.toursCompleted || 0} tours con una
                {' '}calificación promedio de {guide?.stats?.rating || 0}/5.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiographySection;