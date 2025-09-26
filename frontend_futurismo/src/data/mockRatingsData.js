import { 
  EVALUATION_CRITERIA,
  RECOMMENDATION_TYPES,
  SERVICE_AREAS,
  RATING_PERIODS,
  RATING_STATUS
} from '../constants/ratingsConstants';

export const getMockEvaluationCriteria = () => [
  {
    key: EVALUATION_CRITERIA.PERFORMANCE,
    label: 'ratings.evaluation.criteria.performance',
    icon: 'ArrowTrendingUpIcon',
    description: 'ratings.evaluation.criteria.performanceDesc'
  },
  {
    key: EVALUATION_CRITERIA.COMMUNICATION,
    label: 'ratings.evaluation.criteria.communication',
    icon: 'ChatBubbleLeftRightIcon',
    description: 'ratings.evaluation.criteria.communicationDesc'
  },
  {
    key: EVALUATION_CRITERIA.PROFESSIONALISM,
    label: 'ratings.evaluation.criteria.professionalism',
    icon: 'TrophyIcon',
    description: 'ratings.evaluation.criteria.professionalismDesc'
  },
  {
    key: EVALUATION_CRITERIA.KNOWLEDGE,
    label: 'ratings.evaluation.criteria.knowledge',
    icon: 'AcademicCapIcon',
    description: 'ratings.evaluation.criteria.knowledgeDesc'
  },
  {
    key: EVALUATION_CRITERIA.PUNCTUALITY,
    label: 'ratings.evaluation.criteria.punctuality',
    icon: 'ClockIcon',
    description: 'ratings.evaluation.criteria.punctualityDesc'
  },
  {
    key: EVALUATION_CRITERIA.TEAMWORK,
    label: 'ratings.evaluation.criteria.teamwork',
    icon: 'UserGroupIcon',
    description: 'ratings.evaluation.criteria.teamworkDesc'
  }
];

export const getMockRecommendationOptions = () => [
  { 
    value: RECOMMENDATION_TYPES.HIGHLY_RECOMMEND, 
    label: 'ratings.recommendation.highlyRecommend', 
    color: 'text-green-600' 
  },
  { 
    value: RECOMMENDATION_TYPES.RECOMMEND, 
    label: 'ratings.recommendation.recommend', 
    color: 'text-blue-600' 
  },
  { 
    value: RECOMMENDATION_TYPES.SATISFACTORY, 
    label: 'ratings.recommendation.satisfactory', 
    color: 'text-yellow-600' 
  },
  { 
    value: RECOMMENDATION_TYPES.NEEDS_IMPROVEMENT, 
    label: 'ratings.recommendation.needsImprovement', 
    color: 'text-orange-600' 
  },
  { 
    value: RECOMMENDATION_TYPES.NOT_RECOMMEND, 
    label: 'ratings.recommendation.notRecommend', 
    color: 'text-red-600' 
  }
];

export const getMockServiceAreas = () => [
  { key: SERVICE_AREAS.CUSTOMER_SERVICE, label: 'ratings.serviceAreas.customerService' },
  { key: SERVICE_AREAS.OPERATIONS, label: 'ratings.serviceAreas.operations' },
  { key: SERVICE_AREAS.PUNCTUALITY, label: 'ratings.serviceAreas.punctuality' },
  { key: SERVICE_AREAS.COMMUNICATION, label: 'ratings.serviceAreas.communication' },
  { key: SERVICE_AREAS.LOGISTICS, label: 'ratings.serviceAreas.logistics' },
  { key: SERVICE_AREAS.SAFETY, label: 'ratings.serviceAreas.safety' }
];

export const getMockPeriods = () => [
  { value: RATING_PERIODS.WEEK, label: 'ratings.periods.week' },
  { value: RATING_PERIODS.MONTH, label: 'ratings.periods.month' },
  { value: RATING_PERIODS.QUARTER, label: 'ratings.periods.quarter' },
  { value: RATING_PERIODS.YEAR, label: 'ratings.periods.year' }
];

export const getMockDashboardStats = () => ({
  totalRatings: 1247,
  averageRating: 4.3,
  staffEvaluated: 25,
  improvementTrend: '+12%'
});

export const getMockAreaStats = () => ({
  [SERVICE_AREAS.CUSTOMER_SERVICE]: { average: 4.5, count: 245, trend: '+5%' },
  [SERVICE_AREAS.OPERATIONS]: { average: 4.2, count: 189, trend: '+8%' },
  [SERVICE_AREAS.PUNCTUALITY]: { average: 4.1, count: 203, trend: '+3%' },
  [SERVICE_AREAS.COMMUNICATION]: { average: 4.4, count: 167, trend: '+10%' },
  [SERVICE_AREAS.LOGISTICS]: { average: 4.0, count: 134, trend: '+2%' },
  [SERVICE_AREAS.SAFETY]: { average: 4.6, count: 156, trend: '+7%' }
});

export const getMockStaffStats = () => [
  { 
    id: 1, 
    name: 'ratings.staff.mockName1', 
    role: 'ratings.staff.role.tourGuide', 
    rating: 4.8, 
    evaluations: 15 
  },
  { 
    id: 2, 
    name: 'ratings.staff.mockName2', 
    role: 'ratings.staff.role.coordinator', 
    rating: 4.6, 
    evaluations: 12 
  },
  { 
    id: 3, 
    name: 'ratings.staff.mockName3', 
    role: 'ratings.staff.role.driver', 
    rating: 4.4, 
    evaluations: 18 
  },
  { 
    id: 4, 
    name: 'ratings.staff.mockName4', 
    role: 'ratings.staff.role.receptionist', 
    rating: 4.7, 
    evaluations: 14 
  }
];

export const getMockTouristRating = () => ({
  touristName: 'ratings.tourist.mockName',
  touristEmail: 'tourist@example.com',
  tourName: 'ratings.tour.mockName',
  tourDate: new Date().toISOString(),
  ratings: {
    guides: 0,
    transport: 0,
    itinerary: 0,
    value: 0,
    overall: 0
  },
  feedback: {
    positive: '',
    negative: '',
    suggestions: ''
  },
  wouldRecommend: true,
  status: RATING_STATUS.PENDING
});

export const getEmptyEvaluation = () => {
  const evaluation = {};
  Object.values(EVALUATION_CRITERIA).forEach(criteria => {
    evaluation[criteria] = 0;
  });
  return evaluation;
};