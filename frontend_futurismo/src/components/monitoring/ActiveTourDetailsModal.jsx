import React from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, MapPinIcon, ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ActiveTourDetailsModal = ({ isOpen, onClose, tour, onViewOnMap }) => {
  if (!isOpen || !tour) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'enroute':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'enroute':
        return 'En ruta';
      case 'stopped':
        return 'Detenido';
      case 'delayed':
        return 'Retrasado';
      default:
        return 'Activo';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        </div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {tour.tourName}
                </h3>
                <p className="mt-1 text-blue-100 text-sm">
                  {tour.destination}
                </p>
              </div>
              <button
                type="button"
                className="bg-white bg-opacity-20 rounded-lg p-2 text-white hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Status badge */}
            <div className="mt-4 flex items-center gap-3">
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(tour.status)}`}>
                {getStatusLabel(tour.status)}
              </span>
              <span className="text-white text-sm bg-white bg-opacity-20 px-3 py-1.5 rounded-full">
                {tour.progress}% completado
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 sm:px-8 max-h-[70vh] overflow-y-auto">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Guía */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Guía asignado</p>
                    <p className="text-sm font-bold text-gray-900">{tour.guideName}</p>
                    <p className="text-xs text-gray-500">{tour.tourists} turistas</p>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Horario</p>
                    <p className="text-sm font-bold text-gray-900">Inicio: {tour.startTime}</p>
                    <p className="text-xs text-gray-500">Fin: {tour.estimatedEndTime}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación actual */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Ubicación actual</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {tour.currentLocation?.name || 'En tránsito'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {tour.currentLocation?.lat.toFixed(4)}, {tour.currentLocation?.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Progreso del Tour</h4>
                <span className="text-lg font-bold text-blue-600">{tour.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    tour.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                    tour.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                    'bg-gradient-to-r from-yellow-500 to-orange-600'
                  }`}
                  style={{ width: `${tour.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Inicio</span>
                <span>Finalización</span>
              </div>
            </div>

            {/* Tour Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                Información del Servicio
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">ID del Tour</p>
                  <p className="text-sm font-semibold text-gray-900">{tour.id}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">Fecha del Servicio</p>
                  <p className="text-sm font-semibold text-gray-900">{tour.date}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">ID del Guía</p>
                  <p className="text-sm font-semibold text-gray-900">{tour.guideId}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">Número de Turistas</p>
                  <p className="text-sm font-semibold text-gray-900">{tour.tourists} personas</p>
                </div>
              </div>
            </div>

            {/* Mapa placeholder */}
            <div className="mt-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">Vista de mapa en tiempo real</p>
                <p className="text-xs text-gray-500 mt-1">
                  Ubicación actual: {tour.currentLocation?.lat.toFixed(4)}, {tour.currentLocation?.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium shadow-lg flex items-center gap-2"
              onClick={() => onViewOnMap && onViewOnMap(tour)}
            >
              <MapPinIcon className="w-5 h-5" />
              Ver en Mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ActiveTourDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tour: PropTypes.object
};

export default ActiveTourDetailsModal;
