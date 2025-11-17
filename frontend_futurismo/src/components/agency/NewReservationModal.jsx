import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAgencyStore from '../../stores/agencyStore';
import toast from 'react-hot-toast';

const newReservationSchema = yup.object({
  serviceType: yup.string().required('El tipo de servicio es requerido'),
  date: yup.string().required('La fecha es requerida'),
  time: yup.string().required('La hora es requerida'),
  participants: yup.number()
    .required('Numero de participantes es requerido')
    .min(1, 'Minimo 1 participante'),
  pickupLocation: yup.string().required('El punto de recojo es requerido'),
  clientName: yup.string().required('El nombre del cliente es requerido'),
  clientPhone: yup.string()
    .required('El telefono es requerido')
    .matches(/^[0-9]{9}$/, 'El telefono debe tener 9 digitos'),
  clientEmail: yup.string().email('Email invalido'),
  totalAmount: yup.number()
    .required('El monto total es requerido')
    .min(1, 'El monto debe ser mayor a 0'),
  specialRequirements: yup.string().max(500, 'Maximo 500 caracteres')
});

const NewReservationModal = ({ isOpen, onClose, selectedDate = null }) => {
  const { t } = useTranslation();
  const { currentAgency, actions } = useAgencyStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(newReservationSchema),
    defaultValues: {
      serviceType: 'City Tour',
      date: selectedDate || new Date().toISOString().split('T')[0],
      time: '09:00',
      participants: 1,
      pickupLocation: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      totalAmount: 0,
      specialRequirements: ''
    }
  });

  const participants = watch('participants');
  const pricePerPerson = 100; // Precio base por persona

  // Actualizar monto total cuando cambian los participantes
  useEffect(() => {
    const total = participants * pricePerPerson;
    setValue('totalAmount', total);
  }, [participants, setValue]);

  // Actualizar fecha si cambia selectedDate
  useEffect(() => {
    if (selectedDate) {
      setValue('date', selectedDate);
    }
  }, [selectedDate, setValue]);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      if (!currentAgency) {
        throw new Error('No hay agencia activa');
      }

      const newReservation = {
        agency_id: currentAgency.id,
        service_id: 'service-custom', // Default service ID for custom reservations
        client_id: null, // Will be created as walk-in client
        client_name: data.clientName,
        client_phone: data.clientPhone,
        client_email: data.clientEmail || '',
        service_type: data.serviceType,
        service_name: data.serviceType,
        date: data.date,
        tour_date: data.date, // Backend requires tour_date
        time: data.time,
        start_time: data.time,
        participants: parseInt(data.participants),
        group_size: parseInt(data.participants),
        adults: parseInt(data.participants), // Backend requires adults field
        pickup_location: data.pickupLocation,
        special_requests: data.specialRequirements || '',
        total_amount: parseFloat(data.totalAmount),
        price: parseFloat(data.totalAmount),
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      // Crear reserva usando el servicio de agencia
      const result = await actions.createReservation(newReservation);

      toast.success('Reserva creada exitosamente');

      // Recargar datos del calendario
      const start = new Date(data.date);
      start.setDate(1);
      const end = new Date(data.date);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);

      await actions.fetchCalendarData(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );

      reset();
      onClose();
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error(error.message || 'Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nueva Reserva
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete los datos de la reserva
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">

              {/* Informacion del Servicio */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles del Servicio
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Servicio *
                    </label>
                    <input
                      type="text"
                      {...register('serviceType')}
                      className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.serviceType ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ej: City Tour, Full Day Paracas, etc."
                    />
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        {...register('date')}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora *
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        {...register('time')}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.time ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participantes *
                    </label>
                    <div className="relative">
                      <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        {...register('participants')}
                        min="1"
                        max="50"
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.participants ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.participants && (
                      <p className="mt-1 text-sm text-red-600">{errors.participants.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Total (S/.) *
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        {...register('totalAmount')}
                        min="0"
                        step="0.01"
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.totalAmount && (
                      <p className="mt-1 text-sm text-red-600">{errors.totalAmount.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      S/. {pricePerPerson} x {participants} persona(s)
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Punto de Recojo *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        {...register('pickupLocation')}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.pickupLocation ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Hotel Marriott, Plaza de Armas"
                      />
                    </div>
                    {errors.pickupLocation && (
                      <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informacion del Cliente */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informacion del Cliente
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      {...register('clientName')}
                      className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.clientName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nombre del cliente"
                    />
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefono *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        {...register('clientPhone')}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.clientPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="999888777"
                      />
                    </div>
                    {errors.clientPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.clientPhone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        {...register('clientEmail')}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.clientEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="cliente@email.com"
                      />
                    </div>
                    {errors.clientEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requerimientos Especiales */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Requerimientos Especiales
                </h3>

                <div className="relative">
                  <DocumentTextIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    {...register('specialRequirements')}
                    rows={4}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.specialRequirements ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dietas especiales, accesibilidad, solicitudes particulares..."
                  />
                </div>
                {errors.specialRequirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialRequirements.message}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Crear Reserva
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReservationModal;
