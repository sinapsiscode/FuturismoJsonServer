import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon,
  IdentificationIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import LanguageMultiSelect from '../components/common/LanguageMultiSelect';
import { useAuthStore } from '../stores/authStore';

// Esquema de validación
const registerSchema = yup.object({
  // Datos personales
  firstName: yup.string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  lastName: yup.string()
    .required('El apellido es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  email: yup.string()
    .required('El email es requerido')
    .email('Email inválido'),
  phone: yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]{9}$/, 'Debe tener 9 dígitos'),
  documentType: yup.string()
    .required('Selecciona el tipo de documento'),
  documentNumber: yup.string()
    .required('El número de documento es requerido')
    .when('documentType', {
      is: 'dni',
      then: (schema) => schema.matches(/^[0-9]{8}$/, 'DNI debe tener 8 dígitos'),
      otherwise: (schema) => schema.min(5, 'Mínimo 5 caracteres')
    }),
  
  // Credenciales
  password: yup.string()
    .required('La contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúsculas, minúsculas y números'
    ),
  confirmPassword: yup.string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  
  // Información profesional
  languages: yup.array()
    .of(yup.string())
    .min(1, 'Selecciona al menos un idioma')
    .required('Los idiomas son requeridos'),
  licenseNumber: yup.string()
    .required('El número de licencia es requerido'),
  experience: yup.string()
    .required('Describe tu experiencia'),
  specialties: yup.string()
    .required('Indica tus especialidades'),
  
  // Términos
  acceptTerms: yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});

const FreelancerRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      documentType: 'dni',
      languages: ['es'],
      acceptTerms: false
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En producción aquí iría la llamada real al API
      console.log('Datos de registro:', {
        ...data,
        photo: photoPreview,
        status: 'pending_approval',
        registeredAt: new Date().toISOString()
      });

      setSuccessMessage('¡Registro exitoso! Tu solicitud está pendiente de aprobación. Te notificaremos por email.');
      
      // Limpiar formulario
      reset();
      setPhotoPreview(null);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setErrorMessage('Error al procesar el registro. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Link to="/" className="flex justify-center">
          <span className="text-4xl">🌎</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Únete como Guía Freelancer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Completa tu registro y comienza a trabajar con las mejores agencias
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Foto de perfil */}
            <div className="text-center">
              <div className="mt-2 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <CameraIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <CameraIcon className="w-5 h-5 text-white" />
                    <input
                      id="photo-upload"
                      name="photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Foto de perfil (opcional)</p>
            </div>

            {/* Datos personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Datos Personales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('firstName')}
                      type="text"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Juan"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('lastName')}
                      type="text"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Pérez"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="juan@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="999888777"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    {...register('documentType')}
                    className={`px-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.documentType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="dni">DNI</option>
                    <option value="ce">Carnet de Extranjería</option>
                    <option value="passport">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento *
                  </label>
                  <div className="relative">
                    <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('documentNumber')}
                      type="text"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.documentNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="12345678"
                    />
                  </div>
                  {errors.documentNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información profesional */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900">Información Profesional</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <GlobeAltIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                  Idiomas que Hablas *
                </label>
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <LanguageMultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.languages}
                      placeholder="Selecciona los idiomas que dominas"
                    />
                  )}
                />
                {errors.languages && (
                  <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Licencia de Guía *
                </label>
                <div className="relative">
                  <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('licenseNumber')}
                    type="text"
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="LIC-2024-001"
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiencia *
                </label>
                <textarea
                  {...register('experience')}
                  rows={3}
                  className={`px-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.experience ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe tu experiencia como guía turístico..."
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades *
                </label>
                <textarea
                  {...register('specialties')}
                  rows={2}
                  className={`px-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.specialties ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Tours culturales, historia inca, gastronomía..."
                />
                {errors.specialties && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialties.message}</p>
                )}
              </div>
            </div>

            {/* Seguridad */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900">Seguridad</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type="password"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="pt-6 border-t">
              <div className="flex items-start">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    política de privacidad
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Mensajes de error/éxito */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            {/* Botones */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? 'Registrando...' : 'Completar Registro'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerRegister;