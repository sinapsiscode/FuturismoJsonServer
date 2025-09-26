import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getEmptyProvider } from '../data/mockProvidersData';
import { VALIDATION_MESSAGES, RATING_RANGE } from '../constants/providersConstants';

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
    'contact.contactPerson': yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    'contact.phone': yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    'contact.email': yup.string()
      .email(t(VALIDATION_MESSAGES.INVALID_EMAIL))
      .required(t(VALIDATION_MESSAGES.REQUIRED)),
    'contact.address': yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    'pricing.basePrice': yup.number()
      .positive(t(VALIDATION_MESSAGES.POSITIVE_NUMBER))
      .required(t(VALIDATION_MESSAGES.REQUIRED)),
    'pricing.type': yup.string().required(t(VALIDATION_MESSAGES.REQUIRED)),
    rating: yup.number()
      .min(RATING_RANGE.MIN, t(VALIDATION_MESSAGES.MIN_VALUE, { value: RATING_RANGE.MIN }))
      .max(RATING_RANGE.MAX, t(VALIDATION_MESSAGES.MAX_VALUE, { value: RATING_RANGE.MAX }))
      .required(t(VALIDATION_MESSAGES.REQUIRED)),
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
    defaultValues
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