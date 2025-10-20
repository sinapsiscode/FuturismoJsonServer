import React, { useState, useEffect } from 'react';
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
import useModulesConfigStore from '../../stores/modulesConfigStore';
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
    .required('La descripción es requerida')
    .min(10, 'Mínimo 10 caracteres')
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
  const { modules } = useModulesConfigStore();
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const isEdit = !!service;

  // Cargar tipos de servicio desde la API
  useEffect(() => {
    const loadServiceTypes = async () => {
      try {
        const response = await fetch('/api/config/service-types');
        const result = await response.json();

        if (result.success && result.data.serviceTypes) {
          setServiceTypes(result.data.serviceTypes);
        } else {
          // Fallback a tipos desde modules config si existen
          const fallbackTypes = modules?.serviceTypes?.serviceTypes || [];
          setServiceTypes(fallbackTypes);
        }
      } catch (error) {
        console.error('Error loading service types:', error);
        // Fallback a tipos desde modules config
        const fallbackTypes = modules?.serviceTypes?.serviceTypes || [];
        setServiceTypes(fallbackTypes);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadServiceTypes();
  }, [modules]);

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
      // Campos requeridos por el backend
      name: data.title,                      // Backend espera "name"
      description: data.description,
      category: data.serviceType,            // Backend espera "category"
      price: parseFloat(data.basePrice),     // Backend espera "price"
      duration: parseInt(data.duration),

      // Campos adicionales
      destination: data.destination,
      max_group_size: parseInt(data.maxParticipants),

      // Requisitos
      languages: data.languages,
      requiresGuide: data.requiresGuide,
      requiresTransport: data.requiresTransport,

      // Paradas
      stops: data.stops || [],

      // Comercial
      included: data.includes,
      excluded: data.excludes,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
        {/* Información Básica */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
            Información Básica del Servicio
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              {loadingTypes ? (
                <div className="px-4 py-2.5 w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  Cargando tipos de servicio...
                </div>
              ) : (
                <select
                  {...register('serviceType')}
                  className={`px-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.serviceType ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  disabled={loadingTypes}
                >
                  <option value="">Seleccionar tipo</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
              {errors.serviceType && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.serviceType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Servicio *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`px-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Ej: City Tour Lima Centro Histórico"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Destino Principal *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  {...register('destination')}
                  className={`pl-11 pr-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Centro Histórico de Lima"
                />
              </div>
              {errors.destination && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.destination.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GlobeAltIcon className="inline w-4 h-4 mr-1 text-gray-500" />
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
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.languages.message}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500 italic">
                Los clientes podrán elegir entre estos idiomas al reservar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Precio por Turista (S/.) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">S/.</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('basePrice')}
                  className={`pl-12 pr-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.basePrice ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.basePrice && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.basePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Duración (horas) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('duration')}
                  min="1"
                  max="24"
                  className={`pl-4 pr-16 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="4"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                  horas
                </span>
              </div>
              {errors.duration && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UsersIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Máximo de Participantes *
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('maxParticipants')}
                  min="1"
                  max="50"
                  className={`pl-4 pr-20 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.maxParticipants ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="10"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                  personas
                </span>
              </div>
              {errors.maxParticipants && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.maxParticipants.message}
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Descripción del Servicio
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={`px-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Describe los lugares a visitar, actividades incluidas, etc."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itinerario de Paradas */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <div className="w-1 h-6 bg-green-500 rounded mr-3"></div>
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
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded mr-3"></div>
            Información Comercial
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircleIcon className="inline w-4 h-4 mr-1 text-green-500" />
                Incluye
              </label>
              <textarea
                {...register('includes')}
                rows={4}
                className="px-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white"
                placeholder="Ej: Transporte, guía, entradas, almuerzo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <XMarkIcon className="inline w-4 h-4 mr-1 text-red-500" />
                No Incluye
              </label>
              <textarea
                {...register('excludes')}
                rows={4}
                className="px-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white"
                placeholder="Ej: Bebidas extras, propinas, gastos personales..."
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="inline w-4 h-4 mr-1 text-gray-500" />
                Notas Adicionales
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="px-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white"
                placeholder="Información adicional importante sobre el servicio..."
              />
            </div>
          </div>
        </div>

              </div>
            </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {isEdit ? 'Actualizar Servicio' : 'Crear Servicio'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;