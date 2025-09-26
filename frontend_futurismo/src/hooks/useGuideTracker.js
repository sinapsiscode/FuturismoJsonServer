import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GUIDE_STATUS, 
  SIGNAL_QUALITY, 
  TABS,
  BATTERY_LEVELS 
} from '../constants/monitoringConstants';
import { getMockGuideData } from '../data/mockMonitoringData';

const useGuideTracker = (guide) => {
  const [activeTab, setActiveTab] = useState(TABS.INFO);
  const { t } = useTranslation();

  const mockGuideData = guide || getMockGuideData();
  
  // Traducir los textos del mock data
  const mockGuide = {
    ...mockGuideData,
    name: t(mockGuideData.name),
    email: t(mockGuideData.email),
    currentTour: mockGuideData.currentTour ? {
      ...mockGuideData.currentTour,
      name: t(mockGuideData.currentTour.name)
    } : null,
    recentActivity: mockGuideData.recentActivity.map(activity => ({
      ...activity,
      message: t(activity.message)
    }))
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case SIGNAL_QUALITY.EXCELLENT: return 'text-green-600';
      case SIGNAL_QUALITY.GOOD: return 'text-blue-600';
      case SIGNAL_QUALITY.REGULAR: return 'text-yellow-600';
      case SIGNAL_QUALITY.POOR: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBatteryColor = (level) => {
    if (level > BATTERY_LEVELS.HIGH) return 'text-green-600';
    if (level > BATTERY_LEVELS.MEDIUM) return 'text-yellow-600';
    return 'text-red-600';
  };

  return {
    guide: mockGuide,
    activeTab,
    setActiveTab,
    getSignalColor,
    getBatteryColor
  };
};

export default useGuideTracker;