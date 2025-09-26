import React, { useState, useEffect } from 'react';
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
  CheckIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useReservationsStore } from '../../stores/reservationsStore';
import toast from 'react-hot-toast';

const editReservationSchema = yup.object({
  date: yup.string().required('La fecha es requerida'),
  time: yup.string().required('La hora es requerida'),
  adults: yup.number()
    .required('Número de adultos es requerido')
    .min(1, 'Mínimo 1 adulto'),
  children: yup.number()
    .min(0, 'El número de niños no puede ser negativo')
    .integer('Debe ser un número entero'),
  pickupLocation: yup.string().required('El punto de recojo es requerido'),
  clientName: yup.string().required('El nombre del cliente es requerido'),
  clientPhone: yup.string()
    .required('El teléfono es requerido')
    .matches(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido'),
  clientEmail: yup.string().email('Email inválido'),
  specialRequirements: yup.string().max(500, 'Máximo 500 caracteres')
});

const ReservationEditModal = ({ reservation, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const { updateReservation } = useReservationsStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(editReservationSchema),
    defaultValues: {
      date: reservation?.date ? (typeof reservation.date === 'string' ? reservation.date.split('T')[0] : new Date(reservation.date).toISOString().split('T')[0]) : '',
      time: reservation?.time || '',
      adults: reservation?.adults || 1,
      children: reservation?.children || 0,
      pickupLocation: reservation?.pickupLocation || '',
      clientName: reservation?.clientName || '',
      clientPhone: reservation?.clientPhone || '',
      clientEmail: reservation?.clientEmail || '',
      specialRequirements: reservation?.specialRequirements || ''
    }
  });

  const adults = watch('adults');
  const children = watch('children');

  useEffect(() => {
    if (reservation) {
      const dateValue = reservation.date ? 
        (typeof reservation.date === 'string' ? 
          reservation.date.split('T')[0] : 
          new Date(reservation.date).toISOString().split('T')[0]
        ) : '';
      
      reset({
        date: dateValue,
        time: reservation.time || '',
        adults: reservation.adults || 1,
        children: reservation.children || 0,
        pickupLocation: reservation.pickupLocation || '',
        clientName: reservation.clientName || '',
        clientPhone: reservation.clientPhone || '',
        clientEmail: reservation.clientEmail || '',
        specialRequirements: reservation.specialRequirements || ''
      });
    }
  }, [reservation, reset]);

  const calculateNewTotal = () => {
    if (!reservation) return 0;
    const basePrice = reservation.pricePerAdult || 100;
    const childPrice = reservation.pricePerChild || 50;
    return (adults * basePrice) + (children * childPrice);
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const updatedReservation = {
        ...reservation,
        date: data.date,
        time: data.time,
        adults: parseInt(data.adults),
        children: parseInt(data.children),
        pickupLocation: data.pickupLocation,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        specialRequirements: data.specialRequirements,
        total: calculateNewTotal(),
        updatedAt: new Date().toISOString()
      };

      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(updatedReservation);
      }

      toast.success('Reserva actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Error al actualizar la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Reserva #{reservation.id}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {reservation.tourName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
            
            {/* Información del Servicio */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del Servicio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Adultos *
                  </label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      {...register('adults')}
                      min="1"
                      max="50"
                      className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adults ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.adults && (
                    <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niños
                  </label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      {...register('children')}
                      min="0"
                      max="20"
                      className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.children ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.children && (
                    <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                  )}
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

            {/* Información del Cliente */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Cliente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    {...register('clientName')}
                    className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.clientName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del representante del grupo"
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      {...register('clientPhone')}
                      className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.clientPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+51 999 888 777"
                    />
                  </div>
                  {errors.clientPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientPhone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
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

            {/* Resumen de Precio */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Precio
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Adultos ({adults})</span>
                  <span>S/. {((reservation?.pricePerAdult || 100) * adults).toFixed(2)}</span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Niños ({children})</span>
                    <span>S/. {((reservation?.pricePerChild || 50) * children).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">S/. {calculateNewTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
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
                  Actualizar Reserva
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationEditModal;