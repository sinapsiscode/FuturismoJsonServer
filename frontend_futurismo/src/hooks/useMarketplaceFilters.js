import { useState, useEffect } from 'react';
import useMarketplaceStore from '../stores/marketplaceStore';
import { DEFAULT_FILTERS, FILTER_SECTIONS } from '../constants/marketplaceConstants';

const useMarketplaceFilters = (onFiltersChange) => {
  const { 
    workZones, 
    tourTypes, 
    groupTypes,
    activeFilters,
    setFilters,
    clearFilters 
  } = useMarketplaceStore();

  const [expandedSections, setExpandedSections] = useState(FILTER_SECTIONS);
  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [filtersCount, setFiltersCount] = useState(0);

  useEffect(() => {
    let count = 0;
    count += localFilters.languages.length;
    count += localFilters.tourTypes.length;
    count += localFilters.workZones.length;
    count += localFilters.groupTypes.length;
    if (localFilters.rating > 0) count++;
    if (localFilters.instantBooking) count++;
    if (localFilters.verified) count++;
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 500) count++;
    setFiltersCount(count);
  }, [localFilters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLanguageToggle = (langCode) => {
    setLocalFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(langCode)
        ? prev.languages.filter(l => l !== langCode)
        : [...prev.languages, langCode]
    }));
  };

  const handleTourTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      tourTypes: prev.tourTypes.includes(type)
        ? prev.tourTypes.filter(t => t !== type)
        : [...prev.tourTypes, type]
    }));
  };

  const handleWorkZoneToggle = (zone) => {
    setLocalFilters(prev => ({
      ...prev,
      workZones: prev.workZones.includes(zone)
        ? prev.workZones.filter(z => z !== zone)
        : [...prev.workZones, zone]
    }));
  };

  const handleGroupTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      groupTypes: prev.groupTypes.includes(type)
        ? prev.groupTypes.filter(t => t !== type)
        : [...prev.groupTypes, type]
    }));
  };

  const handlePriceChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: Number(value)
      }
    }));
  };

  const handleRatingChange = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handleCheckboxChange = (field) => (e) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [field]: e.target.checked 
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    if (onFiltersChange) {
      onFiltersChange(localFilters);
    }
  };

  const resetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
    clearFilters();
    if (onFiltersChange) {
      onFiltersChange(DEFAULT_FILTERS);
    }
  };

  return {
    expandedSections,
    localFilters,
    filtersCount,
    workZones,
    tourTypes,
    groupTypes,
    toggleSection,
    handleLanguageToggle,
    handleTourTypeToggle,
    handleWorkZoneToggle,
    handleGroupTypeToggle,
    handlePriceChange,
    handleRatingChange,
    handleCheckboxChange,
    applyFilters,
    resetFilters
  };
};

export default useMarketplaceFilters;