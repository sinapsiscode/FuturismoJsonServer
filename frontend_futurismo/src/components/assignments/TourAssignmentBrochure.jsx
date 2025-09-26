import React, { forwardRef } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const TourAssignmentBrochure = forwardRef(({ assignment }, ref) => {
  const {
    tourDate,
    tourTime,
    tourName,
    groupSize,
    agency,
    guide,
    driver,
    vehicle,
    pickupLocation,
    notes
  } = assignment || {};

  // Verificar que todos los datos necesarios estén disponibles
  if (!guide || !driver || !vehicle) {
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto text-center">
        <div className="text-gray-500">
          <p>Selecciona guía, chofer y vehículo para generar el brochure</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl mr-3">🌎</span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">FUTURISMO TOURS</h1>
            <p className="text-lg text-blue-600 font-medium">Sistema de Gestión Turística B2B</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">ASIGNACIÓN DE TOUR</h2>
          <p className="text-blue-700">Información detallada del servicio asignado</p>
        </div>
      </div>

      {/* Tour Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
            Información del Tour
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Tour:</span>
              <span className="font-bold text-gray-900">{tourName || 'No especificado'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Fecha:</span>
              <span className="font-bold text-gray-900">{tourDate ? new Date(tourDate).toLocaleDateString('es-PE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'No especificada'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Hora:</span>
              <span className="font-bold text-gray-900">{tourTime || 'No especificada'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Grupo:</span>
              <span className="font-bold text-gray-900">{groupSize || 0} personas</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-600">Agencia:</span>
              <span className="font-bold text-blue-600">{agency?.name || 'No especificada'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPinIcon className="h-6 w-6 text-green-600 mr-2" />
            Punto de Encuentro
          </h3>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-lg font-bold text-gray-900 mb-2">{pickupLocation?.name || 'No especificado'}</p>
            <p className="text-gray-600 mb-2">{pickupLocation?.address || 'Dirección no especificada'}</p>
            <p className="text-sm text-gray-500">
              <strong>Referencia:</strong> {pickupLocation?.reference || 'No especificada'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Assignment */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-blue-50 py-3 rounded-lg">
          EQUIPO ASIGNADO
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guide */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
                <img 
                  src={guide?.photo || 'https://via.placeholder.com/150?text=Guía'} 
                  alt={guide?.name || 'Guía'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-blue-800 mb-1">GUÍA TURÍSTICO</h4>
              <h5 className="text-xl font-bold text-gray-900">{guide?.name || 'No asignado'}</h5>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">{guide?.phone || 'No disponible'}</span>
              </div>
              <div className="flex items-center">
                <IdentificationIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span>Licencia: {guide?.license || 'No disponible'}</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Rating: {guide?.rating || 'N/A'} ⭐</span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600">
                  <strong>Especialidades:</strong> {guide?.specialties?.join(', ') || 'No especificadas'}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  <strong>Idiomas:</strong> {guide?.languages?.join(', ') || 'No especificados'}
                </p>
              </div>
            </div>
          </div>

          {/* Driver */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-500">
                <img 
                  src={driver?.photo || 'https://via.placeholder.com/150?text=Chofer'} 
                  alt={driver?.name || 'Chofer'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-green-800 mb-1">CHOFER</h4>
              <h5 className="text-xl font-bold text-gray-900">{driver?.name || 'No asignado'}</h5>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">{driver?.phone || 'No disponible'}</span>
              </div>
              <div className="flex items-center">
                <IdentificationIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span>Licencia: {driver?.license || 'No disponible'}</span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600">
                  <strong>Experiencia:</strong> {driver?.experience || 'N/A'} años
                </p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  <strong>Certificaciones:</strong> {driver?.certifications?.join(', ') || 'No especificadas'}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden border-4 border-purple-500">
                <img 
                  src={vehicle?.photo || 'https://via.placeholder.com/150?text=Vehículo'} 
                  alt={vehicle?.model || 'Vehículo'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-purple-800 mb-1">VEHÍCULO</h4>
              <h5 className="text-xl font-bold text-gray-900">{vehicle?.brand || 'No'} {vehicle?.model || 'asignado'}</h5>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Placa:</span>
                <span className="font-bold">{vehicle?.plate || 'No disponible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Año:</span>
                <span className="font-bold">{vehicle?.year || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-bold">{vehicle?.color || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacidad:</span>
                <span className="font-bold">{vehicle?.capacity || 'N/A'} pasajeros</span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600">
                  <strong>Características:</strong> {vehicle?.features?.join(', ') || 'No especificadas'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      {notes && (
        <div className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
              <svg className="h-5 w-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              NOTAS IMPORTANTES
            </h3>
            <p className="text-yellow-800">{notes}</p>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-red-50 p-3 rounded-lg text-center">
          CONTACTOS DE EMERGENCIA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-800">Central Futurismo</h4>
            <p className="text-red-700">📞 +51 999 999 999</p>
            <p className="text-red-700">📧 emergencias@futurismo.com</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-800">Coordinador de Turno</h4>
            <p className="text-red-700">📞 +51 888 888 888</p>
            <p className="text-red-700">WhatsApp: +51 777 777 777</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-blue-600 pt-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-800">Dirección</h4>
            <p>Av. Larco 123, Miraflores</p>
            <p>Lima, Perú</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Contacto</h4>
            <p>📞 +51 999 999 999</p>
            <p>📧 info@futurismo.com</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Web</h4>
            <p>🌐 www.futurismo.com</p>
            <p>📱 @futurismotours</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Documento generado el {new Date().toLocaleDateString('es-PE')} a las {new Date().toLocaleTimeString('es-PE')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} Futurismo Tours - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
});

TourAssignmentBrochure.displayName = 'TourAssignmentBrochure';

export default TourAssignmentBrochure;