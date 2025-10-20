import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GUIDE_STATUS,
  SIGNAL_QUALITY,
  TABS,
  BATTERY_LEVELS
} from '../constants/monitoringConstants';

// Mock guide data generator (fallback si no se pasa guide prop)
const generateMockGuideData = () => ({
  id: 'guide-mock-1',
  name: 'Carlos Mendoza',
  email: 'carlos@guia.com',
  phone: '+51987654323',
  avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=F59E0B&color=fff',
  status: GUIDE_STATUS.ACTIVE,
  location: {
    lat: -12.046374,
    lng: -77.042793
  },
  signal: SIGNAL_QUALITY.EXCELLENT,
  battery: 87,
  currentTour: {
    id: 'tour-1',
    name: 'City Tour Lima Centro',
    startTime: '09:00',
    endTime: '13:00',
    tourists: 15
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'checkpoint',
      message: 'Punto de control: Plaza Mayor',
      timestamp: new Date().toISOString()
    },
    {
      id: 'act-2',
      type: 'status',
      message: 'Tour iniciado',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  stats: {
    toursCompleted: 124,
    averageRating: 4.8,
    totalHours: 486
  }
});

const useGuideTracker = (guide) => {
  const [activeTab, setActiveTab] = useState(TABS.INFO);
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        setLoading(true);

        if (guide?.id) {
          // Si se pasa un guide con ID, cargar datos desde la API
          const response = await fetch(`/api/monitoring/guides/${guide.id}`);
          const result = await response.json();

          if (result.success) {
            setGuideData(result.data);
          } else {
            // Si falla, usar el guide pasado como prop
            setGuideData(guide);
          }
        } else if (guide) {
          // Si se pasa guide sin ID, usarlo directamente
          setGuideData(guide);
        } else {
          // Si no se pasa guide, generar datos mock
          setGuideData(generateMockGuideData());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading guide data:', error);
        // En caso de error, usar el guide prop o generar mock
        setGuideData(guide || generateMockGuideData());
        setLoading(false);
      }
    };

    loadGuideData();
  }, [guide]);

  // Traducir los textos del guide data
  const mockGuide = guideData ? {
    ...guideData,
    name: t(guideData.name),
    email: t(guideData.email),
    currentTour: guideData.currentTour ? {
      ...guideData.currentTour,
      name: t(guideData.currentTour.name)
    } : null,
    recentActivity: (guideData.recentActivity || []).map(activity => ({
      ...activity,
      message: t(activity.message)
    }))
  } : null;

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
    getBatteryColor,
    loading
  };
};

export default useGuideTracker;
