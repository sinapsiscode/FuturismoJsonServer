import { TOUR_STATUS, GUIDE_STATUS, SIGNAL_QUALITY, ACTIVITY_TYPES } from '../constants/monitoringConstants';
import { CheckCircleIcon, ExclamationTriangleIcon, MapIcon } from '@heroicons/react/24/outline';

export const getMockTourData = (tourId) => ({
  id: tourId || '1',
  name: 'monitoring.tour.mockName',
  guide: {
    name: 'monitoring.guide.mockName',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  tourists: {
    total: 12,
    present: 12,
    missing: 0
  },
  startTime: new Date(Date.now() - 7200000),
  estimatedEndTime: new Date(Date.now() + 3600000),
  actualStartTime: new Date(Date.now() - 7000000),
  stops: [
    {
      id: 1,
      name: 'monitoring.stops.stop1.name',
      description: 'monitoring.stops.stop1.description',
      estimatedTime: 30,
      actualTime: 35,
      arrivalTime: new Date(Date.now() - 6300000),
      departureTime: new Date(Date.now() - 6000000),
      status: TOUR_STATUS.COMPLETED,
      coordinates: { latitude: -12.046374, longitude: -77.042793 }, // Plaza de Armas Lima
      isRequired: true, // Punto obligatorio para fotos
      photos: [
        {
          id: 1,
          url: 'https://via.placeholder.com/300x300?text=Stop+1',
          name: 'stop_1_photo_1.jpg',
          uploadedAt: new Date(Date.now() - 6000000)
        },
        {
          id: 2,
          url: 'https://via.placeholder.com/300x300?text=Stop+1+Photo+2',
          name: 'stop_1_photo_2.jpg',
          uploadedAt: new Date(Date.now() - 5900000)
        }
      ],
      incidents: []
    },
    {
      id: 2,
      name: 'monitoring.stops.stop2.name',
      description: 'monitoring.stops.stop2.description',
      estimatedTime: 45,
      actualTime: 40,
      arrivalTime: new Date(Date.now() - 5700000),
      departureTime: new Date(Date.now() - 5400000),
      status: TOUR_STATUS.COMPLETED,
      coordinates: { latitude: -12.043333, longitude: -77.028611 }, // Catedral de Lima
      isRequired: true, // Punto obligatorio para fotos
      photos: [
        {
          id: 3,
          url: 'https://via.placeholder.com/300x300?text=Stop+2',
          name: 'stop_2_photo_1.jpg',
          uploadedAt: new Date(Date.now() - 5400000)
        }
      ],
      incidents: []
    },
    {
      id: 3,
      name: 'monitoring.stops.stop3.name',
      description: 'monitoring.stops.stop3.description',
      estimatedTime: 30,
      actualTime: null,
      arrivalTime: new Date(Date.now() - 300000),
      departureTime: null,
      status: TOUR_STATUS.IN_PROGRESS,
      coordinates: { latitude: -12.048889, longitude: -77.036111 }, // Palacio de Gobierno
      isRequired: false, // Punto opcional
      photos: [],
      incidents: [
        {
          type: 'delay',
          message: 'monitoring.incidents.guardChange',
          time: new Date(Date.now() - 600000)
        }
      ]
    },
    {
      id: 4,
      name: 'monitoring.stops.stop4.name',
      description: 'monitoring.stops.stop4.description',
      estimatedTime: 60,
      actualTime: null,
      arrivalTime: null,
      departureTime: null,
      status: TOUR_STATUS.PENDING,
      coordinates: { latitude: -12.063889, longitude: -77.030556 }, // Convento de San Francisco
      isRequired: true, // Punto obligatorio para fotos
      photos: [],
      incidents: []
    },
    {
      id: 5,
      name: 'monitoring.stops.stop5.name',
      description: 'monitoring.stops.stop5.description',
      estimatedTime: 45,
      actualTime: null,
      arrivalTime: null,
      departureTime: null,
      status: TOUR_STATUS.PENDING,
      coordinates: { latitude: -12.047500, longitude: -77.034167 }, // Casa de Aliaga (Centro histórico)
      isRequired: false, // Punto opcional
      photos: [],
      incidents: []
    }
  ],
  incidents: [
    {
      id: 1,
      type: 'delay',
      message: 'monitoring.incidents.startDelay',
      time: new Date(Date.now() - 7000000)
    }
  ]
});

export const getMockGuideData = (guideId) => ({
  id: guideId || '1',
  name: 'monitoring.guide.mockName',
  email: 'monitoring.guide.mockEmail',
  avatar: 'https://i.pravatar.cc/150?img=1',
  status: GUIDE_STATUS.ACTIVE,
  currentTour: {
    name: 'monitoring.tour.mockName',
    startTime: new Date(Date.now() - 3600000),
    tourists: 12,
    progress: 60
  },
  device: {
    battery: 75,
    signal: SIGNAL_QUALITY.GOOD,
    lastUpdate: new Date(Date.now() - 300000)
  },
  stats: {
    toursToday: 2,
    toursTotals: 156,
    rating: 4.8,
    punctuality: 95
  },
  recentActivity: [
    {
      id: 1,
      type: ACTIVITY_TYPES.CHECKPOINT,
      message: 'monitoring.activity.arrivedCheckpoint',
      time: new Date(Date.now() - 1800000),
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: ACTIVITY_TYPES.DELAY,
      message: 'monitoring.activity.trafficDelay',
      time: new Date(Date.now() - 2700000),
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: ACTIVITY_TYPES.START,
      message: 'monitoring.activity.tourStarted',
      time: new Date(Date.now() - 3600000),
      icon: MapIcon,
      color: 'text-blue-600'
    }
  ],
  deviceStatus: {
    gps: { active: true, icon: CheckCircleIcon, color: 'text-green-600' },
    internet: { active: true, icon: CheckCircleIcon, color: 'text-green-600' },
    batterySaver: { active: false, icon: CheckCircleIcon, color: 'text-gray-600' }
  }
});

export const MAP_CONFIG = {
  defaultCenter: [-12.0464, -77.0428],
  defaultZoom: 12,
  maxZoom: 19,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
};