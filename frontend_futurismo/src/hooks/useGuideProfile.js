import { useTranslation } from 'react-i18next';
import useGuidesStore from '../stores/guidesStore';
import { LEVEL_COLORS, GUIDE_STATUS } from '../constants/guidesConstants';

const useGuideProfile = (guide) => {
  const { t } = useTranslation();
  const { languages = [], museums = [] } = useGuidesStore();

  const getLanguageInfo = (langCode) => {
    return languages.find(lang => lang.code === langCode) || { 
      name: langCode, 
      code: langCode 
    };
  };

  const getMuseumInfo = (museumName) => {
    return { name: museumName || t('guides.profile.unknownMuseum') };
  };

  const getLevelInfo = (level) => {
    const color = LEVEL_COLORS[level] || LEVEL_COLORS.principiante;
    const label = t(`guides.levels.${level}`) || level;
    return { color, label };
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'G';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isActive = guide?.status === GUIDE_STATUS.active;

  const getGuideTypeLabel = (type) => {
    return t(`guides.types.${type}`) || type;
  };

  const getGuideTypeColor = (type) => {
    return type === 'planta' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  // Calcular años de experiencia dinámicamente si hay fecha de inicio profesional
  const calculateYearsExperience = () => {
    if (guide?.professionalStartDate) {
      const start = new Date(guide.professionalStartDate);
      const now = new Date();
      const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
      return Math.floor(years);
    }
    return guide?.stats?.yearsExperience || 0;
  };

  const stats = {
    toursCompleted: guide?.stats?.toursCompleted || 0,
    yearsExperience: calculateYearsExperience(),
    certifications: guide?.stats?.certifications || 0,
    rating: guide?.stats?.rating || 0
  };

  return {
    t,
    getLanguageInfo,
    getMuseumInfo,
    getLevelInfo,
    getInitials,
    isActive,
    getGuideTypeLabel,
    getGuideTypeColor,
    stats,
    languages: guide?.specializations?.languages || [],
    museums: guide?.specializations?.museums || []
  };
};

export default useGuideProfile;