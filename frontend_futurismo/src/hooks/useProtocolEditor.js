import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const useProtocolEditor = (protocol, onSave) => {
  const [selectedIcon, setSelectedIcon] = useState('🚨');
  const { t } = useTranslation();

  const iconOptions = [
    '🚨', '🚑', '⛈️', '🚗', '🔍', '📡', '🏥', '👮', 
    '🚒', '⚠️', '📋', '🛡️', '📞', '💊', '🩹', '🔧'
  ];

  const contactTypes = [
    { value: 'emergency', label: t('emergency.protocol.contactTypes.emergency') },
    { value: 'coordinator', label: t('emergency.protocol.contactTypes.coordinator') },
    { value: 'management', label: t('emergency.protocol.contactTypes.management') },
    { value: 'police', label: t('emergency.protocol.contactTypes.police') },
    { value: 'medical', label: t('emergency.protocol.contactTypes.medical') },
    { value: 'insurance', label: t('emergency.protocol.contactTypes.insurance') },
    { value: 'towing', label: t('emergency.protocol.contactTypes.towing') },
    { value: 'weather', label: t('emergency.protocol.contactTypes.weather') },
    { value: 'local', label: t('emergency.protocol.contactTypes.local') },
    { value: 'operations', label: t('emergency.protocol.contactTypes.operations') }
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: protocol?.title || '',
      description: protocol?.description || '',
      category: protocol?.category || '',
      priority: protocol?.priority || 'media',
      icon: protocol?.icon || '🚨',
      steps: protocol?.content?.steps?.map(step => ({ text: step })) || [{ text: '' }],
      contacts: protocol?.content?.contacts || [{ name: '', phone: '', type: 'emergency' }],
      materials: protocol?.content?.materials?.map(material => ({ name: material })) || [{ name: '' }]
    }
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control,
    name: 'steps'
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control,
    name: 'contacts'
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial
  } = useFieldArray({
    control,
    name: 'materials'
  });

  const watchedIcon = watch('icon');
  const watchedPriority = watch('priority');

  useEffect(() => {
    setSelectedIcon(watchedIcon);
  }, [watchedIcon]);

  const onSubmit = (data) => {
    const protocolData = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      icon: data.icon,
      content: {
        steps: data.steps.map(step => step.text).filter(text => text.trim() !== ''),
        contacts: data.contacts.filter(contact => contact.name && contact.phone),
        materials: data.materials.map(material => material.name).filter(name => name.trim() !== '')
      }
    };

    onSave(protocolData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'border-red-300 bg-red-50';
      case 'media': return 'border-yellow-300 bg-yellow-50';
      case 'baja': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return {
    // Form handling
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    errors,
    onSubmit,
    
    // Field arrays
    stepFields,
    appendStep,
    removeStep,
    contactFields,
    appendContact,
    removeContact,
    materialFields,
    appendMaterial,
    removeMaterial,
    
    // State
    selectedIcon,
    setSelectedIcon,
    
    // Options
    iconOptions,
    contactTypes,
    
    // Utilities
    getPriorityColor,
    watchedPriority
  };
};

export default useProtocolEditor;