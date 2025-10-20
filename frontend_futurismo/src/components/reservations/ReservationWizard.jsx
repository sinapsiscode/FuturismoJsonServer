import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MapPinIcon, UserGroupIcon, CheckIcon, ChevronRightIcon, ChevronLeftIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReservationsStore } from '../../stores/reservationsStore';
import { formatters, canBookDirectly, generateWhatsAppURL } from '../../utils/formatters';
import { validators } from '../../utils/validators';
import WhatsAppConsultButton from './WhatsAppConsultButton';
import toast from 'react-hot-toast';
import { useServicesStore } from '../../stores/servicesStore';

// Tour types constants
const TOUR_TYPES = {
  REGULAR: 'regular',
  FULLDAY: 'fullday'
};

// Constantes locales del formulario (no dependen de backend)
const FORM_STEPS = {
  SERVICE: 1,
  TOURISTS: 2,
  CONFIRMATION: 3,
  MIN_STEP: 1,
  MAX_STEP: 3
};

const SERVICE_TYPES = {
  HALFDAY: 'halfday',
  FULLDAY: 'fullday',
  MULTIDAY: 'multiday',
  CUSTOM: 'custom'
};

const MAX_COMPANIONS_PER_GROUP = 50;

// Componentes del wizard
import StepIndicator from './wizard/StepIndicator';
import TourSelectionStep from './wizard/TourSelectionStep';
import PassengerInfoStep from './wizard/PassengerInfoStep';
import ConfirmationStep from './wizard/ConfirmationStep';

// Esquemas de validación para cada paso
const step1Schema = yup.object({
  serviceType: yup.string().required('El tipo de servicio es requerido'),
  tourId: yup.string().required('Debe seleccionar un tour'),
  date: yup.date().required('La fecha es requerida').min(new Date(), 'La fecha debe ser futura'),
  time: yup.string().required('La hora es requerida')
});

const step2Schema = yup.object({
  adults: yup.number().required('Número de adultos requerido').min(1, 'Mínimo 1 adulto'),
  children: yup.number().min(0, 'No puede ser negativo'),
  pickupLocation: yup.string().required('El lugar de recojo es requerido'),
  specialRequirements: yup.string(),
  // Múltiples grupos en la reserva
  groups: yup.array().of(
    yup.object({
      representativeName: yup.string().required('El nombre del representante es requerido'),
      representativePhone: yup.string()
        .required('El teléfono del representante es requerido')
        .test('phone', 'Teléfono inválido', value => validators.validatePhone(value || '')),
      companionsCount: yup.number()
        .required('Número de acompañantes es requerido')
        .min(0, 'No puede ser negativo')
        .max(MAX_COMPANIONS_PER_GROUP, `Máximo ${MAX_COMPANIONS_PER_GROUP} acompañantes por grupo`)
    })
  ).min(1, 'Debe haber al menos un grupo')
});

const step3Schema = yup.object({
  paymentMethod: yup.string().required('Seleccione un método de pago'),
  billingName: yup.string().required('Nombre para facturación requerido'),
  billingDocument: yup.string().required('Documento requerido'),
  billingAddress: yup.string().required('Dirección requerida'),
  acceptTerms: yup.boolean().oneOf([true], 'Debe aceptar los términos y condiciones')
});

const ReservationWizard = ({ onClose }) => {
  const navigate = useNavigate();
  const { submitReservation } = useReservationsStore();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.SERVICE);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFulldayTour, setIsFulldayTour] = useState(false);
  const [canBookDirectReservation, setCanBookDirectReservation] = useState(true);
  
  // Obtener servicios del catálogo (NO tours activos)
  const { services: availableServices, loadServices, isLoading: servicesLoading } = useServicesStore();

  // Cargar catálogo de servicios al montar el componente
  useEffect(() => {
    loadServices({ status: 'active' });
  }, []);


  const steps = [
    { number: 1, title: 'Servicio', icon: MapPinIcon },
    { number: 2, title: 'Detalles', icon: UserGroupIcon },
    { number: 3, title: 'Confirmación', icon: CheckIcon }
  ];


  // Verificar si es tour fullday y horario de reserva
  useEffect(() => {
    if (formData.tourId) {
      const selectedTour = availableServices.find(t => t.id === formData.tourId);
      const isFullday = selectedTour?.type === 'fullday';
      setIsFulldayTour(isFullday);
      
      // Si es fullday, verificar horario para reserva directa
      if (isFullday) {
        const canBook = canBookDirectly();
        setCanBookDirectReservation(canBook);
      } else {
        setCanBookDirectReservation(true);
      }
    }
  }, [formData.tourId]);

  // Configuración de formularios para cada paso
  const getStepConfig = () => {
    switch (currentStep) {
      case 1:
        return {
          schema: step1Schema,
          defaultValues: {
            serviceType: formData.serviceType || 'tour',
            tourId: formData.tourId || '',
            date: formData.date || '',
            time: formData.time || ''
          }
        };
      case 2:
        return {
          schema: step2Schema,
          defaultValues: {
            adults: formData.adults || 1,
            children: formData.children || 0,
            pickupLocation: formData.pickupLocation || '',
            specialRequirements: formData.specialRequirements || '',
            groups: formData.groups || [
              {
                representativeName: '',
                representativePhone: '',
                companionsCount: 0
              }
            ]
          }
        };
      case 3:
        return {
          schema: step3Schema,
          defaultValues: {
            paymentMethod: formData.paymentMethod || 'transfer',
            billingName: formData.billingName || '',
            billingDocument: formData.billingDocument || '',
            billingAddress: formData.billingAddress || '',
            acceptTerms: formData.acceptTerms || false
          }
        };
      default:
        return { schema: yup.object(), defaultValues: {} };
    }
  };

  const stepConfig = getStepConfig();
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(stepConfig.schema),
    defaultValues: stepConfig.defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups"
  });

  const selectedTour = watch('tourId');
  const adults = watch('adults') || 1;
  const children = watch('children') || 0;

  const calculateTotal = () => {
    const tour = availableServices.find(t => t.id === selectedTour);
    if (!tour) return 0;
    return (adults * tour.price) + (children * tour.price * 0.5);
  };

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit({ ...formData, ...data });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (finalData) => {
    setIsSubmitting(true);
    try {
      const reservation = {
        ...finalData,
        total: calculateTotal(),
        status: 'pendiente',
        createdAt: new Date()
      };

      await submitReservation();
      toast.success('Reserva creada exitosamente');
      
      // Navegar a la página de confirmación o cerrar el wizard
      if (onClose) {
        onClose();
      } else {
        navigate('/reservations');
      }
    } catch (error) {
      toast.error('Error al crear la reserva');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full">
      {/* Progress indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                  ${currentStep >= step.number
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-110'
                    : 'bg-white text-gray-400 border-gray-300'}
                `}>
                  {currentStep > step.number ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`mt-2 text-xs font-semibold text-center whitespace-nowrap ${
                  currentStep >= step.number ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(handleNext)} className="px-8 py-6">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tipo de Servicio *</label>
              <select
                {...register('serviceType')}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium"
              >
                <option value="tour">Tour Regular</option>
                <option value="private">Tour Privado</option>
                <option value="transfer">Traslado</option>
              </select>
              {errors.serviceType && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.serviceType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tour *</label>
              {servicesLoading ? (
                <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-700 font-medium">Cargando tours...</span>
                </div>
              ) : availableServices.length === 0 ? (
                <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    No hay tours disponibles en este momento. Por favor intenta más tarde o contacta a soporte.
                  </p>
                </div>
              ) : (
                <select
                  {...register('tourId')}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                >
                  <option value="">Selecciona un tour</option>
                  {availableServices.map(tour => (
                    <option key={tour.id} value={tour.id}>
                      {tour.name} - S/. {tour.price}/persona
                    </option>
                  ))}
                </select>
              )}
              {errors.tourId && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.tourId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Fecha *</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Hora *</label>
                <input
                  type="time"
                  {...register('time')}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                />
                {errors.time && (
                  <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Alerta para tours fullday después de las 5 PM */}
            {isFulldayTour && !canBookDirectReservation && (
              <div className="border border-orange-300 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">
                      Reserva de Tour Full Day después de las 5 PM
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Para tours full day después de las 5:00 PM, es necesario consultar disponibilidad 
                      antes de realizar la reserva.
                    </p>
                    <WhatsAppConsultButton 
                      message={`Hola, necesito consultar disponibilidad para el tour "${availableServices.find(t => t.id === selectedTour)?.name}" para la fecha ${watch('date')} a las ${watch('time')}`}
                      variant="secondary"
                      size="sm"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Información para tours fullday antes de las 5 PM */}
            {isFulldayTour && canBookDirectReservation && (
              <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800 mb-1">
                      Tour Full Day - Reserva Directa Disponible
                    </h4>
                    <p className="text-sm text-green-700">
                      Puedes realizar tu reserva directamente hasta las 5:00 PM. 
                      Después de ese horario será necesario consultar disponibilidad.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Detalles de la Reserva</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adultos *</label>
                <input
                  type="number"
                  {...register('adults')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  placeholder="1"
                />
                {errors.adults && (
                  <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niños</label>
                <input
                  type="number"
                  {...register('children')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
                {errors.children && (
                  <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de Recojo *</label>
              <input
                type="text"
                {...register('pickupLocation')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Hotel Marriott Miraflores"
              />
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requerimientos Especiales</label>
              <textarea
                {...register('specialRequirements')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Alergias, dieta especial, movilidad reducida, etc."
              />
            </div>

            {/* Sección de Grupos */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Grupos ({fields.length})
                </h4>
                <button
                  type="button"
                  onClick={() => append({ representativeName: '', representativePhone: '', companionsCount: 0 })}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar Grupo</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Información:</strong> Puede agregar múltiples grupos a la misma reserva. 
                  Cada grupo debe tener un representante responsable.
                </p>
              </div>

              {fields.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No hay grupos agregados</p>
                  <p className="text-sm text-gray-400">
                    Agregue al menos un grupo con su representante
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900 flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-2 text-blue-500" />
                        Grupo #{index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        title="Eliminar grupo"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Representante *
                        </label>
                        <input
                          type="text"
                          {...register(`groups.${index}.representativeName`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nombre completo del responsable"
                        />
                        {errors.groups?.[index]?.representativeName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.groups[index].representativeName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono del Representante *
                        </label>
                        <input
                          type="tel"
                          {...register(`groups.${index}.representativePhone`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+51 999999999"
                        />
                        {errors.groups?.[index]?.representativePhone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.groups[index].representativePhone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Acompañantes *
                        </label>
                        <input
                          type="number"
                          {...register(`groups.${index}.companionsCount`, { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                        {errors.groups?.[index]?.companionsCount && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.groups[index].companionsCount.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <p>
                        <strong>Total del grupo:</strong> {(watch(`groups.${index}.companionsCount`) || 0) + 1} persona
                        {((watch(`groups.${index}.companionsCount`) || 0) + 1) !== 1 ? 's' : ''} 
                        (incluye al representante)
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {fields.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <UserGroupIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Información Importante:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>El representante es responsable de todo su grupo</li>
                        <li>Todos los integrantes deben estar presentes en el punto de recojo</li>
                        <li>Se requieren documentos de identidad para todos los participantes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirmación y Pago</h3>

            {/* Resumen de la reserva */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Resumen de la Reserva</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span className="font-medium">
                    {availableServices.find(t => t.id === formData.tourId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{formatters.formatDate(formData.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pasajeros:</span>
                  <span className="font-medium">
                    {formData.adults} adultos{formData.children > 0 && `, ${formData.children} niños`}
                  </span>
                </div>
                {formData.groups && formData.groups.length > 0 && (
                  <div className="border-t pt-2 pb-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Grupos:</span>
                      <span className="font-medium">{formData.groups.length} grupo{formData.groups.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2">
                      {formData.groups.map((group, index) => {
                        const totalPersons = (group.companionsCount || 0) + 1;
                        return (
                          <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-900">
                              Grupo #{index + 1}: {group.representativeName}
                            </p>
                            <p className="text-blue-700">
                              Tel: {group.representativePhone} | Total: {totalPersons} persona{totalPersons !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago *</label>
              <select
                {...register('paymentMethod')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="transfer">Transferencia Bancaria</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta de Crédito/Débito</option>
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4 text-gray-900">Datos de Facturación</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre o Razón Social *</label>
                  <input
                    type="text"
                    {...register('billingName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre completo o razón social"
                  />
                  {errors.billingName && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RUC/DNI *</label>
                    <input
                      type="text"
                      {...register('billingDocument')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Número de documento"
                    />
                    {errors.billingDocument && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingDocument.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input
                      type="text"
                      {...register('billingAddress')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección fiscal"
                    />
                    {errors.billingAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  {...register('acceptTerms')}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones del servicio y autorizo el uso de mis datos 
                  personales según la política de privacidad.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Información importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Información Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>La reserva será confirmada una vez validado el pago</li>
                    <li>Recibirá un email con los detalles y voucher</li>
                    <li>Cancelación gratuita hasta 24 horas antes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="bg-gray-50 -mx-8 -mb-6 mt-8 px-8 py-5 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-sm bg-white"
            disabled={currentStep === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Anterior
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
            disabled={isSubmitting || (currentStep === 1 && isFulldayTour && !canBookDirectReservation)}
          >
            {currentStep === 3 ? (
              <>
                {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                <CheckIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                {(currentStep === 1 && isFulldayTour && !canBookDirectReservation)
                  ? 'Consultar por WhatsApp'
                  : 'Siguiente'}
                <ChevronRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationWizard;