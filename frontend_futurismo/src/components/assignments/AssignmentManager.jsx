import React, { useState, useRef, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import {
  CalendarIcon,
  UserGroupIcon,
  TruckIcon,
  PhoneIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import TourAssignmentBrochure from './TourAssignmentBrochure';
import TourAssignmentBrochurePDF from './TourAssignmentBrochurePDF';
import useGuidesStore from '../../stores/guidesStore';
import useDriversStore from '../../stores/driversStore';
import useVehiclesStore from '../../stores/vehiclesStore';

const AssignmentManager = ({ reservation, onAssignmentComplete }) => {
  const [assignment, setAssignment] = useState({
    tourDate: reservation?.date || '',
    tourTime: reservation?.time || '',
    tourName: reservation?.tourName || '',
    groupSize: reservation?.groupSize || 0,
    agency: reservation?.agency || {},
    guide: null,
    driver: null,
    vehicle: null,
    pickupLocation: reservation?.pickupLocation || {},
    notes: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const brochureRef = useRef();

  // Get data from stores
  const { guides: guidesData, fetchGuides } = useGuidesStore();
  const { drivers: driversData, fetchDrivers } = useDriversStore();
  const { vehicles: vehiclesData, fetchVehicles } = useVehiclesStore();

  // Load data on mount
  useEffect(() => {
    fetchGuides();
    fetchDrivers();
    fetchVehicles();
  }, [fetchGuides, fetchDrivers, fetchVehicles]);

  // Transform guides data
  const availableGuides = (guidesData || []).map(guide => ({
    id: guide.id,
    name: guide.name || `${guide.firstName || ''} ${guide.lastName || ''}`.trim(),
    phone: guide.phone || guide.phoneNumber || 'N/A',
    license: guide.license || guide.licenseNumber || 'N/A',
    rating: guide.rating || guide.averageRating || 0,
    specialties: guide.specialties || guide.specializations || [],
    languages: guide.languages || ['Español'],
    photo: guide.photo || guide.avatar || guide.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(guide.name || 'Guía')
  }));

  // Transform drivers data
  const availableDrivers = (driversData || []).map(driver => ({
    id: driver.id,
    name: driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim(),
    phone: driver.phone || driver.phoneNumber || 'N/A',
    license: driver.license || driver.licenseNumber || driver.license_number || 'N/A',
    experience: driver.experience || driver.yearsExperience || 0,
    certifications: driver.certifications || [],
    photo: driver.photo || driver.avatar || driver.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(driver.name || 'Chofer')
  }));

  // Transform vehicles data
  const availableVehicles = (vehiclesData || []).map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.brand || 'N/A',
    model: vehicle.model || 'N/A',
    plate: vehicle.plate || vehicle.licensePlate || 'N/A',
    year: vehicle.year || vehicle.manufactureYear || new Date().getFullYear(),
    color: vehicle.color || 'N/A',
    capacity: vehicle.capacity || vehicle.maxCapacity || 0,
    features: vehicle.features || vehicle.amenities || [],
    photo: vehicle.photo || vehicle.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop'
  }));

  const handleAssignmentChange = (field, value) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePDF = async () => {
    if (!isAssignmentComplete) {
      alert('Por favor completa la asignación antes de generar el PDF');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generar el PDF usando @react-pdf/renderer
      const blob = await pdf(<TourAssignmentBrochurePDF assignment={assignment} />).toBlob();
      
      // Crear URL para descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Asignacion_${assignment.agency?.name || 'Tour'}_${assignment.tourDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!assignment.agency.whatsapp) {
      alert('La agencia no tiene número de WhatsApp registrado');
      return;
    }

    setIsSending(true);
    
    try {
      // Simular envío por WhatsApp (en una app real, esto sería una API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const message = encodeURIComponent(`
🌎 *FUTURISMO TOURS*
📋 *ASIGNACIÓN DE TOUR*

📅 *Tour:* ${assignment.tourName}
📆 *Fecha:* ${new Date(assignment.tourDate).toLocaleDateString('es-PE')}
⏰ *Hora:* ${assignment.tourTime}
👥 *Grupo:* ${assignment.groupSize} personas

👨‍🏫 *Guía:* ${assignment.guide?.name}
📞 ${assignment.guide?.phone}

🚗 *Chofer:* ${assignment.driver?.name}
📞 ${assignment.driver?.phone}

🚙 *Vehículo:* ${assignment.vehicle?.brand} ${assignment.vehicle?.model}
🔢 *Placa:* ${assignment.vehicle?.plate}

📍 *Punto de encuentro:* ${assignment.pickupLocation?.name}

✅ Su brochure detallado ha sido enviado por email.

¡Gracias por confiar en Futurismo Tours!
      `);

      const whatsappUrl = `https://wa.me/${assignment.agency.whatsapp.replace(/[^\d]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      setIsSending(false);
      
      // Marcar como enviado
      if (onAssignmentComplete) {
        onAssignmentComplete(assignment);
      }
      
      alert('¡Asignación enviada exitosamente por WhatsApp!');
      
    } catch (error) {
      setIsSending(false);
      alert('Error al enviar por WhatsApp: ' + error.message);
    }
  };

  const isAssignmentComplete = assignment.guide && assignment.driver && assignment.vehicle;

  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
            Asignación de Tour
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={!isAssignmentComplete}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAssignmentComplete
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {showPreview ? 'Ocultar' : 'Vista Previa'}
            </button>
          </div>
        </div>

        {/* Tour Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Información del Tour</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tour:</span>
              <p className="font-medium">{assignment.tourName}</p>
            </div>
            <div>
              <span className="text-gray-600">Fecha:</span>
              <p className="font-medium">{new Date(assignment.tourDate).toLocaleDateString('es-PE')}</p>
            </div>
            <div>
              <span className="text-gray-600">Grupo:</span>
              <p className="font-medium">{assignment.groupSize} personas</p>
            </div>
            <div>
              <span className="text-gray-600">Agencia:</span>
              <p className="font-medium text-blue-600">{assignment.agency.name}</p>
            </div>
          </div>
        </div>

        {/* Assignment Selections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guide Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
              Seleccionar Guía
            </h3>
            <div className="space-y-3">
              {availableGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => handleAssignmentChange('guide', guide)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    assignment.guide?.id === guide.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{guide.name}</p>
                      <p className="text-sm text-gray-600">
                        ⭐ {guide.rating} • {(guide.languages && guide.languages.length > 0) ? guide.languages.join(', ') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <TruckIcon className="h-5 w-5 text-green-600 mr-2" />
              Seleccionar Chofer
            </h3>
            <div className="space-y-3">
              {availableDrivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => handleAssignmentChange('driver', driver)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    assignment.driver?.id === driver.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-600">{driver.experience} años • {driver.license}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <TruckIcon className="h-5 w-5 text-purple-600 mr-2" />
              Seleccionar Vehículo
            </h3>
            <div className="space-y-3">
              {availableVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleAssignmentChange('vehicle', vehicle)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    assignment.vehicle?.id === vehicle.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={vehicle.photo}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-sm text-gray-600">{vehicle.plate} • {vehicle.capacity} pax</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Especiales
          </label>
          <textarea
            value={assignment.notes}
            onChange={(e) => handleAssignmentChange('notes', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Instrucciones especiales, detalles adicionales..."
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center">
            {isAssignmentComplete ? (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Asignación completa</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Selecciona guía, chofer y vehículo</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGeneratePDF}
              disabled={!isAssignmentComplete || isGenerating}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAssignmentComplete
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </button>

            <button
              onClick={handleSendWhatsApp}
              disabled={!isAssignmentComplete || isSending}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAssignmentComplete
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              {isSending ? 'Enviando...' : 'Enviar WhatsApp'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && isAssignmentComplete && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Brochure</h3>
          </div>
          <div className="max-h-screen overflow-y-auto">
            <TourAssignmentBrochure ref={brochureRef} assignment={assignment} />
          </div>
        </div>
      )}

    </div>
  );
};

export default AssignmentManager;