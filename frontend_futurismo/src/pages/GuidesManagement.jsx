import { useState } from 'react';
import { UserGroupIcon, MagnifyingGlassIcon, FunnelIcon, PencilIcon, EyeIcon, TrashIcon, GlobeAltIcon, TrophyIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import useGuidesStore from '../stores/guidesStore';
import GuideForm from '../components/guides/GuideForm';
import GuideProfile from '../components/guides/GuideProfile';

const GuidesManagement = () => {
  const { guides = [], languages = [], museums = [], actions } = useGuidesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterMuseum, setFilterMuseum] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, profile

  // Filtrar guías
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = !searchQuery ||
      guide?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide?.dni?.includes(searchQuery);

    const matchesType = !filterType || guide?.guideType === filterType;

    const matchesLanguage = !filterLanguage ||
      guide?.specializations?.languages?.some(lang => lang.code === filterLanguage);

    const matchesMuseum = !filterMuseum ||
      guide?.specializations?.museums?.some(museum =>
        museum.name?.toLowerCase().includes(filterMuseum.toLowerCase())
      );

    return matchesSearch && matchesType && matchesLanguage && matchesMuseum;
  });

  const handleEditGuide = (guide) => {
    setEditingGuide(guide);
    setIsEditing(true);
  };

  const handleViewProfile = (guide) => {
    setSelectedGuide(guide);
    setViewMode('profile');
  };

  const handleDeleteGuide = (guideId) => {
    if (confirm('¿Estás seguro de eliminar este guía?')) {
      actions.deleteGuide(guideId);
    }
  };

  const handleSaveGuide = (guideData) => {
    // Solo permite edición, no creación
    if (editingGuide) {
      actions.updateGuide(editingGuide.id, guideData);
      setIsEditing(false);
      setEditingGuide(null);
    }
  };

  const getLanguageLabel = (langCode) => {
    return languages.find(lang => lang.code === langCode)?.name || langCode;
  };

  const getMuseumLabel = (museumName) => {
    return museumName || 'Museo sin nombre';
  };

  const getLevelBadge = (level) => {
    const levels = {
      'principiante': { color: 'bg-yellow-100 text-yellow-800', text: 'Principiante' },
      'intermedio': { color: 'bg-blue-100 text-blue-800', text: 'Intermedio' },
      'avanzado': { color: 'bg-green-100 text-green-800', text: 'Avanzado' },
      'experto': { color: 'bg-purple-100 text-purple-800', text: 'Experto' },
      'nativo': { color: 'bg-indigo-100 text-indigo-800', text: 'Nativo' }
    };

    const levelInfo = levels[level] || { color: 'bg-gray-100 text-gray-800', text: level };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelInfo.color}`}>
        {levelInfo.text}
      </span>
    );
  };

  const renderModals = () => {
    return (
      <>
        {/* Modal de perfil de guía */}
        {viewMode === 'profile' && selectedGuide && (
          <div className="modal-overlay">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Perfil del Guía</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('grid');
                      setSelectedGuide(null);
                    }}
                    className="modal-close"
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <GuideProfile
                    guide={selectedGuide}
                    onClose={() => {
                      setViewMode('grid');
                      setSelectedGuide(null);
                    }}
                    onEdit={handleEditGuide}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de formulario de guía - SOLO para edición */}
        {isEditing && editingGuide && (
          <GuideForm
            guide={editingGuide}
            onSave={handleSaveGuide}
            onCancel={() => {
              setIsEditing(false);
              setEditingGuide(null);
            }}
          />
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserGroupIcon className="w-8 h-8 mr-3 text-blue-500" />
              Gestión de Guías
            </h1>
            <p className="text-gray-600 mt-1">
              Visualiza y administra la información de guías registrados
            </p>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Para crear nuevos guías, dirígete a la sección de <strong>Usuarios</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Los guías necesitan credenciales de acceso al sistema, por lo que deben ser creados desde el módulo de Usuarios con el rol de "Guía".
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Guías</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{guides.length}</p>
                <p className="text-sm text-blue-700">Total Guías</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{guides.filter(g => g.guideType === 'planta').length}</p>
                <p className="text-sm text-green-700">Guías de Planta</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{guides.filter(g => g.guideType === 'freelance').length}</p>
                <p className="text-sm text-yellow-700">Freelance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o DNI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todos los tipos</option>
                <option value="planta">Guía de Planta</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todos los idiomas</option>
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar por museo..."
              value={filterMuseum}
              onChange={(e) => setFilterMuseum(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Lista de guías */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron guías
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajusta los filtros de búsqueda o crea guías desde la sección de Usuarios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                {/* Header del guía */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg"
                    >
                      {(guide?.fullName || 'G').split(' ').map(name => name[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {guide?.fullName || 'Sin nombre'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          guide?.guideType === 'planta'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {guide?.guideType === 'planta' ? 'Planta' : 'Freelance'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <TrophyIcon className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{guide?.stats?.rating || 0}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="truncate">{guide?.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{guide?.phone || 'Sin teléfono'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{guide?.address || 'Sin dirección'}</span>
                  </div>
                </div>

                {/* Idiomas */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Idiomas ({guide?.specializations?.languages?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(guide?.specializations?.languages || []).slice(0, 3).map((lang, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded text-xs">
                        <span>{getLanguageLabel(lang.code)}</span>
                        {getLevelBadge(lang.level)}
                      </div>
                    ))}
                    {(guide?.specializations?.languages?.length || 0) > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{(guide?.specializations?.languages?.length || 0) - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Museos */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Museos ({guide?.specializations?.museums?.length || 0})
                  </h4>
                  <div className="space-y-1">
                    {(guide?.specializations?.museums || []).slice(0, 2).map((museum, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate">{getMuseumLabel(museum.name)}</span>
                        {getLevelBadge(museum.expertise)}
                      </div>
                    ))}
                    {(guide?.specializations?.museums?.length || 0) > 2 && (
                      <span className="text-xs text-gray-500">
                        +{(guide?.specializations?.museums?.length || 0) - 2} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-gray-900">{guide?.stats?.toursCompleted || 0}</p>
                    <p className="text-xs text-gray-600">Tours</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-gray-900">{guide?.stats?.yearsExperience || 0}</p>
                    <p className="text-xs text-gray-600">Años</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-gray-900">{guide?.stats?.certifications || 0}</p>
                    <p className="text-xs text-gray-600">Cert.</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewProfile(guide)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Ver Perfil</span>
                  </button>

                  <button
                    onClick={() => handleEditGuide(guide)}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    title="Editar guía"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteGuide(guide.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar guía"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {renderModals()}
    </div>
  );
};

export default GuidesManagement;
