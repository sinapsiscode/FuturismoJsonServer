import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { agencyService } from '../services/agencyService';

const AgenciesManagement = () => {
  const { t } = useTranslation();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      const response = await agencyService.getAgencies();
      if (response.success) {
        setAgencies(response.data || []);
      }
    } catch (error) {
      console.error('Error al cargar agencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.ruc?.includes(searchTerm) ||
    agency.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (agency) => {
    setSelectedAgency(agency);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAgency(null);
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || statusColors.active}`}>
        {status === 'active' ? 'Activa' : status === 'inactive' ? 'Inactiva' : 'Suspendida'}
      </span>
    );
  };

  const renderLevelBadge = (level) => {
    const levelColors = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[level] || levelColors.bronze}`}>
        {level?.toUpperCase() || 'BRONZE'}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Agencias</h1>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Las agencias se crean desde la sección de <strong>Usuarios</strong> seleccionando el rol "Agencia".
            Aquí solo puedes visualizar la información de las agencias registradas.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, razón social, RUC o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Agencies Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <div
              key={agency.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Agency Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{agency.name}</h3>
                    <p className="text-sm opacity-90 line-clamp-1">{agency.business_name}</p>
                  </div>
                  {agency.logo && (
                    <img
                      src={agency.logo}
                      alt={agency.name}
                      className="w-12 h-12 rounded-full bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Agency Body */}
              <div className="p-4 space-y-3">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{agency.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                    <span>{agency.phone}</span>
                  </div>
                  {agency.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPinIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{agency.address}</span>
                    </div>
                  )}
                  {agency.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GlobeAltIcon className="h-4 w-4 flex-shrink-0" />
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 line-clamp-1"
                      >
                        {agency.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{agency.rating || 0}</span>
                    <span className="text-xs text-gray-500">({agency.total_reviews || 0})</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {agency.total_tours || 0} tours
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {renderStatusBadge(agency.status)}
                  {renderLevelBadge(agency.level)}
                  {agency.verified && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Verificada
                    </span>
                  )}
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(agency)}
                  className="w-full mt-3 btn btn-outline flex items-center justify-center gap-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAgencies.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay agencias</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'No se encontraron agencias con ese criterio de búsqueda.'
              : 'Comienza creando una agencia desde la sección de Usuarios.'}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAgency && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Detalles de la Agencia</h2>
                <button onClick={closeDetailsModal} className="modal-close">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="modal-body">
                {/* Agency Logo and Name */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  {selectedAgency.logo && (
                    <img
                      src={selectedAgency.logo}
                      alt={selectedAgency.name}
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedAgency.name}</h3>
                    <p className="text-gray-600">{selectedAgency.business_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {renderStatusBadge(selectedAgency.status)}
                      {renderLevelBadge(selectedAgency.level)}
                      {selectedAgency.verified && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Verificada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Información Básica</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">RUC:</span>
                        <span className="ml-2 font-medium">{selectedAgency.ruc}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedAgency.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="ml-2 font-medium">{selectedAgency.phone}</span>
                      </div>
                      {selectedAgency.website && (
                        <div>
                          <span className="text-gray-600">Website:</span>
                          <a
                            href={selectedAgency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 font-medium text-blue-600 hover:text-blue-800"
                          >
                            {selectedAgency.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-2 font-medium">{selectedAgency.rating || 0} ⭐</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reviews:</span>
                        <span className="ml-2 font-medium">{selectedAgency.total_reviews || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tours:</span>
                        <span className="ml-2 font-medium">{selectedAgency.total_tours || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Puntos:</span>
                        <span className="ml-2 font-medium">{selectedAgency.points || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Plan:</span>
                        <span className="ml-2 font-medium capitalize">{selectedAgency.subscription_plan || 'standard'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedAgency.address && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Dirección</h4>
                    <p className="text-sm text-gray-600">{selectedAgency.address}</p>
                  </div>
                )}

                {/* Description */}
                {selectedAgency.description && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-600">{selectedAgency.description}</p>
                  </div>
                )}

                {/* Contact Person */}
                {selectedAgency.contact_person && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Persona de Contacto</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 font-medium">{selectedAgency.contact_person.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cargo:</span>
                        <span className="ml-2 font-medium">{selectedAgency.contact_person.position}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedAgency.contact_person.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="ml-2 font-medium">{selectedAgency.contact_person.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {selectedAgency.certifications && selectedAgency.certifications.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Certificaciones</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgency.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {selectedAgency.specialties && selectedAgency.specialties.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgency.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {selectedAgency.languages && selectedAgency.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Idiomas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgency.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={closeDetailsModal} className="btn btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenciesManagement;
