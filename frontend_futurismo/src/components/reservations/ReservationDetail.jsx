import { XMarkIcon, CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, PhoneIcon, CurrencyDollarIcon, DocumentTextIcon, ArrowDownTrayIcon, PencilIcon, CheckCircleIcon, ExclamationTriangleIcon, BuildingOfficeIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { paymentVoucherService } from '../../services/paymentVoucherService';

const ReservationDetail = ({ reservation, onClose }) => {
  const { t } = useTranslation();
  
  if (!reservation) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'text-green-600 bg-green-50';
      case 'pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'cancelada': return 'text-red-600 bg-red-50';
      case 'completada': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'pagado': return 'text-green-600 bg-green-50';
      case 'pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'reembolsado': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };


  const handleDownloadVoucher = () => {
    try {
      paymentVoucherService.downloadVoucher(reservation, `nota-pago-${reservation.id}.pdf`);
      toast.success('Nota de pago descargada exitosamente');
    } catch (error) {
      console.error('Error downloading voucher:', error);
      toast.error('Error al descargar la nota de pago');
    }
  };

  const handleConfirmPayment = () => {
    // Implementar confirmación de pago
    // TODO: Implementar confirmación de pago
    toast('Función de confirmar pago aún no implementada', { icon: 'ℹ️' });
  };

  const handlePreviewVoucher = () => {
    try {
      paymentVoucherService.previewVoucher(reservation);
    } catch (error) {
      console.error('Error previewing voucher:', error);
      toast.error('Error al previsualizar la nota de pago');
    }
  };

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Reserva #{reservation.id}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Creada el {formatters.formatDateTime(reservation.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Estados */}
            <div className="flex gap-4">
              <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(reservation.status)}`}>
                Estado: {reservation.status}
              </div>
              <div className={`px-4 py-2 rounded-full font-medium ${getPaymentColor(reservation.paymentStatus)}`}>
                Pago: {reservation.paymentStatus}
              </div>
            </div>

            {/* Información del Tour */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Información del Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tour</p>
                  <p className="font-medium">{reservation.tourName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatters.formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{reservation.time}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pasajeros</p>
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      {reservation.adults} adultos
                      {reservation.children > 0 && `, ${reservation.children} niños`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lugar de Recojo</p>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservation.pickupLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de los Grupos */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                Grupos de la Reserva ({(reservation.groups || []).length || 1})
              </h3>
              
              {/* Si hay grupos múltiples */}
              {reservation.groups && reservation.groups.length > 0 ? (
                <div className="space-y-4">
                  {reservation.groups.map((group, index) => (
                    <div key={index} className="border border-blue-200 rounded-lg p-4 bg-white">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Grupo #{index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Representante</p>
                          <p className="font-medium">{group.representativeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{group.representativePhone}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Personas</p>
                          <p className="font-medium">
                            {(group.companionsCount || 0) + 1} persona{((group.companionsCount || 0) + 1) !== 1 ? 's' : ''}
                            <span className="text-sm text-gray-500 ml-1">
                              ({group.companionsCount || 0} acompañantes + representante)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Compatibilidad con reservas anteriores */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Representante</p>
                    <p className="font-medium">{reservation.representativeName || reservation.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{reservation.representativePhone || reservation.clientPhone}</span>
                    </div>
                  </div>
                  {reservation.representativeEmail && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{reservation.representativeEmail}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Información de Integrantes del Grupo */}
            {(reservation.groupMembers && reservation.groupMembers.length > 0) || (reservation.companions && reservation.companions.length > 0) && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
                  Integrantes del Grupo ({(reservation.groupMembers || reservation.companions || []).length})
                </h3>
                <div className="space-y-4">
                  {(reservation.groupMembers || reservation.companions || []).map((member, index) => {
                    const isMinor = member.age && member.age < 18;
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center mb-3">
                          <UserIcon className="w-4 h-4 mr-2 text-green-500" />
                          <h4 className="font-medium text-gray-900">
                            Integrante #{index + 1}
                            {isMinor && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Menor de edad
                              </span>
                            )}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="font-medium">{member.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Documento</p>
                            <p className="font-medium">{member.document || 'No especificado'}</p>
                          </div>
                          {member.age && (
                            <div>
                              <p className="text-sm text-gray-600">Edad</p>
                              <p className="font-medium">{member.age} años</p>
                            </div>
                          )}
                          {member.phone && (
                            <div>
                              <p className="text-sm text-gray-600">Teléfono</p>
                              <div className="flex items-center gap-1">
                                <PhoneIcon className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{member.phone}</span>
                              </div>
                            </div>
                          )}
                          {member.guardianName && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600">Tutor/Responsable</p>
                              <p className="font-medium text-orange-700">{member.guardianName}</p>
                            </div>
                          )}
                          {/* Compatibilidad con el formato anterior */}
                          {member.relationship && (
                            <div>
                              <p className="text-sm text-gray-600">Relación</p>
                              <p className="font-medium capitalize">{member.relationship}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Información de Pago */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Información de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">S/. {reservation.total}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">S/. {reservation.total}</span>
                </div>
              </div>

              {reservation.paymentStatus === 'pendiente' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Pago Pendiente</p>
                      <p className="text-yellow-700 mt-1">
                        El cliente debe realizar el pago antes del {formatters.formatDate(new Date(reservation.date.getTime() - 86400000))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notas adicionales */}
            {reservation.specialRequirements && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Requerimientos Especiales</h3>
                <p className="text-gray-700">{reservation.specialRequirements}</p>
              </div>
            )}

            {/* Historial de actividad */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Historial de Actividad</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reserva creada</p>
                    <p className="text-xs text-gray-500">{formatters.formatDateTime(reservation.createdAt)}</p>
                  </div>
                </div>
                {reservation.status === 'confirmada' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reserva confirmada</p>
                      <p className="text-xs text-gray-500">Hace 2 días</p>
                    </div>
                  </div>
                )}
                {reservation.paymentStatus === 'pagado' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pago confirmado</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handlePreviewVoucher}
              className="btn btn-outline flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              Previsualizar
            </button>
            <button
              onClick={handleDownloadVoucher}
              className="btn btn-outline flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Descargar Voucher
            </button>
          </div>

          <div className="flex gap-3">
            {reservation.paymentStatus === 'pendiente' && (
              <button
                onClick={handleConfirmPayment}
                className="btn btn-success flex items-center gap-2"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Confirmar Pago
              </button>
            )}
            <button className="btn btn-primary flex items-center gap-2">
              <PencilIcon className="w-4 h-4" />
              Editar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;