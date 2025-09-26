import { useState } from 'react';
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  BriefcaseIcon,
  IdentificationIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LanguageMultiSelect from '../common/LanguageMultiSelect';

const FreelancerProfessionalDataSection = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [formData, setFormData] = useState({
    licenseNumber: 'LIC-2024-001',
    experience: 'Guía turístico con más de 5 años de experiencia especializado en tours históricos y culturales de Lima. He guiado a más de 2000 turistas nacionales e internacionales...',
    specialties: 'Tours culturales, historia inca, gastronomía peruana, tours nocturnos',
    languages: [
      { code: 'es', level: 'nativo' },
      { code: 'en', level: 'avanzado' },
      { code: 'fr', level: 'intermedio' }
    ],
    yearsOfExperience: 5,
    education: 'Licenciado en Turismo - Universidad San Martín de Porres',
    certifications: [
      'Certificación en Primeros Auxilios',
      'Curso de Turismo Sostenible',
      'Especialización en Historia del Perú'
    ]
  });

  const handleSave = () => {
    console.log('Guardando datos profesionales:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      licenseNumber: 'LIC-2024-001',
      experience: 'Guía turístico con más de 5 años de experiencia especializado en tours históricos y culturales de Lima. He guiado a más de 2000 turistas nacionales e internacionales...',
      specialties: 'Tours culturales, historia inca, gastronomía peruana, tours nocturnos',
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'avanzado' },
        { code: 'fr', level: 'intermedio' }
      ],
      yearsOfExperience: 5,
      education: 'Licenciado en Turismo - Universidad San Martín de Porres',
      certifications: [
        'Certificación en Primeros Auxilios',
        'Curso de Turismo Sostenible',
        'Especialización en Historia del Perú'
      ]
    });
    setIsEditing(false);
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Información Profesional</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancelar
                </button>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* Información básica profesional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IdentificationIcon className="inline w-4 h-4 mr-1" />
                Número de Licencia de Guía *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="LIC-2024-001"
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.licenseNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <StarIcon className="inline w-4 h-4 mr-1" />
                Años de Experiencia
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.yearsOfExperience} años</p>
              )}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GlobeAltIcon className="inline w-4 h-4 mr-1" />
              Idiomas que Hablas
            </label>
            {isEditing ? (
              <LanguageMultiSelect
                value={formData.languages}
                onChange={(languages) => setFormData(prev => ({ ...prev, languages }))}
                placeholder="Selecciona los idiomas que dominas"
              />
            ) : (
              <div className="space-y-2">
                {formData.languages.map((lang, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lang.code.toUpperCase()}
                    </span>
                    <span className="text-gray-900">{lang.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experiencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia Profesional *
            </label>
            {isEditing ? (
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu experiencia como guía turístico..."
              />
            ) : (
              <p className="text-gray-900 py-2 whitespace-pre-wrap">{formData.experience}</p>
            )}
          </div>

          {/* Especialidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades *
            </label>
            {isEditing ? (
              <textarea
                value={formData.specialties}
                onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Tours culturales, historia inca, gastronomía..."
              />
            ) : (
              <p className="text-gray-900 py-2">{formData.specialties}</p>
            )}
          </div>

          {/* Educación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AcademicCapIcon className="inline w-4 h-4 mr-1" />
              Educación
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título académico y universidad"
              />
            ) : (
              <p className="text-gray-900 py-2">{formData.education}</p>
            )}
          </div>

          {/* Certificaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificaciones y Cursos
            </label>
            {isEditing ? (
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de la certificación"
                    />
                    <button
                      onClick={() => removeCertification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCertification}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Agregar certificación
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfessionalDataSection;