import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useGuidesStore from '../stores/guidesStore';
import { DNI_REGEX, EMAIL_REGEX } from '../constants/guidesConstants';

const useGuideForm = (guide, onSave) => {
  const { t } = useTranslation();
  const { languages = [], museums = [] } = useGuidesStore();
  const [activeTab, setActiveTab] = useState('personal');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: guide?.fullName || '',
      dni: guide?.dni || '',
      phone: guide?.phone || '',
      email: guide?.email || '',
      address: guide?.address || '',
      guideType: guide?.guideType || 'freelance',
      languages: guide?.specializations?.languages || [{ code: '', level: 'principiante' }],
      museums: guide?.specializations?.museums || [{ name: '', expertise: 'basico', years: 1, certificates: [] }]
    }
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control,
    name: 'languages'
  });

  const {
    fields: museumFields,
    append: appendMuseum,
    remove: removeMuseum
  } = useFieldArray({
    control,
    name: 'museums'
  });

  const watchedLanguages = watch('languages');
  const watchedMuseums = watch('museums');

  const getAvailableLanguages = (currentIndex) => {
    const selectedCodes = watchedLanguages
      .map((lang, index) => index !== currentIndex ? lang.code : null)
      .filter(Boolean);
    
    return languages.filter(lang => !selectedCodes.includes(lang.code));
  };

  const onSubmit = (data) => {
    const guideData = {
      fullName: data.fullName,
      dni: data.dni,
      phone: data.phone,
      email: data.email,
      address: data.address,
      guideType: data.guideType,
      specializations: {
        languages: data.languages.filter(lang => lang.code && lang.level),
        museums: data.museums.filter(museum => museum.name && museum.expertise)
      }
    };

    onSave(guideData);
  };

  const validationRules = {
    fullName: { 
      required: t('guides.form.validation.nameRequired') 
    },
    dni: { 
      required: t('guides.form.validation.dniRequired'),
      pattern: {
        value: DNI_REGEX,
        message: t('guides.form.validation.dniFormat')
      }
    },
    phone: { 
      required: t('guides.form.validation.phoneRequired') 
    },
    email: { 
      required: t('guides.form.validation.emailRequired'),
      pattern: {
        value: EMAIL_REGEX,
        message: t('guides.form.validation.emailFormat')
      }
    },
    address: { 
      required: t('guides.form.validation.addressRequired') 
    },
    guideType: { 
      required: t('guides.form.validation.guideTypeRequired') 
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    activeTab,
    setActiveTab,
    languageFields,
    appendLanguage,
    removeLanguage,
    museumFields,
    appendMuseum,
    removeMuseum,
    watchedLanguages,
    watchedMuseums,
    getAvailableLanguages,
    onSubmit,
    validationRules,
    languages,
    museums,
    watch,
    setValue
  };
};

export default useGuideForm;