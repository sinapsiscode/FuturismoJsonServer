import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  MapPinIcon, 
  LanguageIcon, 
  CheckBadgeIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PhotoUpload from '../../components/common/PhotoUpload';
import { useTranslation } from 'react-i18next';

const GuideMarketplaceProfile = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { 
    currentGuide,
    reviews,
    isLoading,
    fetchGuideProfile,
    fetchGuideReviews
  } = useMarketplaceStore();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const tourTypeNames = {
    cultural: 'Cultural',
    aventura: 'Aventura',
    gastronomico: 'Gastronómico',
    mistico: 'Místico',
    fotografico: 'Fotográfico'
  };

  const workZoneNames = {
    'cusco-ciudad': 'Cusco Ciudad',
    'valle-sagrado': 'Valle Sagrado',
    'machu-picchu': 'Machu Picchu',
    'sur-valle': 'Sur del Valle',
    'otros': 'Otros destinos'
  };

  const languageNames = {
    es: 'Español',
    en: 'Inglés',
    fr: 'Francés',
    de: 'Alemán',
    it: 'Italiano',
    pt: 'Portugués',
    ja: 'Japonés',
    ko: 'Coreano',
    zh: 'Chino',
    ru: 'Ruso'
  };

  const groupTypeNames = {
    children: 'Niños',
    schools: 'Colegios',
    elderly: 'Adultos mayores',
    corporate: 'Corporativo',
    vip: 'VIP',
    specialNeeds: 'Necesidades especiales'
  };

  const museumNames = {
    larco: t('auth.larcoMuseum'),
    gold: t('auth.goldMuseum'),
    national: t('auth.nationalMuseum'),
    art: t('auth.artMuseum'),
    archaeology: t('auth.archaeologyMuseum'),
    history: t('auth.historyMuseum'),
    contemporary: t('auth.contemporaryArt'),
    colonial: t('auth.colonialArt'),
    // Museos adicionales de Cusco
    qorikancha: 'Museo Qorikancha',
    inca: 'Museo Inca',
    chocolate: 'Museo del Chocolate'
  };

  useEffect(() => {
    loadGuideData();
  }, [guideId]);

  const loadGuideData = async () => {
    try {
      await fetchGuideProfile(guideId);
      await fetchGuideReviews(guideId);
    } catch (error) {
      console.error('Error loading guide:', error);
      navigate('/marketplace');
    }
  };

  const handleBooking = () => {
    navigate(`/marketplace/book/${guideId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Guía turístico: ${guide.fullName}`,
        text: guide.profile.bio,
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentGuide) {
    return null;
  }

  const guide = currentGuide;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen de fondo */}
      <div className="relative h-96 bg-gradient-to-br from-cyan-600 to-blue-600">
        {guide.profileData?.photos && guide.profileData.photos.length > 0 && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={guide.profileData.photos[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Navegación */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center text-white hover:text-cyan-200 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Volver al marketplace
          </button>
        </div>

        {/* Información principal */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              <img
                src={guide.profileData?.avatar || `https://ui-avatars.com/api/?name=${guide.name}&background=random`}
                alt={guide.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      {guide.name}
                      {guide.verified && (
                        <CheckBadgeIcon className="h-8 w-8 text-cyan-400" />
                      )}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold">{guide.rating?.toFixed(1) || '0.0'}</span>
                        <span>({guide.reviewCount || 0} reseñas)</span>
                      </div>
                      <span>•</span>
                      <span>{guide.completedTours || 0} tours completados</span>
                      <span>•</span>
                      <span>Se unió en {new Date(guide.joinedDate || Date.now()).getFullYear()}</span>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isFavorite ? (
                        <HeartIcon className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartOutlineIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ShareIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['about', 'experience', 'reviews', 'availability'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'about' && 'Acerca de'}
                      {tab === 'experience' && 'Experiencia'}
                      {tab === 'reviews' && 'Reseñas'}
                      {tab === 'availability' && 'Disponibilidad'}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Tab: Acerca de */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre mí</h3>
                      <p className="text-gray-600">{guide.bio || 'Guía profesional especializado en turismo cultural e histórico.'}</p>
                    </div>

                    {/* Video presentación */}
                    {guide.profileData?.videoPresentation && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Video de presentación</h3>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors">
                            <PlayIcon className="h-16 w-16 text-white" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Galería de fotos */}
                    {guide.profileData?.photos && guide.profileData.photos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Galería</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {guide.profileData.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedPhoto(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Idiomas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <LanguageIcon className="h-5 w-5 text-gray-400" />
                        Idiomas
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {guide.languages?.map((lang, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{lang}</p>
                              <p className="text-sm text-gray-600">Nativo</p>
                            </div>
                          </div>
                        )) || (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Español</p>
                              <p className="text-sm text-gray-600">Nativo</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        Especialidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {guide.specialties?.map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                          >
                            {type}
                          </span>
                        )) || (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                            Cultural
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Zonas de trabajo */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        Zonas de trabajo
                      </h3>
                      <div className="space-y-2">
                        {guide.workZones?.map((zone, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-700">{zone}</span>
                          </div>
                        )) || (
                          <div className="flex items-start gap-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-700">Lima, Perú</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experiencia en Museos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                        Experiencia en Museos
                      </h3>
                      <p className="text-gray-500 italic">Información no disponible</p>
                    </div>
                  </div>
                )}

                {/* Tab: Experiencia */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    {/* Experiencia con grupos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        Experiencia con diferentes grupos
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Todos los grupos</h4>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Experto
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {guide.yearsOfExperience || 5} años de experiencia
                        </p>
                      </div>
                    </div>

                    {/* Certificaciones */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        Certificaciones
                      </h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Guía Oficial de Turismo</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Emitido por: MINCETUR
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Certificado vigente
                            </p>
                          </div>
                          <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {guide.completedTours || 0}
                          </p>
                          <p className="text-sm text-gray-600">Tours realizados</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            95%
                          </p>
                          <p className="text-sm text-gray-600">Tasa de aceptación</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            15 min
                          </p>
                          <p className="text-sm text-gray-600">Tiempo de respuesta</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {Math.floor((guide.completedTours || 0) * 0.3)}
                          </p>
                          <p className="text-sm text-gray-600">Clientes recurrentes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Reseñas */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Resumen de calificaciones */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <p className="text-5xl font-bold text-gray-900">
                            {guide.rating?.toFixed(1) || '4.8'}
                          </p>
                          <div className="flex justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-6 w-6 ${
                                  i < Math.round(guide.rating || 4.8)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {guide.reviewCount || 0} reseñas
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {[
                            { key: 'communication', label: 'Comunicación', value: 4.9 },
                            { key: 'knowledge', label: 'Conocimiento', value: 4.8 },
                            { key: 'punctuality', label: 'Puntualidad', value: 4.7 },
                            { key: 'professionalism', label: 'Profesionalismo', value: 4.9 },
                            { key: 'valueForMoney', label: 'Calidad-precio', value: 4.6 }
                          ].map(({ key, label, value }) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 w-28">{label}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-cyan-500 h-2 rounded-full"
                                  style={{ width: `${(value / 5) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8">
                                {value.toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lista de reseñas */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.ratings.overall
                                          ? 'text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.review.title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(review.metadata.createdAt).toLocaleDateString()} • 
                                Grupo de {review.metadata.groupSize} personas
                              </p>
                            </div>
                            {review.metadata.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Verificado
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{review.review.content}</p>
                          
                          {review.response && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Respuesta del guía:
                              </p>
                              <p className="text-sm text-gray-600">{review.response.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Disponibilidad */}
                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        La disponibilidad se muestra en tiempo real. Los horarios pueden cambiar según las reservas confirmadas.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Horario de trabajo</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => {
                          const isWorkingDay = index < 6; // Lunes a Sábado disponible por defecto
                          
                          return (
                            <div
                              key={day}
                              className={`text-center py-2 rounded-lg ${
                                isWorkingDay
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              <p className="font-medium">{day}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecciona una fecha en el proceso de reserva para ver los horarios disponibles
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Tarjeta de reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  ${guide.hourlyRate || '25'}
                  <span className="text-base font-normal text-gray-500">/hora</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Mínimo 4 horas
                </p>
              </div>

              {/* Tarifas especiales */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-900">Tarifas:</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Medio día (4h)</span>
                    <span className="font-medium">S/. {(guide.hourlyRate || 25) * 4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Día completo (8h)</span>
                    <span className="font-medium">S/. {(guide.hourlyRate || 25) * 7}</span>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span>Responde en ~15 minutos</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>Reserva con 2 días de anticipación</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <span>Grupos hasta {guide.maxGroupSize || '15'} personas</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <span>Depósito del 30%</span>
                </div>
              </div>

              {/* Política de cancelación */}
              <div className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">Política de cancelación:</p>
                <p>Cancelación gratuita hasta 24 horas antes del tour. Después se cobra el 50% del total.</p>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                >
                  Solicitar servicio
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Enviar mensaje
                </button>
              </div>

              {/* Garantías */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>
                    Todos nuestros guías están verificados y cuentan con seguro de responsabilidad civil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideMarketplaceProfile;