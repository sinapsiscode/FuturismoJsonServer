import { StarIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, PencilIcon, TrashIcon, BuildingOffice2Icon, HomeIcon, TruckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const ProviderCard = ({
  provider,
  locationName,
  categoryInfo,
  onEdit,
  onDelete,
  layout = 'card'
}) => {
  const { t } = useTranslation();

  // Mapeo de iconos por categoría
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      'hotel': '🏨',
      'restaurant': '🍽️',
      'transport': '🚗',
      'guide': '🗺️',
      'venue': '🏛️',
      'other': '📦'
    };

    // Si categoryInfo tiene el nombre completo, extraer la última parte
    const categoryKey = categoryInfo?.name?.split('.').pop() || categoryId;
    return iconMap[categoryKey] || iconMap['other'];
  };

  // Mapeo de colores por categoría
  const getCategoryColor = (categoryId) => {
    const colorMap = {
      'hotel': 'blue',
      'restaurant': 'orange',
      'transport': 'green',
      'guide': 'purple',
      'venue': 'pink',
      'other': 'gray'
    };

    const categoryKey = categoryInfo?.name?.split('.').pop() || categoryId;
    return colorMap[categoryKey] || colorMap['other'];
  };

  const formatPrice = (pricing) => {
    if (!pricing) return 'No especificado';

    const typeLabels = {
      per_night: 'por noche',
      per_person: 'por persona',
      per_day: 'por día',
      per_hour: 'por hora',
      fixed: ''
    };

    return `S/ ${pricing.basePrice} ${typeLabels[pricing.type] || ''}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (layout === 'list') {
    const categoryColor = getCategoryColor(provider.category);
    const categoryIcon = getCategoryIcon(provider.category);
    const categoryName = categoryInfo?.name ? t(categoryInfo.name) : 'Sin categoría';

    const colorClasses = {
      blue: { badge: 'bg-blue-100 text-blue-800' },
      orange: { badge: 'bg-orange-100 text-orange-800' },
      green: { badge: 'bg-green-100 text-green-800' },
      purple: { badge: 'bg-purple-100 text-purple-800' },
      pink: { badge: 'bg-pink-100 text-pink-800' },
      gray: { badge: 'bg-gray-100 text-gray-800' }
    };
    const colors = colorClasses[categoryColor] || colorClasses.gray;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Icono de categoría */}
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl ${colors.badge} flex items-center justify-center text-2xl shadow-sm`}>
              {categoryIcon}
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            {/* Nombre y estado */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {provider.name}
              </h3>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                provider.active
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-400 text-white'
              }`}>
                {provider.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {locationName || 'Sin ubicación'}
              </span>
              <span className="flex items-center">
                <span className="mr-1">{categoryIcon}</span>
                {categoryName}
              </span>
              <span className="flex items-center font-semibold text-yellow-600">
                <StarIconSolid className="w-4 h-4 mr-1 text-yellow-400" />
                {provider.rating?.toFixed(1) || '0.0'}
              </span>
              {provider.capacity && (
                <span className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  {provider.capacity} personas
                </span>
              )}
            </div>

            {/* Servicios en línea */}
            {provider.services && provider.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {provider.services.filter(s => s).slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className={`inline-block px-2 py-0.5 text-xs font-medium ${colors.badge} rounded`}
                  >
                    {service}
                  </span>
                ))}
                {provider.services.length > 3 && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                    +{provider.services.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Precio y contacto */}
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {formatPrice(provider.pricing)}
            </div>
            <div className="text-xs text-gray-600 mb-1">
              {provider.contact.contactPerson}
            </div>
            <div className="flex items-center justify-end text-xs text-gray-500">
              <PhoneIcon className="w-3 h-3 mr-1" />
              {provider.contact.phone}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit()}
              className="p-2 text-blue-700 hover:bg-blue-50 bg-blue-50/50 rounded-lg transition-colors"
              title="Editar"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete()}
              className="p-2 text-red-700 hover:bg-red-50 bg-red-50/50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Layout tipo card (por defecto)
  const categoryColor = getCategoryColor(provider.category);
  const categoryIcon = getCategoryIcon(provider.category);
  const categoryName = categoryInfo?.name ? t(categoryInfo.name) : 'Sin categoría';

  // Clases de color dinámicas (usando SafeList approach)
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      badge: 'bg-pink-100 text-pink-800'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      badge: 'bg-gray-100 text-gray-800'
    }
  };

  const colors = colorClasses[categoryColor] || colorClasses.gray;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header con categoría mejorado */}
      <div className={`${colors.bg} ${colors.border} border-b-2 p-4`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`${colors.badge} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
              {categoryIcon}
            </div>
            <div>
              <span className={`${colors.text} text-xs font-semibold uppercase tracking-wide`}>
                {categoryName}
              </span>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {locationName || 'Sin ubicación'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
            provider.active
              ? 'bg-green-500 text-white'
              : 'bg-gray-400 text-white'
          }`}>
            {provider.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Nombre del proveedor */}
        <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {provider.name}
        </h4>

        {/* Rating con estrellas */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStars(provider.rating)}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {provider.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-xs text-gray-500">/ 5</span>
        </div>
      </div>

      {/* Contenido principal rediseñado */}
      <div className="p-4 space-y-4">
        {/* Precio y capacidad destacados */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Precio base</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(provider.pricing)}
            </p>
          </div>
          {provider.capacity && (
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Capacidad</p>
              <p className="text-lg font-bold text-gray-900 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-1" />
                {provider.capacity}
              </p>
            </div>
          )}
        </div>

        {/* Servicios */}
        {provider.services && provider.services.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Servicios</h5>
            <div className="flex flex-wrap gap-1.5">
              {provider.services.filter(s => s).slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className={`inline-block px-2.5 py-1 text-xs font-medium ${colors.badge} rounded-md`}
                >
                  {service}
                </span>
              ))}
              {provider.services.length > 3 && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
                  +{provider.services.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Especialidades */}
        {provider.specialties && provider.specialties.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Especialidades</h5>
            <div className="flex flex-wrap gap-1.5">
              {provider.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-md"
                >
                  {specialty}
                </span>
              ))}
              {provider.specialties.length > 3 && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
                  +{provider.specialties.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {provider.languages && provider.languages.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Idiomas</h5>
            <div className="flex flex-wrap gap-1.5">
              {provider.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-block px-2.5 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-md"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contacto compacto */}
        <div className="pt-3 border-t border-gray-200">
          <h5 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Contacto</h5>
          <div className="space-y-1.5">
            <div className="flex items-center text-xs text-gray-600">
              <PhoneIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{provider.contact.phone}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <EnvelopeIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span className="truncate">{provider.contact.email}</span>
            </div>
            <div className="text-xs font-medium text-gray-900">
              {provider.contact.contactPerson}
            </div>
          </div>
        </div>
      </div>

      {/* Footer con acciones mejorado */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-2">
        <button
          onClick={() => onEdit()}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          title="Editar proveedor"
        >
          <PencilIcon className="w-4 h-4 mr-1.5" />
          Editar
        </button>

        <button
          onClick={() => onDelete()}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          title="Eliminar proveedor"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;