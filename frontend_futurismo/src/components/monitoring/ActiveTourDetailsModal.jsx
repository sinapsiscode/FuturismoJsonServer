import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, MapPinIcon, ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ActiveTourDetailsModal = ({ isOpen, onClose, tour, onViewOnMap }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  if (!isOpen || !tour) {
    return null;
  }

  // Inicializar mapa cuando el modal se abre
  useEffect(() => {
    if (!isOpen || !tour?.currentLocation) return;

    // Esperar a que Leaflet esté disponible
    const initMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      try {
        // Crear mapa centrado en la ubicación del tour
        const map = window.L.map(mapRef.current, {
          center: [tour.currentLocation.lat, tour.currentLocation.lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false
        });

        // Agregar capa de tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Crear icono personalizado
        const icon = window.L.divIcon({
          className: 'custom-marker-modal',
          html: `
            <div class="relative">
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-${tour.status === 'enroute' ? 'green' : tour.status === 'stopped' ? 'yellow' : 'red'}-500 rounded-full animate-pulse"></div>
              <div class="bg-blue-600 rounded-full p-3 shadow-lg border-4 border-white">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 48]
        });

        // Agregar marcador
        const marker = window.L.marker(
          [tour.currentLocation.lat, tour.currentLocation.lng],
          { icon }
        ).addTo(map);

        // Popup con información
        marker.bindPopup(`
          <div class="text-center p-2">
            <h3 class="font-bold text-gray-900">${tour.tourName}</h3>
            <p class="text-sm text-gray-600 mt-1">${tour.guideName}</p>
            <p class="text-xs text-gray-500 mt-1">${tour.currentLocation.name}</p>
          </div>
        `).openPopup();

        mapInstanceRef.current = map;
        markerRef.current = marker;

        // Invalidar tamaño después de un breve delay
        setTimeout(() => {
          if (map) {
            map.invalidateSize();
            setMapReady(true);
          }
        }, 100);

      } catch (error) {
        console.error('Error al inicializar mapa del modal:', error);
      }
    };

    // Esperar a que Leaflet esté cargado
    if (window.L) {
      initMap();
    } else {
      // Si Leaflet no está cargado, esperar un poco
      const timer = setTimeout(initMap, 500);
      return () => clearTimeout(timer);
    }

    // Limpiar mapa al cerrar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      }
    };
  }, [isOpen, tour]);

  // Actualizar marcador cuando cambia la ubicación
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !tour?.currentLocation) return;

    try {
      const newLatLng = [tour.currentLocation.lat, tour.currentLocation.lng];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, 15);
    } catch (error) {
      console.error('Error al actualizar ubicación del marcador:', error);
    }
  }, [tour?.currentLocation]);

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

            {/* Mapa interactivo en tiempo real */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Vista de mapa en tiempo real
              </h4>
              <div className="relative bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300" style={{ height: '350px' }}>
                {/* Contenedor del mapa Leaflet */}
                <div ref={mapRef} className="w-full h-full"></div>

                {/* Badge de ubicación */}
                {mapReady && tour.currentLocation && (
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
                    <p className="text-xs text-gray-600 font-medium">Ubicación GPS</p>
                    <p className="text-sm font-bold text-gray-900">
                      {tour.currentLocation.lat.toFixed(6)}, {tour.currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}

                {/* Indicador de carga */}
                {!mapReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Cargando mapa...</p>
                    </div>
                  </div>
                )}
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
