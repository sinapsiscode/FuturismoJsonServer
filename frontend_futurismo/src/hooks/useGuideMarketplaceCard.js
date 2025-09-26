import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WORK_ZONE_NAMES } from '../constants/marketplaceConstants';

const useGuideMarketplaceCard = (guide, onSelect) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation();

  const getDisplayLanguages = () => {
    return guide.specializations.languages
      .filter(lang => lang.level !== 'basico')
      .slice(0, 3)
      .map(lang => lang.code.toUpperCase());
  };

  const getWorkZoneNames = () => {
    return guide.specializations.workZones
      .slice(0, 2)
      .map(zone => t(WORK_ZONE_NAMES[zone] || zone));
  };

  const getYearsExperience = () => {
    return guide.marketplaceStats.yearsExperience || 
           Math.floor(guide.marketplaceStats.totalBookings / 30);
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(guide);
    }
  };

  return {
    isFavorite,
    displayLanguages: getDisplayLanguages(),
    workZoneNames: getWorkZoneNames(),
    yearsExperience: getYearsExperience(),
    handleFavoriteToggle,
    handleCardClick
  };
};

export default useGuideMarketplaceCard;