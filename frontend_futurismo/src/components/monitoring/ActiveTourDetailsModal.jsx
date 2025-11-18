import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, MapPinIcon, ClockIcon, UserGroupIcon, CheckCircleIcon, CameraIcon } from '@heroicons/react/24/outline';
import monitoringService from '../../services/monitoringService';

const ActiveTourDetailsModal = ({ isOpen, onClose, tour, onViewOnMap }) => {
  // IMPORTANTE: Todos los hooks DEBEN estar antes de cualquier return condicional
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Inicializar mapa cuando el modal se abre
  useEffect(() => {
    if (!isOpen || !tour) {
      console.log('❌ Modal cerrado o sin tour, no inicializando mapa');
      return;
    }

    if (!tour.currentLocation?.lat || !tour.currentLocation?.lng) {
      console.log('⚠️ Tour sin coordenadas válidas:', tour);
      return;
    }

    console.log('🗺️ Inicializando mapa del modal para tour:', tour.tourName);

    // Esperar a que Leaflet esté disponible
    const initMap = () => {
      if (!window.L) {
        console.log('⚠️ Leaflet no disponible aún');
        return;
      }

      if (!mapRef.current) {
        console.log('⚠️ Referencia del mapa no disponible');
        return;
      }

      if (mapInstanceRef.current) {
        console.log('⚠️ Mapa ya inicializado, saltando...');
        return;
      }

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

        console.log('✅ Mapa del modal creado exitosamente');

        // Invalidar tamaño después de un breve delay
        setTimeout(() => {
          if (map) {
            console.log('🔄 Invalidando tamaño del mapa del modal');
            map.invalidateSize();
            setMapReady(true);
            console.log('✅ Mapa del modal listo');
          }
        }, 100);

      } catch (error) {
        console.error('❌ Error al inicializar mapa del modal:', error);
        console.error('Detalles del error:', error.message, error.stack);
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

  // Cargar fotos del tour
  useEffect(() => {
    if (!isOpen || !tour?.id) {
      setPhotos([]);
      return;
    }

    const loadTourPhotos = async () => {
      try {
        setPhotosLoading(true);
        console.log(`📸 Cargando fotos del tour: ${tour.id}`);
        console.log(`📸 Tour completo:`, tour);

        const result = await monitoringService.getPhotos({ tourId: tour.id });
        console.log(`📸 Respuesta del servidor:`, result);

        if (result.success) {
          const tourPhotos = result.data || [];
          setPhotos(tourPhotos);
          console.log(`✅ ${tourPhotos.length} fotos cargadas para el tour ${tour.tourName}`);
        } else {
          console.error(`❌ Error del servidor: ${result.error}`);
          setPhotos([]);
        }
      } catch (error) {
        console.error('❌ Error al cargar fotos del tour:', error);
        setPhotos([]);
      } finally {
        setPhotosLoading(false);
      }
    };

    loadTourPhotos();
  }, [isOpen, tour?.id]);

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

  // Return condicional DESPUÉS de todos los hooks
  if (!isOpen || !tour) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>

        {/* Modal Content - Estructura flex con altura máxima */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden z-10">
          {/* Header - Fijo (no scroll) */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 sm:px-8">
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
                {tour.progress || 0}% completado
              </span>
            </div>
          </div>

          {/* Body - Scrolleable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
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
                    <p className="text-sm font-bold text-gray-900">Inicio: {tour.startTime || 'No especificado'}</p>
                    <p className="text-xs text-gray-500">Fin: {tour.estimatedEndTime || 'No especificado'}</p>
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
                      {tour.currentLocation?.lat && tour.currentLocation?.lng
                        ? `${tour.currentLocation.lat.toFixed(4)}, ${tour.currentLocation.lng.toFixed(4)}`
                        : 'Coordenadas no disponibles'}
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
                {/* Mensaje cuando no hay coordenadas */}
                {(!tour.currentLocation?.lat || !tour.currentLocation?.lng) ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center px-4">
                      <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Ubicación no disponible</p>
                      <p className="text-sm text-gray-500 mt-1">Este tour no tiene coordenadas GPS registradas</p>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Galería de Fotos del Tour */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <CameraIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  Fotos del Tour
                  {photos.length > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {photos.length}
                    </span>
                  )}
                </h4>
              </div>

              {photosLoading ? (
                <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600 font-medium">Cargando fotos...</span>
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      {/* Imagen con badge */}
                      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden group">
                        <img
                          src={photo.thumbnail || photo.url}
                          alt={photo.comment || photo.stopName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Badge de número */}
                        <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
                          <span className="text-xs font-bold">#{index + 1}</span>
                        </div>
                        {/* Icono de expandir */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Panel de información */}
                      <div className="p-4 space-y-3">
                        {/* Punto de control */}
                        <div>
                          <div className="flex items-start gap-2 mb-1">
                            <MapPinIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{photo.stopName}</h4>
                          </div>
                          {/* Comentario */}
                          {photo.comment && (
                            <p className="text-xs text-gray-600 italic line-clamp-2 pl-6 bg-gray-50 p-2 rounded border-l-2 border-purple-600">
                              "{photo.comment}"
                            </p>
                          )}
                        </div>

                        {/* Metadata grid */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                          {/* Guía */}
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                              <UserGroupIcon className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Guía</p>
                              <p className="text-xs text-gray-900 font-semibold truncate">{photo.guideName}</p>
                            </div>
                          </div>

                          {/* Hora */}
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-orange-100 rounded-lg flex-shrink-0">
                              <ClockIcon className="w-3.5 h-3.5 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Hora</p>
                              <p className="text-xs text-gray-900 font-semibold">
                                {new Date(photo.timestamp).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Fecha */}
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Fecha</p>
                              <p className="text-xs text-gray-900 font-semibold">
                                {new Date(photo.timestamp).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Coordenadas GPS */}
                          {photo.coordinates && (
                            <div className="flex items-start gap-2">
                              <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                                <MapPinIcon className="w-3.5 h-3.5 text-purple-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">GPS</p>
                                <p className="text-xs text-gray-900 font-mono font-semibold truncate">
                                  {photo.coordinates.lat.toFixed(4)}, {photo.coordinates.lng.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No hay fotos disponibles</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Las fotos aparecerán aquí cuando el guía las capture durante el recorrido del tour
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fijo (no scroll) */}
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-8 flex justify-end gap-3">
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

      {/* Modal de Preview de Foto */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Cerrar</span>
            </button>

            {/* Container de imagen */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Imagen principal */}
              <div className="relative bg-gray-900">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.comment || selectedPhoto.stopName}
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>

              {/* Panel de información */}
              <div className="bg-white p-6">
                {/* Header con punto de control */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinIcon className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">{selectedPhoto.stopName}</h3>
                    </div>
                    {selectedPhoto.comment && (
                      <p className="text-gray-700 italic text-sm bg-gray-50 p-3 rounded-lg border-l-4 border-purple-600">
                        "{selectedPhoto.comment}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  {/* Tour */}
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Tour</p>
                      <p className="text-sm text-gray-900 font-semibold">{selectedPhoto.tourName}</p>
                    </div>
                  </div>

                  {/* Guía */}
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserGroupIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Guía</p>
                      <p className="text-sm text-gray-900 font-semibold">{selectedPhoto.guideName}</p>
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ClockIcon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Hora</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {new Date(selectedPhoto.timestamp).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Fecha</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {new Date(selectedPhoto.timestamp).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coordenadas si existen */}
                {selectedPhoto.coordinates && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>Coordenadas GPS:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedPhoto.coordinates.lat.toFixed(6)}, {selectedPhoto.coordinates.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ActiveTourDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tour: PropTypes.object
};

export default ActiveTourDetailsModal;
