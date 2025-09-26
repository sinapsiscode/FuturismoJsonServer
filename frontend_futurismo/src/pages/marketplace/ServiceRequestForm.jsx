import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon,
  MapPinIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GuideAvailabilityCalendar from '../../components/marketplace/GuideAvailabilityCalendar';
import toast from 'react-hot-toast';

// Esquema de validación
const serviceRequestSchema = yup.object().shape({
  serviceType: yup.string()
    .oneOf(['tour', 'transfer', 'custom'])
    .required('El tipo de servicio es requerido'),
  
  date: yup.date()
    .required('La fecha es requerida')
    .min(new Date(), 'La fecha debe ser futura'),
  
  startTime: yup.string()
    .required('La hora de inicio es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
  
  duration: yup.number()
    .required('La duración es requerida')
    .min(1, 'Mínimo 1 hora')
    .max(12, 'Máximo 12 horas'),
  
  location: yup.string()
    .required('La ubicación es requerida')
    .min(3, 'Mínimo 3 caracteres'),
  
  tourName: yup.string()
    .when('serviceType', {
      is: 'tour',
      then: yup.string().required('El nombre del tour es requerido'),
      otherwise: yup.string().nullable()
    }),
  
  groupSize: yup.number()
    .required('El tamaño del grupo es requerido')
    .min(1, 'Mínimo 1 persona')
    .max(50, 'Máximo 50 personas'),
  
  groupType: yup.string()
    .required('El tipo de grupo es requerido'),
  
  languages: yup.array()
    .of(yup.string())
    .min(1, 'Debe seleccionar al menos un idioma')
    .required('Los idiomas son requeridos'),
  
  specialRequirements: yup.string()
    .max(500, 'Máximo 500 caracteres'),
  
  paymentTerms: yup.string()
    .required('Los términos de pago son requeridos'),
  
  acceptTerms: yup.boolean()
    .oneOf([true], 'Debe aceptar los términos y condiciones')
});

const ServiceRequestForm = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getGuideById, createServiceRequest } = useMarketplaceStore();
  
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  const serviceTypes = [
    { value: 'tour', label: 'Tour guiado', icon: '🏛️' },
    { value: 'transfer', label: 'Transfer', icon: '🚗' },
    { value: 'custom', label: 'Servicio personalizado', icon: '✨' }
  ];

  const groupTypes = [
    { value: 'family', label: 'Familia' },
    { value: 'friends', label: 'Amigos' },
    { value: 'corporate', label: 'Corporativo' },
    { value: 'school', label: 'Escolar' },
    { value: 'mixed', label: 'Mixto' },
    { value: 'other', label: 'Otro' }
  ];

  const paymentTerms = [
    { value: 'advance', label: '100% por adelantado' },
    { value: 'deposit', label: '50% depósito, 50% al finalizar' },
    { value: 'after', label: '100% al finalizar el servicio' }
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: 'tour',
      duration: 4,
      groupSize: 1,
      groupType: 'family',
      languages: [],
      paymentTerms: 'deposit',
      acceptTerms: false
    }
  });

  const watchServiceType = watch('serviceType');
  const watchDuration = watch('duration');
  const watchDate = watch('date');

  useEffect(() => {
    loadGuide();
  }, [guideId]);

  useEffect(() => {
    // Calcular precio según duración
    if (guide && watchDuration) {
      let price = 0;
      if (watchDuration <= 4) {
        price = guide.pricing.halfDayRate;
      } else if (watchDuration <= 8) {
        price = guide.pricing.fullDayRate;
      } else {
        price = guide.pricing.hourlyRate * watchDuration;
      }
      setCalculatedPrice(price);
    }
  }, [guide, watchDuration]);

  const loadGuide = async () => {
    setIsLoading(true);
    try {
      const guideData = getGuideById(guideId);
      if (guideData) {
        setGuide(guideData);
        // Pre-seleccionar idiomas disponibles del guía
        setValue('languages', [guideData.specializations.languages[0]?.code || 'es']);
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const endTime = calculateEndTime(data.startTime, data.duration);
      
      const requestData = {
        agencyId: user.id,
        guideId: guide.id,
        serviceDetails: {
          type: data.serviceType,
          date: data.date.toISOString().split('T')[0],
          startTime: data.startTime,
          endTime: endTime,
          duration: data.duration,
          location: data.location,
          tourName: data.tourName || null,
          groupSize: data.groupSize,
          groupType: data.groupType,
          specialRequirements: data.specialRequirements || '',
          languages: data.languages
        },
        pricing: {
          proposedRate: calculatedPrice,
          finalRate: calculatedPrice,
          paymentTerms: getPaymentTermsLabel(data.paymentTerms),
          currency: 'PEN'
        }
      };

      const newRequest = createServiceRequest(requestData);
      
      toast.success('Solicitud enviada exitosamente');
      navigate(`/marketplace/requests/${newRequest.id}`);
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + duration;
    return `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getPaymentTermsLabel = (value) => {
    const term = paymentTerms.find(t => t.value === value);
    return term ? term.label : value;
  };

  const isDateAvailable = (date) => {
    if (!guide) return false;
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return guide.availability.workingDays.includes(dayOfWeek);
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + (guide?.availability.advanceBooking || 1));
    return today;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Solicitar Servicio de Guía</h1>
          
          {/* Información del guía */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={guide.profile.avatar}
              alt={guide.fullName}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{guide.fullName}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  ⭐ {guide.ratings.overall.toFixed(1)} ({guide.ratings.totalReviews} reseñas)
                </span>
                <span>•</span>
                <span>S/. {guide.pricing.hourlyRate}/hora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de servicio */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Servicio</h2>
            
            <div className="space-y-4">
              {/* Tipo de servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de servicio
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {serviceTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        watchServiceType === type.value
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('serviceType')}
                        value={type.value}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <p className="text-sm font-medium">{type.label}</p>
                      </div>
                      {watchServiceType === type.value && (
                        <CheckIcon className="absolute top-2 right-2 h-5 w-5 text-cyan-600" />
                      )}
                    </label>
                  ))}
                </div>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>

              {/* Nombre del tour (solo si es tour) */}
              {watchServiceType === 'tour' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del tour
                  </label>
                  <input
                    type="text"
                    {...register('tourName')}
                    placeholder="Ej: City Tour Cusco"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.tourName && (
                    <p className="mt-1 text-sm text-red-600">{errors.tourName.message}</p>
                  )}
                </div>
              )}

              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="inline h-4 w-4 mr-1" />
                    Fecha
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setValue('date', date);
                    }}
                    minDate={getMinDate()}
                    filterDate={isDateAvailable}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    {...register('startTime')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                  )}
                </div>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (horas)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    {...register('duration')}
                    min="1"
                    max="12"
                    className="flex-1"
                  />
                  <span className="w-16 text-center font-medium">{watchDuration}h</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Mínimo: {guide.preferences.minBookingHours} horas
                </p>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPinIcon className="inline h-4 w-4 mr-1" />
                  Punto de encuentro
                </label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="Ej: Plaza de Armas, Cusco"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información del grupo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Grupo</h2>
            
            <div className="space-y-4">
              {/* Tamaño y tipo de grupo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserGroupIcon className="inline h-4 w-4 mr-1" />
                    Tamaño del grupo
                  </label>
                  <input
                    type="number"
                    {...register('groupSize')}
                    min="1"
                    max={guide.preferences.maxGroupSize}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Máximo: {guide.preferences.maxGroupSize} personas
                  </p>
                  {errors.groupSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.groupSize.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de grupo
                  </label>
                  <select
                    {...register('groupType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    {groupTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.groupType && (
                    <p className="mt-1 text-sm text-red-600">{errors.groupType.message}</p>
                  )}
                </div>
              </div>

              {/* Idiomas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <LanguageIcon className="inline h-4 w-4 mr-1" />
                  Idiomas requeridos
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {guide.specializations.languages.map((lang) => (
                    <label
                      key={lang.code}
                      className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        value={lang.code}
                        {...register('languages')}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm">
                        {lang.code === 'es' && '🇪🇸 Español'}
                        {lang.code === 'en' && '🇺🇸 Inglés'}
                        {lang.code === 'fr' && '🇫🇷 Francés'}
                        {lang.code === 'de' && '🇩🇪 Alemán'}
                        {lang.code === 'it' && '🇮🇹 Italiano'}
                        {lang.code === 'pt' && '🇵🇹 Portugués'}
                        {lang.code === 'ja' && '🇯🇵 Japonés'}
                        {lang.code === 'ko' && '🇰🇷 Coreano'}
                        {lang.code === 'zh' && '🇨🇳 Chino'}
                        {lang.code === 'ru' && '🇷🇺 Ruso'}
                      </span>
                      <span className="ml-auto text-xs text-gray-500 capitalize">
                        {lang.level}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.languages && (
                  <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>
                )}
              </div>

              {/* Requerimientos especiales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requerimientos especiales (opcional)
                </label>
                <textarea
                  {...register('specialRequirements')}
                  rows={3}
                  placeholder="Ej: Alergias alimentarias, movilidad reducida, intereses específicos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                {errors.specialRequirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialRequirements.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pago y confirmación */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pago y Confirmación</h2>
            
            <div className="space-y-4">
              {/* Resumen de precio */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Tarifa del guía</span>
                  <span className="font-medium">S/. {calculatedPrice}</span>
                </div>
                {guide.preferences.requiresDeposit && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Depósito requerido ({guide.preferences.depositPercentage}%)
                    </span>
                    <span className="font-medium">
                      S/. {(calculatedPrice * guide.preferences.depositPercentage / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">S/. {calculatedPrice}</span>
                  </div>
                </div>
              </div>

              {/* Términos de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Términos de pago
                </label>
                <div className="space-y-2">
                  {paymentTerms.map((term) => (
                    <label
                      key={term.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        {...register('paymentTerms')}
                        value={term.value}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm">{term.label}</span>
                    </label>
                  ))}
                </div>
                {errors.paymentTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentTerms.message}</p>
                )}
              </div>

              {/* Política de cancelación */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Política de cancelación:</p>
                    <p>{guide.preferences.cancellationPolicy}</p>
                  </div>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Acepto los{' '}
                    <a href="#" className="text-cyan-600 hover:text-cyan-700 underline">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-cyan-600 hover:text-cyan-700 underline">
                      política de privacidad
                    </a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Qué sucede después?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>El guía recibirá tu solicitud y responderá en ~{guide.marketplaceStats.responseTime} minutos</li>
                  <li>Podrás chatear con el guía para coordinar detalles</li>
                  <li>Una vez confirmado, recibirás los datos de contacto completos</li>
                  <li>El pago se procesará según los términos acordados</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/marketplace/guide/${guideId}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Enviando...
                </span>
              ) : (
                'Enviar solicitud'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;