import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useProvidersStore from '../stores/providersStore';
import { getMockTours, getEmptyAssignment } from '../data/mockProvidersData';
import { TIME_SLOTS } from '../constants/providersConstants';

const useProviderAssignment = (existingAssignment, onClose) => {
  const { t } = useTranslation();
  const { locations, categories, actions } = useProvidersStore();
  
  const [selectedTour, setSelectedTour] = useState(existingAssignment?.tourId || '');
  const [selectedDate, setSelectedDate] = useState(existingAssignment?.date || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedProviders, setAssignedProviders] = useState(existingAssignment?.providers || []);
  const [availableProviders, setAvailableProviders] = useState([]);

  const defaultValues = existingAssignment || getEmptyAssignment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({ defaultValues });

  // Get translated tours
  const availableTours = getMockTours().map(tour => ({
    ...tour,
    name: t(tour.name)
  }));

  useEffect(() => {
    const loadProviders = async () => {
      try {
        // Get providers from store (use stored providers directly for filtering)
        const storeProviders = actions.getProvidersByLocationAndCategory(selectedLocation, selectedCategory);
        
        let providers = storeProviders;

        // Apply search filter if there's a search query
        if (searchQuery && searchQuery.trim()) {
          providers = providers.filter(p => 
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Exclude already assigned providers
        const assignedIds = assignedProviders.map(ap => ap.providerId);
        providers = providers.filter(p => !assignedIds.includes(p.id));

        setAvailableProviders(providers);
      } catch (error) {
        console.error('Error loading providers:', error);
        setAvailableProviders([]);
      }
    };

    loadProviders();
  }, [searchQuery, selectedLocation, selectedCategory, assignedProviders, actions]);

  const handleAddProvider = (provider) => {
    const newAssignment = {
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.category,
      providerLocation: provider.location,
      startTime: TIME_SLOTS.DEFAULT_START,
      endTime: TIME_SLOTS.DEFAULT_END,
      service: provider.services[0] || '',
      notes: ''
    };

    setAssignedProviders([...assignedProviders, newAssignment]);
    toast.success(t('providers.assignment.providerAdded'));
  };

  const handleRemoveProvider = (index) => {
    setAssignedProviders(assignedProviders.filter((_, i) => i !== index));
    toast.success(t('providers.assignment.providerRemoved'));
  };

  const handleProviderTimeChange = (index, field, value) => {
    const updated = [...assignedProviders];
    updated[index] = { ...updated[index], [field]: value };
    setAssignedProviders(updated);
  };

  const handleSaveAssignment = (data) => {
    if (assignedProviders.length === 0) {
      toast.error(t('providers.assignment.noProvidersError'));
      return;
    }

    const assignmentData = {
      ...data,
      providers: assignedProviders,
      status: 'draft'
    };

    if (existingAssignment) {
      actions.updateAssignment(existingAssignment.id, assignmentData);
      toast.success(t('providers.assignment.updateSuccess'));
    } else {
      actions.createAssignment(assignmentData);
      toast.success(t('providers.assignment.createSuccess'));
    }

    onClose();
  };

  const handleFinalizeAssignment = () => {
    if (assignedProviders.length === 0) {
      toast.error(t('providers.assignment.noProvidersError'));
      return;
    }

    const assignmentData = {
      tourId: watch('tourId'),
      tourName: watch('tourName'),
      date: watch('date'),
      notes: watch('notes'),
      providers: assignedProviders,
      status: 'confirmed'
    };

    if (existingAssignment) {
      actions.updateAssignment(existingAssignment.id, assignmentData);
    } else {
      actions.createAssignment(assignmentData);
    }

    toast.success(t('providers.assignment.finalizeSuccess'));
    onClose();
  };

  const handleExportPDF = () => {
    const assignmentData = {
      id: existingAssignment?.id || 'draft',
      tourName: watch('tourName'),
      date: watch('date'),
      providers: assignedProviders
    };

    // In a real app, this would call pdfService
    console.log('Exporting PDF:', assignmentData);
    toast.success(t('providers.assignment.exportSuccess'));
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    selectedTour,
    setSelectedTour,
    selectedDate,
    setSelectedDate,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    assignedProviders,
    availableProviders,
    availableTours,
    locations,
    categories,
    handleAddProvider,
    handleRemoveProvider,
    handleProviderTimeChange,
    handleSaveAssignment,
    handleFinalizeAssignment,
    handleExportPDF
  };
};

export default useProviderAssignment;