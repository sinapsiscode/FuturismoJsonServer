import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  CheckIcon, 
  XMarkIcon, 
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import LanguageMultiSelect from '../common/LanguageMultiSelect';
import StopsManager from './StopsManager';

// Esquema de validación
const serviceSchema = yup.object({
  // Información básica del servicio
  serviceType: yup
    .string()
    .required('El tipo de servicio es requerido'),
  title: yup
    .string()
    .required('El título del servicio es requerido')
    .min(3, 'Mínimo 3 caracteres'),
  destination: yup
    .string()
    .required('El destino es requerido'),
  description: yup
    .string()
    .max(500, 'Máximo 500 caracteres'),

  // Detalles operativos
  duration: yup
    .number()
    .required('La duración es requerida')
    .min(1, 'Mínimo 1 hora')
    .max(24, 'Máximo 24 horas'),
  maxParticipants: yup
    .number()
    .required('El número máximo de participantes es requerido')
    .min(1, 'Mínimo 1 participante')
    .max(50, 'Máximo 50 participantes'),
  basePrice: yup
    .number()
    .required('El precio por turista es requerido')
    .min(0, 'El precio no puede ser negativo'),
  
  // Requisitos
  languages: yup
    .array()
    .of(yup.string())
    .min(1, 'Selecciona al menos un idioma')
    .required('Los idiomas son requeridos'),
  
  // Paradas
  stops: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('El nombre de la parada es requerido'),
        duration: yup.number().min(0),
        description: yup.string()
      })
    )
});

const ServiceForm = ({ service = null, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  const { createService, updateService } = useServicesStore();

  const isEdit = !!service;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      // Información básica
      serviceType: service?.type || '',
      title: service?.title || '',
      destination: service?.destination || '',
      description: service?.description || '',
      
      // Detalles operativos
      duration: service?.duration || 4,
      maxParticipants: service?.maxParticipants || 10,
      basePrice: service?.basePrice || 0,
      
      // Requisitos
      languages: service?.languages || ['es'],
      requiresGuide: service?.requiresGuide !== false,
      requiresTransport: service?.requiresTransport !== false,
      
      // Paradas
      stops: service?.stops || [],
      
      // Comercial
      basePrice: service?.basePrice || 0,
      includes: service?.includes || '',
      excludes: service?.excludes || '',
      notes: service?.notes || ''
    }
  });

  const handleFormSubmit = async (data) => {
    const serviceData = {
      // Información básica
      type: data.serviceType,
      title: data.title,
      destination: data.destination,
      description: data.description,
      
      // Detalles operativos
      duration: parseInt(data.duration),
      maxParticipants: parseInt(data.maxParticipants),
      
      // Requisitos
      languages: data.languages,
      requiresGuide: data.requiresGuide,
      requiresTransport: data.requiresTransport,
      
      // Paradas
      stops: data.stops || [],
      
      // Comercial
      basePrice: parseFloat(data.basePrice),
      includes: data.includes,
      excludes: data.excludes,
      notes: data.notes
    };

    try {
      if (isEdit) {
        await updateService(service.id, serviceData);
      } else {
        await createService(serviceData);
      }
      
      if (onSubmit) {
        onSubmit(serviceData);
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {isEdit ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="modal-close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="modal-body">
              <div className="space-y-8">
        {/* Información Básica */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Básica del Servicio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Servicio *
              </label>
              <select
                {...register('serviceType')}
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.serviceType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo</option>
                <option value="transfer">Transfer</option>
                <option value="city_tour">City Tour</option>
                <option value="museum_tour">Tour de Museos</option>
                <option value="historical_tour">Tour Histórico</option>
                <option value="gastronomy_tour">Tour Gastronómico</option>
                <option value="adventure_tour">Tour de Aventura</option>
                <option value="cultural_tour">Tour Cultural</option>
                <option value="nature_tour">Tour de Naturaleza</option>
                <option value="fullday">Full Day</option>
                <option value="custom">Personalizado</option>
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Servicio *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: City Tour Lima Centro Histórico"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino Principal *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  {...register('destination')}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.destination ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Centro Histórico de Lima"
                />
              </div>
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <GlobeAltIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                Idiomas Disponibles *
              </label>
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <LanguageMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.languages}
                    placeholder="Selecciona los idiomas disponibles"
                  />
                )}
              />
              {errors.languages && (
                <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Los clientes podrán elegir entre estos idiomas al reservar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por Turista (S/.) *
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('basePrice')}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.basePrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (horas) *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  {...register('duration')}
                  min="1"
                  max="24"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="8"
                />
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Participantes *
              </label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  {...register('maxParticipants')}
                  min="1"
                  max="50"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxParticipants ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="10"
                />
              </div>
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Servicio
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe los lugares a visitar, actividades incluidas, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Itinerario de Paradas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Itinerario del Tour
          </h3>
          
          <Controller
            name="stops"
            control={control}
            render={({ field }) => (
              <StopsManager
                stops={field.value}
                onChange={field.onChange}
                errors={errors.stops?.message}
              />
            )}
          />
        </div>

        {/* Información Comercial */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Comercial
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incluye
              </label>
              <textarea
                {...register('includes')}
                rows={3}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Transporte, guía, entradas, almuerzo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No Incluye
              </label>
              <textarea
                {...register('excludes')}
                rows={3}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Bebidas extras, propinas, gastos personales..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información adicional importante sobre el servicio..."
                />
              </div>
            </div>
          </div>
        </div>

              </div>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                {t('common.cancel')}
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isLoading ? t('common.saving') : (isEdit ? t('common.updateService') : t('common.createService'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;