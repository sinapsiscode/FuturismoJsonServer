import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CameraIcon, 
  CalendarIcon, 
  UserIcon, 
  MapPinIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const TourPhotosGallery = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    guide: '',
    tour: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock data - En producción esto vendría del backend
  useEffect(() => {
    const mockPhotos = [
      {
        id: '1',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        tourId: 'tour-1',
        tourName: 'Tour Lima Histórica',
        stopName: 'Plaza de Armas',
        guideName: 'Carlos Mendoza',
        guideId: 'guide-1',
        agencyName: 'Aventura Tours',
        timestamp: new Date('2024-01-15T10:30:00'),
        comment: 'Grupo disfrutando de la explicación histórica'
      },
      {
        id: '2',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        tourId: 'tour-1',
        tourName: 'Tour Lima Histórica',
        stopName: 'Catedral de Lima',
        guideName: 'Carlos Mendoza',
        guideId: 'guide-1',
        agencyName: 'Aventura Tours',
        timestamp: new Date('2024-01-15T11:15:00'),
        comment: 'Vista panorámica de la catedral'
      },
      {
        id: '3',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        tourId: 'tour-2',
        tourName: 'Tour Gastronómico',
        stopName: 'Mercado Central',
        guideName: 'María García',
        guideId: 'guide-2',
        agencyName: 'Peru Experiences',
        timestamp: new Date('2024-01-15T09:45:00'),
        comment: 'Degustación de frutas locales'
      },
      {
        id: '4',
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/200/150',
        tourId: 'tour-3',
        tourName: 'Tour Barranco Artístico',
        stopName: 'Puente de los Suspiros',
        guideName: 'Luis Rodríguez',
        guideId: 'guide-3',
        agencyName: 'Cultural Tours',
        timestamp: new Date('2024-01-14T16:20:00'),
        comment: 'Atardecer en el puente'
      }
    ];

    setTimeout(() => {
      setPhotos(mockPhotos);
      setFilteredPhotos(mockPhotos);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar fotos cuando cambian los filtros
  useEffect(() => {
    let filtered = [...photos];

    // Filtro por fecha
    if (filters.date) {
      filtered = filtered.filter(photo => 
        formatters.formatDate(photo.timestamp) === filters.date
      );
    }

    // Filtro por guía
    if (filters.guide) {
      filtered = filtered.filter(photo => 
        photo.guideName.toLowerCase().includes(filters.guide.toLowerCase())
      );
    }

    // Filtro por tour
    if (filters.tour) {
      filtered = filtered.filter(photo => 
        photo.tourName.toLowerCase().includes(filters.tour.toLowerCase())
      );
    }

    // Búsqueda general
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.tourName.toLowerCase().includes(searchLower) ||
        photo.stopName.toLowerCase().includes(searchLower) ||
        photo.guideName.toLowerCase().includes(searchLower) ||
        photo.agencyName.toLowerCase().includes(searchLower) ||
        (photo.comment && photo.comment.toLowerCase().includes(searchLower))
      );
    }

    setFilteredPhotos(filtered);
  }, [filters, photos]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowPreview(true);
  };

  const handleDownload = (photo) => {
    // Implementar descarga
    console.log('Descargando foto:', photo.id);
  };

  const handleDelete = (photoId) => {
    if (window.confirm(t('monitoring.photos.confirmDelete'))) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setShowPreview(false);
    }
  };

  // Obtener lista única de guías y tours para filtros
  const uniqueGuides = [...new Set(photos.map(p => p.guideName))];
  const uniqueTours = [...new Set(photos.map(p => p.tourName))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" />
            {t('monitoring.photos.filters')}
          </h3>
          <button
            onClick={() => setFilters({ date: '', guide: '', tour: '', search: '' })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('monitoring.photos.clearFilters')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('monitoring.photos.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por fecha */}
          <div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por guía */}
          <div>
            <select
              value={filters.guide}
              onChange={(e) => handleFilterChange('guide', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('monitoring.photos.allGuides')}</option>
              {uniqueGuides.map(guide => (
                <option key={guide} value={guide}>{guide}</option>
              ))}
            </select>
          </div>

          {/* Filtro por tour */}
          <div>
            <select
              value={filters.tour}
              onChange={(e) => handleFilterChange('tour', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('monitoring.photos.allTours')}</option>
              {uniqueTours.map(tour => (
                <option key={tour} value={tour}>{tour}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-4 text-sm text-gray-600">
          {t('monitoring.photos.showingResults', { count: filteredPhotos.length })}
        </div>
      </div>

      {/* Galería de fotos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map(photo => (
              <div
                key={photo.id}
                className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePhotoClick(photo)}
              >
                {/* Imagen */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={photo.thumbnail}
                    alt={photo.comment || photo.stopName}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoClick(photo);
                        }}
                        className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                        title={t('monitoring.photos.view')}
                      >
                        <EyeIcon className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                        className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                        title={t('monitoring.photos.download')}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Información */}
                <div className="p-3 space-y-1">
                  <h4 className="font-medium text-sm truncate">{photo.tourName}</h4>
                  <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3" />
                    {photo.stopName}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {photo.guideName}
                    </span>
                    <span>{formatters.formatTime(photo.timestamp)}</span>
                  </div>
                  {photo.comment && (
                    <p className="text-xs text-gray-600 italic truncate">"{photo.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('monitoring.photos.noPhotos')}
            </h3>
            <p className="text-gray-600">
              {t('monitoring.photos.noPhotosDescription')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de preview */}
      {showPreview && selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => {
            setShowPreview(false);
            setSelectedPhoto(null);
          }}
        >
          <div 
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con información */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 text-white">
              <h3 className="text-lg font-semibold">{selectedPhoto.tourName}</h3>
              <p className="text-sm opacity-90">{selectedPhoto.stopName}</p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span>{selectedPhoto.guideName}</span>
                <span>{formatters.formatTime(selectedPhoto.timestamp)}</span>
              </div>
            </div>
            
            {/* Botón de cerrar */}
            <button
              onClick={() => {
                setShowPreview(false);
                setSelectedPhoto(null);
              }}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            
            {/* Imagen */}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.comment || selectedPhoto.stopName}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {/* Footer con acciones y comentario */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              {selectedPhoto.comment && (
                <p className="text-white text-sm mb-3 italic">"{selectedPhoto.comment}"</p>
              )}
              <div className="flex items-center justify-between">
                <div className="text-white text-sm">
                  <span className="opacity-75">Agencia:</span> {selectedPhoto.agencyName}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(selectedPhoto)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {t('monitoring.photos.download')}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    {t('monitoring.photos.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPhotosGallery;