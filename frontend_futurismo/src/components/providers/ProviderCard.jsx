import { StarIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, PencilIcon, TrashIcon, EyeIcon, ClockIcon, CurrencyDollarIcon, TrophyIcon } from '@heroicons/react/24/outline';

const ProviderCard = ({ 
  provider, 
  locationName, 
  categoryInfo, 
  onEdit, 
  onDelete, 
  layout = 'card' 
}) => {
  const formatPrice = (pricing) => {
    if (!pricing) return 'No especificado';
    
    const typeLabels = {
      per_night: 'por noche',
      per_person: 'por persona', 
      per_day: 'por día',
      per_hour: 'por hora'
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
    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Categoría y estado */}
            <div className="flex-shrink-0">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                bg-${categoryInfo?.color || 'gray'}-100
              `}>
                {categoryInfo?.icon || '📦'}
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {provider.name}
                </h3>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${provider.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {provider.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {locationName}
                </span>
                <span className="flex items-center">
                  {categoryInfo?.icon} {categoryInfo?.name}
                </span>
                <span className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                  {provider.rating}
                </span>
                {provider.capacity && (
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {provider.capacity}
                  </span>
                )}
              </div>
            </div>

            {/* Precio */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(provider.pricing)}
              </div>
              <div className="text-sm text-gray-500">
                {provider.contact.contactPerson}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit()}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete()}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
      {/* Header con categoría */}
      <div className={`
        p-4 border-b border-gray-100
        bg-${categoryInfo?.color || 'gray'}-50
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{categoryInfo?.icon || '📦'}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{categoryInfo?.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {locationName}
              </p>
            </div>
          </div>
          
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${provider.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}>
            {provider.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {provider.name}
          </h4>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(provider.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({provider.rating}/5)
            </span>
          </div>
        </div>

        {/* Servicios */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Servicios:</h5>
          <div className="flex flex-wrap gap-1">
            {provider.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                +{provider.services.length - 3} más
              </span>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Precio base:</span>
            <span className="font-medium text-gray-900">
              {formatPrice(provider.pricing)}
            </span>
          </div>
          
          {provider.capacity && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacidad:</span>
              <span className="font-medium text-gray-900 flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                {provider.capacity} personas
              </span>
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="space-y-1 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <PhoneIcon className="w-3 h-3 mr-2" />
            {provider.contact.phone}
          </div>
          <div className="flex items-center text-gray-600">
            <EnvelopeIcon className="w-3 h-3 mr-2" />
            {provider.contact.email}
          </div>
        </div>

        {/* Especialidades (si es guía) */}
        {provider.specialties && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Especialidades:</h5>
            <div className="flex flex-wrap gap-1">
              {provider.specialties.slice(0, 2).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas (si es guía) */}
        {provider.languages && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Idiomas:</h5>
            <div className="flex flex-wrap gap-1">
              {provider.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Contacto: {provider.contact.contactPerson}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit()}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              title="Editar proveedor"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete()}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              title="Eliminar proveedor"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;