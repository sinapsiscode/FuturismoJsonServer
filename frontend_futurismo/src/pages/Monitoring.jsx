import { useState, useEffect } from 'react';
import { MapIcon, UserGroupIcon, CameraIcon, PlayIcon, PauseIcon, CheckIcon, PhotoIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMapResponsive from '../components/monitoring/LiveMapResponsive';
import TourProgress from '../components/monitoring/TourProgress';
import TourPhotosGallery from '../components/monitoring/TourPhotosGallery';
import ActiveTourDetailsModal from '../components/monitoring/ActiveTourDetailsModal';
import useAuthStore from '../stores/authStore';
import useGuideTours from '../hooks/useGuideTours';
import useServicesStore from '../stores/servicesStore';
import toast from 'react-hot-toast';

const Monitoring = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { activeServices, loadActiveServices, loading: servicesLoading } = useServicesStore();

  // Estados del componente
  const [activeView, setActiveView] = useState('map');
  const [selectedTour, setSelectedTour] = useState(null);
  const [showCheckpoints, setShowCheckpoints] = useState({});
  const [capturedPhotos, setCapturedPhotos] = useState({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Para guías, solo mostrar sus propios tours
  const isGuide = user?.role === 'guide';
  const isAdmin = user?.role === 'admin';

  // Cargar servicios activos para admin
  useEffect(() => {
    if (isAdmin && activeView === 'tours') {
      // Cargar servicios activos desde el backend
      loadActiveServices().catch(err => {
        console.error('Error al cargar servicios activos:', err);
        // Si hay error, los datos se quedarán vacíos y se mostrará el mensaje de "no hay tours"
      });
    }
  }, [isAdmin, activeView]);

  // Hook para manejar tours del guía (reemplaza datos hardcodeados)
  const {
    tours: guideTours,
    loading: toursLoading,
    activeTour,
    updateTourStatus,
    getStats
  } = useGuideTours();

  // Obtener estadísticas del guía
  const guideStats = getStats();

  // Solo para guías: manejar tours
  const handleStartTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'iniciado');
      toast.success('Tour iniciado correctamente');
    } catch (error) {
      toast.error('Error al iniciar el tour');
    }
  };

  const handlePauseTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'pausado');
      toast.success('Tour pausado');
    } catch (error) {
      toast.error('Error al pausar el tour');
    }
  };

  const handleCompleteTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'completado');
      toast.success('Tour completado exitosamente');
    } catch (error) {
      toast.error('Error al completar el tour');
    }
  };

  const toggleCheckpoints = (tourId) => {
    setShowCheckpoints(prev => ({
      ...prev,
      [tourId]: !prev[tourId]
    }));
  };

  const handleOpenTourDetails = (tour) => {
    setSelectedTour(tour);
    setIsDetailModalOpen(true);
  };

  const handleCloseTourDetails = () => {
    setIsDetailModalOpen(false);
    // Pequeño delay antes de limpiar el tour seleccionado para una mejor animación
    setTimeout(() => {
      setSelectedTour(null);
    }, 200);
  };

  const handleViewOnMap = (tour) => {
    // Cerrar el modal
    handleCloseTourDetails();

    // Cambiar a la vista de mapa
    setActiveView('map');

    // Guardar el tour seleccionado para que el mapa lo centre
    setSelectedTour(tour);

    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTakePhoto = async (tourId, checkpointId) => {
    try {
      // Verificar si el navegador soporta la API de cámara
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('La cámara no está disponible en este dispositivo');
        return;
      }

      // Obtener acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usar cámara trasera si está disponible
      });
      
      // Crear elemento video temporal
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Esperar a que el video esté listo
      video.onloadedmetadata = () => {
        // Crear canvas para capturar la foto
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Capturar frame actual
        ctx.drawImage(video, 0, 0);
        
        // Convertir a blob
        canvas.toBlob((blob) => {
          // Guardar foto capturada
          const photoUrl = URL.createObjectURL(blob);
          setCapturedPhotos(prev => ({
            ...prev,
            [`${tourId}-${checkpointId}`]: {
              url: photoUrl,
              timestamp: new Date().toISOString(),
              coordinates: null // Se podría añadir geolocalización aquí
            }
          }));
          
          toast.success('Foto capturada correctamente');
          
          // Detener stream
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.8);
      };
      
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Permiso de cámara denegado. Permite el acceso para tomar fotos.');
      } else {
        toast.error('Error al acceder a la cámara');
      }
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Fórmula de Haversine para calcular distancia entre coordenadas
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Convertir a metros
    return distance;
  };

  const isNearCheckpoint = (checkpointLocation, userLocation, threshold = 100) => {
    if (!userLocation) return false;
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      checkpointLocation.lat, checkpointLocation.lng
    );
    return distance <= threshold;
  };

  // Configuración de vistas según el rol
  const viewConfig = isGuide 
    ? [
        { key: 'map', label: t('monitoring.views.liveMap'), icon: MapIcon },
        { key: 'tours', label: t('monitoring.views.myTours'), icon: UserGroupIcon },
      ]
    : [
        { key: 'map', label: t('monitoring.views.liveMap'), icon: MapIcon },
        { key: 'tours', label: t('monitoring.views.activeTours'), icon: UserGroupIcon },
        { key: 'photos', label: t('monitoring.views.photos'), icon: CameraIcon },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
            {isGuide ? t('monitoring.myToursTitle') : t('monitoring.title')}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-700">
            {isGuide 
              ? t('monitoring.guideDescription') 
              : t('monitoring.description')
            }
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max px-1">
          {viewConfig.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  activeView === view.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{view.label}</span>
                  <span className="sm:hidden text-xs">{view.key === 'map' ? 'Mapa' : view.key === 'tours' ? 'Tours' : 'Fotos'}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Vista de Mapa - Para todos los roles */}
        {activeView === 'map' && (
          <div className="p-4 sm:p-6 h-[calc(100vh-16rem)]">
            <LiveMapResponsive />
          </div>
        )}

        {/* Vista de Tours */}
        {activeView === 'tours' && (
          <div className="p-4 sm:p-6">
            {isGuide ? (
              /* Vista de guía - Sus propios tours */
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    {t('monitoring.myTours')}
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {toursLoading ? t('common.loading') : `${guideTours.length} ${t('monitoring.toursTotal')}`}
                  </div>
                </div>

                {toursLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : guideTours.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UserGroupIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <p className="text-sm sm:text-base">{t('monitoring.noToursAssigned')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {guideTours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 break-words">{tour.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{tour.agency}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${
                            tour.status === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : tour.status === 'iniciado'
                              ? 'bg-blue-100 text-blue-800'
                              : tour.status === 'pausado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {t(`monitoring.status.${tour.status}`)}
                          </span>
                        </div>

                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{t('monitoring.date')}:</span>
                            <span>{tour.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('monitoring.time')}:</span>
                            <span>{tour.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('monitoring.tourists')}:</span>
                            <span>{tour.tourists}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="flex-shrink-0">{t('monitoring.location')}:</span>
                            <span className="truncate text-right">{tour.location}</span>
                          </div>
                        </div>

                        {/* Controles del tour */}
                        <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                          <div className="flex gap-1 sm:gap-2">
                            {tour.status === 'asignado' && (
                              <button
                                onClick={() => handleStartTour(tour.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{t('monitoring.actions.start')}</span>
                                <span className="sm:hidden">Iniciar</span>
                              </button>
                            )}
                            
                            {tour.status === 'iniciado' && (
                              <>
                                <button
                                  onClick={() => handlePauseTour(tour.id)}
                                  className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-yellow-600 text-white text-xs sm:text-sm rounded hover:bg-yellow-700 transition-colors"
                                >
                                  <PauseIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">{t('monitoring.actions.pause')}</span>
                                  <span className="sm:hidden">Pausar</span>
                                </button>
                                <button
                                  onClick={() => handleCompleteTour(tour.id)}
                                  className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">{t('monitoring.actions.complete')}</span>
                                  <span className="sm:hidden">Finalizar</span>
                                </button>
                              </>
                            )}
                            
                            {tour.status === 'pausado' && (
                              <button
                                onClick={() => handleStartTour(tour.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                <PlayIcon className="w-4 h-4" />
                                {t('monitoring.actions.resume')}
                              </button>
                            )}
                          </div>

                          {/* Botón para mostrar/ocultar checkpoints */}
                          {tour.checkpoints && tour.checkpoints.length > 0 && (
                            <button
                              onClick={() => toggleCheckpoints(tour.id)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 text-xs sm:text-sm rounded hover:bg-purple-200 transition-colors"
                            >
                              <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-center">
                                {showCheckpoints[tour.id] ? 'Ocultar' : 'Ver'} Puntos ({tour.checkpoints.length})
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Lista de checkpoints expandible */}
                        {showCheckpoints[tour.id] && tour.checkpoints && (
                          <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                            <h5 className="text-xs sm:text-sm font-medium text-gray-900 flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                              Puntos de Control
                            </h5>
                            {tour.checkpoints.map((checkpoint, index) => {
                              const photoKey = `${tour.id}-${checkpoint.id}`;
                              const hasPhoto = capturedPhotos[photoKey];
                              const isRecommended = checkpoint.isRecommended;
                              
                              return (
                                <div 
                                  key={checkpoint.id} 
                                  className={`p-2 sm:p-3 rounded-lg border-2 ${
                                    hasPhoto 
                                      ? 'border-green-200 bg-green-50' 
                                      : isRecommended
                                      ? 'border-purple-200 bg-purple-50'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2 gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                        hasPhoto 
                                          ? 'bg-green-600 text-white'
                                          : isRecommended
                                          ? 'bg-purple-600 text-white' 
                                          : 'bg-gray-400 text-white'
                                      }`}>
                                        {checkpoint.order}
                                      </span>
                                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                        {checkpoint.name}
                                      </span>
                                      <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                                        {isRecommended && !hasPhoto && (
                                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                            Recomendado
                                          </span>
                                        )}
                                        {hasPhoto && (
                                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                            ✓ Completado
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                    {checkpoint.description}
                                  </p>
                                  
                                  {hasPhoto ? (
                                    /* Mostrar foto capturada */
                                    <div className="space-y-2">
                                      <img 
                                        src={capturedPhotos[photoKey].url}
                                        alt={`Foto de ${checkpoint.name}`}
                                        className="w-full h-24 sm:h-32 object-cover rounded border"
                                      />
                                      <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <ClockIcon className="w-3 h-3" />
                                          <span className="truncate">{new Date(capturedPhotos[photoKey].timestamp).toLocaleTimeString()}</span>
                                        </span>
                                        <button 
                                          onClick={() => handleTakePhoto(tour.id, checkpoint.id)}
                                          className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 hover:bg-purple-50 rounded transition-colors"
                                        >
                                          Retomar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Botón para tomar foto */
                                    <button
                                      onClick={() => handleTakePhoto(tour.id, checkpoint.id)}
                                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded transition-colors ${
                                        isRecommended
                                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                                          : 'bg-gray-600 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      <PhotoIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                      Tomar Foto
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* Resumen de progreso */}
                            <div className="mt-2 sm:mt-3 p-2 bg-gray-100 rounded text-center">
                              <span className="text-xs text-gray-600">
                                Fotos: {tour.checkpoints.filter(cp => capturedPhotos[`${tour.id}-${cp.id}`]).length} / {tour.checkpoints.length}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Vista de admin - Todos los tours activos */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tours Activos
                  </h3>
                  <div className="text-sm text-gray-500">
                    {servicesLoading ? 'Cargando...' : `${Array.isArray(activeServices) ? activeServices.length : 0} servicios activos`}
                  </div>
                </div>

                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : !Array.isArray(activeServices) || activeServices.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-400">
                    <UserGroupIcon className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">No hay tours activos en este momento</p>
                    <p className="text-sm mt-1">Los tours activos aparecerán aquí cuando los guías inicien sus servicios</p>
                  </div>
                ) : (
                  /* Lista de tours activos del sistema */
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {activeServices.map((service) => (
                      <div key={service.id} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 mb-1">{service.tourName || 'Tour sin nombre'}</h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <UserGroupIcon className="w-4 h-4" />
                              Guía: {service.guideName || 'No asignado'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            service.status === 'enroute'
                              ? 'bg-green-100 text-green-800'
                              : service.status === 'stopped'
                              ? 'bg-yellow-100 text-yellow-800'
                              : service.status === 'delayed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {service.status === 'enroute' ? 'En ruta' :
                             service.status === 'stopped' ? 'Detenido' :
                             service.status === 'delayed' ? 'Retrasado' : 'Activo'}
                          </span>
                        </div>

                        <div className="space-y-2.5 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>Hora de inicio: {service.startTime || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{service.tourists || 0} turistas</span>
                          </div>
                          {service.currentLocation && (
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                Ubicación: {service.currentLocation.name || 'En tránsito'}
                              </span>
                            </div>
                          )}
                        </div>

                        {service.progress !== undefined && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <span className="font-medium">Progreso del tour</span>
                              <span className="font-semibold">{Math.round(service.progress || 0)}% completado</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                  service.progress >= 80 ? 'bg-green-500' :
                                  service.progress >= 50 ? 'bg-blue-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${service.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-xs font-semibold text-blue-900 mb-1">Estado del servicio</h5>
                                <p className="text-xs text-blue-700">
                                  {service.estimatedEndTime || 'Calculando...'}
                                </p>
                              </div>
                              <div className={`w-3 h-3 rounded-full ${
                                service.status === 'enroute' ? 'bg-green-500 animate-pulse' :
                                service.status === 'stopped' ? 'bg-yellow-500' :
                                service.status === 'delayed' ? 'bg-red-500 animate-pulse' :
                                'bg-blue-500'
                              }`}></div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenTourDetails(service)}
                          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          Ver detalles
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* Vista de Fotos - Solo para Admin */}
        {activeView === 'photos' && !isGuide && (
          <div className="p-4 sm:p-6">
            <TourPhotosGallery />
          </div>
        )}
      </div>

      {/* Modal de detalles de tour activo */}
      <ActiveTourDetailsModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseTourDetails}
        tour={selectedTour}
        onViewOnMap={handleViewOnMap}
      />
    </div>
  );
};

export default Monitoring;