import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon, BuildingOffice2Icon, MapIcon, ShieldCheckIcon, UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// BuildingStorefrontIcon y validación
import useAuthStore from '../stores/authStore';
import { loginSchema, freelanceGuideRegisterSchema } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(isRegistering ? freelanceGuideRegisterSchema : loginSchema),
    defaultValues: isRegistering ? {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dni: '',
      city: '',
      languages: [],
      experience: 0,
      specialties: [],
      acceptTerms: false
    } : {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data) => {
    try {
      if (isRegistering) {
        const registerData = {
          ...data,
          role: 'guide',
          guideType: 'freelance'
        };
        const result = await registerUser(registerData);
        
        if (result.success) {
          toast.success(t('auth.registerSuccess'));
          navigate('/dashboard');
        } else {
          toast.error(result.error || t('auth.registerError'));
        }
      } else {
        const result = await login(data);
        
        if (result.success) {
          toast.success(t('auth.welcome'));
          navigate('/dashboard');
        } else {
          toast.error(result.error || t('auth.loginError'));
        }
      }
    } catch (error) {
      toast.error(t('auth.unexpectedError'));
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    reset();
    setShowPassword(false);
  };

  // Opciones para idiomas y especialidades
  const languageOptions = [
    { value: 'spanish', label: t('auth.spanish') },
    { value: 'english', label: t('auth.english') },
    { value: 'portuguese', label: t('auth.portuguese') },
    { value: 'french', label: t('auth.french') },
    { value: 'german', label: t('auth.german') },
    { value: 'italian', label: t('auth.italian') },
    { value: 'japanese', label: t('auth.japanese') },
    { value: 'chinese', label: t('auth.chinese') }
  ];

  const specialtyOptions = [
    { value: 'history', label: t('auth.historyTours') },
    { value: 'nature', label: t('auth.natureTours') },
    { value: 'culture', label: t('auth.culturalTours') },
    { value: 'adventure', label: t('auth.adventureTours') },
    { value: 'gastronomy', label: t('auth.gastronomyTours') },
    { value: 'city', label: t('auth.cityTours') },
    { value: 'photography', label: t('auth.photographyTours') },
    { value: 'religious', label: t('auth.religiousTours') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full mb-4 shadow-glow">
            <span className="text-3xl text-white">🌎</span>
          </div>
          <h1 className="page-title text-4xl">Futurismo</h1>
          <p className="text-neutral-600 mt-2">{t('auth.systemTitle')}</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="card-title">
                {isRegistering ? t('auth.registerAsGuide') : t('auth.login')}
              </h2>
              <button
                type="button"
                onClick={toggleMode}
                className="btn-link text-sm"
              >
                {isRegistering ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
              </button>
            </div>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label required">
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="agencia@ejemplo.com"
                autoComplete="off"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label required">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  style={{ paddingRight: '40px' }}
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-1000"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="form-check-input"
                />
                <span className="ml-2 text-sm text-neutral-700">{t('auth.rememberMe')}</span>
              </label>
              
              <a href="#" className="btn-link text-sm">
                {t('auth.forgotPassword')}
              </a>
            </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary btn-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                    {t('auth.loggingIn')}
                  </>
                ) : (
                  t('auth.login')
                )}
              </button>
            </form>
          </div>

          <div className="card-footer">
            <p className="text-sm text-neutral-600 text-center mb-3">
              {t('auth.quickAccess')}
            </p>
            <div className="space-y-2">
              {/* Botón Agencia */}
              <button
                type="button"
                onClick={async () => {
                  const result = await login({
                    email: 'contacto@tourslima.com',
                    password: 'demo123',
                    remember: true
                  });
                  if (result.success) {
                    toast.success(t('auth.welcome'));
                    navigate('/dashboard');
                  }
                }}
                className="w-full text-left p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 rounded-lg transition-all duration-1000 group hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 flex items-center gap-2">
                      <BuildingOffice2Icon className="w-4 h-4 text-secondary-600" />
                      {t('auth.travelAgency')}
                    </p>
                    <p className="text-sm text-neutral-600">contacto@tourslima.com</p>
                  </div>
                  <span className="badge badge-primary badge-sm">
                    B2B
                  </span>
                </div>
              </button>

              {/* Botón Guía */}
              <button
                type="button"
                onClick={async () => {
                  const result = await login({
                    email: 'carlos@guia.com',
                    password: 'demo123',
                    remember: true
                  });
                  if (result.success) {
                    toast.success(t('auth.welcome'));
                    navigate('/dashboard');
                  }
                }}
                className="w-full text-left p-4 bg-gradient-to-r from-accent-50 to-accent-100 hover:from-accent-100 hover:to-accent-200 rounded-lg transition-all duration-1000 group hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-accent-600" />
                      {t('auth.tourGuide')}
                    </p>
                    <p className="text-sm text-neutral-600">carlos@guia.com</p>
                  </div>
                  <span className="badge badge-info badge-sm">
                    Operativo
                  </span>
                </div>
              </button>

              {/* Botón Guía Freelance */}
              <button
                type="button"
                onClick={async () => {
                  const result = await login({
                    email: 'ana@freelance.com',
                    password: 'demo123',
                    remember: true
                  });
                  if (result.success) {
                    toast.success(t('auth.welcome'));
                    navigate('/dashboard');
                  }
                }}
                className="w-full text-left p-4 bg-gradient-to-r from-success-50 to-success-100 hover:from-success-100 hover:to-success-200 rounded-lg transition-all duration-1000 group hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 flex items-center gap-2">
                      <UserCircleIcon className="w-4 h-4 text-success-600" />
                      {t('auth.freelanceGuide')}
                    </p>
                    <p className="text-sm text-neutral-600">ana@freelance.com</p>
                  </div>
                  <span className="badge badge-success badge-sm">
                    Freelance
                  </span>
                </div>
              </button>

              {/* Botón Admin */}
              <button
                type="button"
                onClick={async () => {
                  const result = await login({
                    email: 'admin@futurismo.com',
                    password: 'demo123',
                    remember: true
                  });
                  if (result.success) {
                    toast.success(t('auth.welcome'));
                    navigate('/dashboard');
                  }
                }}
                className="w-full text-left p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-neutral-100 hover:to-neutral-200 rounded-lg transition-all duration-1000 group hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-neutral-600" />
                      {t('auth.administrator')}
                    </p>
                    <p className="text-sm text-neutral-600">admin@futurismo.com</p>
                  </div>
                  <span className="badge badge-dark badge-sm">
                    Admin
                  </span>
                </div>
              </button>
            </div>
            
            <p className="text-xs text-neutral-500 text-center mt-3">
              {t('auth.validCredentials')}
            </p>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  ¿Eres guía turístico y quieres unirte?
                </p>
                <Link
                  to="/register"
                  className="mt-2 inline-flex items-center btn-link"
                >
                  Regístrate como Guía Freelancer
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-8">
          {t('auth.copyright')}
        </p>
      </div>
    </div>
  );
};

export default Login;