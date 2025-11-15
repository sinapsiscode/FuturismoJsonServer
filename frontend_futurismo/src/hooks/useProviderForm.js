import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { VALIDATION_MESSAGES, RATING_RANGE } from '../constants/providersConstants';

// Fallback values para evitar undefined
const MIN_RATING = RATING_RANGE?.MIN || 1;
const MAX_RATING = RATING_RANGE?.MAX || 5;

// Empty provider template for new providers
const getEmptyProvider = () => ({
  name: '',
  category: '',
  location: '',
  contact: {
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  },
  pricing: {
    basePrice: 1, // Valor por defecto 1 (debe ser positivo)
    type: 'fixed'
  },
  rating: 3, // Valor por defecto 3 (rango 1-5)
  capacity: 1,
  services: [''],
  specialties: [],
  languages: []
});

const useProviderForm = (provider, onSave, onCancel) => {
  const { t } = useTranslation();
  const [services, setServices] = useState(provider?.services || ['']);
  const [specialties, setSpecialties] = useState(provider?.specialties || []);
  const [languages, setLanguages] = useState(provider?.languages || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // Schema with i18n validation messages
  const providerSchema = yup.object({
    name: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    category: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    location: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    contact: yup.object({
      contactPerson: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
      phone: yup.string()
        .required(t(VALIDATION_MESSAGES.REQUIRED))
        .matches(/^9\d{8}$/, 'El teléfono debe tener exactamente 9 dígitos'),
      email: yup.string()
        .email(t(VALIDATION_MESSAGES.INVALID_EMAIL))
        .required(t(VALIDATION_MESSAGES.REQUIRED)),
      address: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED))
    }),
    pricing: yup.object({
      basePrice: yup.number()
        .positive(t(VALIDATION_MESSAGES.POSITIVE_NUMBER))
        .required(t(VALIDATION_MESSAGES.REQUIRED)),
      type: yup.string().required(t(VALIDATION_MESSAGES.REQUIRED))
    }),
    rating: yup.number()
      .transform((value, originalValue) => {
        // Si está vacío o es NaN, devolver el valor por defecto
        return originalValue === '' || isNaN(value) ? 3 : value;
      })
      .min(MIN_RATING, `El valor mínimo es ${MIN_RATING}`)
      .max(MAX_RATING, `El valor máximo es ${MAX_RATING}`),
    capacity: yup.number().positive(t(VALIDATION_MESSAGES.POSITIVE_NUMBER))
  });

  const defaultValues = provider || getEmptyProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(providerSchema),
    defaultValues,
    mode: 'onSubmit', // Solo validar al enviar
    reValidateMode: 'onChange' // Re-validar mientras escribe después del primer intento
  });

  useEffect(() => {
    if (provider) {
      setServices(provider.services || ['']);
      setSpecialties(provider.specialties || []);
      setLanguages(provider.languages || []);
    }
  }, [provider]);

  const handleAddService = () => {
    setServices([...services, '']);
  };

  const handleRemoveService = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      services: services.filter(s => s.trim()),
      specialties,
      languages
    };

    onSave(formData);
    toast.success(t('providers.form.saveSuccess'));
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    services,
    specialties,
    languages,
    newSpecialty,
    setNewSpecialty,
    newLanguage,
    setNewLanguage,
    handleAddService,
    handleRemoveService,
    handleServiceChange,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleAddLanguage,
    handleRemoveLanguage,
    onSubmit,
    handleCancel
  };
};

export default useProviderForm;