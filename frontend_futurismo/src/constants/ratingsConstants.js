import { RATING_SCALE } from './sharedConstants';

// Re-export rating scales from shared constants
export const RATING_SCALES = {
  MIN: RATING_SCALE.MIN,
  MAX: RATING_SCALE.MAX,
  DEFAULT: RATING_SCALE.DEFAULT
};

export const EVALUATION_CRITERIA = {
  PERFORMANCE: 'performance',
  COMMUNICATION: 'communication',
  PROFESSIONALISM: 'professionalism',
  KNOWLEDGE: 'knowledge',
  PUNCTUALITY: 'punctuality',
  TEAMWORK: 'teamwork'
};

export const RECOMMENDATION_TYPES = {
  HIGHLY_RECOMMEND: 'highly_recommend',
  RECOMMEND: 'recommend',
  SATISFACTORY: 'satisfactory',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  NOT_RECOMMEND: 'not_recommend'
};

import { SERVICE_AREAS as SHARED_SERVICE_AREAS } from './sharedConstants';

// Re-export service areas from shared constants
export const SERVICE_AREAS = SHARED_SERVICE_AREAS;

export const RATING_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
};

export const RATING_ASPECTS = {
  GUIDE_KNOWLEDGE: 'guideKnowledge',
  GUIDE_ATTITUDE: 'guideAttitude',
  TRANSPORT_QUALITY: 'transportQuality',
  ITINERARY: 'itinerary',
  VALUE_FOR_MONEY: 'valueForMoney',
  OVERALL: 'overall'
};

export const FEEDBACK_TYPES = {
  STRENGTHS: 'strengths',
  IMPROVEMENTS: 'improvements',
  GENERAL_COMMENTS: 'generalComments'
};

export const TOURIST_RATING_CATEGORIES = {
  GUIDES: 'guides',
  TRANSPORT: 'transport',
  ITINERARY: 'itinerary',
  VALUE: 'value',
  OVERALL: 'overall'
};

export const RATING_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed'
};

export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  TERTIARY: '#F59E0B',
  DANGER: '#EF4444',
  SUCCESS: '#22C55E',
  WARNING: '#F97316'
};

export const TREND_INDICATORS = {
  POSITIVE: '+',
  NEGATIVE: '-',
  NEUTRAL: '='
};

export const DEFAULT_FEEDBACK = {
  [FEEDBACK_TYPES.STRENGTHS]: '',
  [FEEDBACK_TYPES.IMPROVEMENTS]: '',
  [FEEDBACK_TYPES.GENERAL_COMMENTS]: ''
};

export const TOURIST_RATING_VALUES = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  POOR: 'poor'
};

export const RATING_STEPS = {
  RATING: 'rating',
  SUMMARY: 'summary'
};

export const UI_DELAYS = {
  API_SIMULATION: 1000,
  STEP_TRANSITION: 1000
};

export const RATING_ICONS = {
  EXCELLENT: '😊',
  GOOD: '👍',
  POOR: '😞'
};

export const RATING_COLORS = {
  EXCELLENT: {
    text: 'text-green-600',
    bg: 'bg-green-50 border-green-200 hover:bg-green-100',
    selected: 'bg-green-500 border-green-500 text-white'
  },
  GOOD: {
    text: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    selected: 'bg-blue-500 border-blue-500 text-white'
  },
  POOR: {
    text: 'text-red-600',
    bg: 'bg-red-50 border-red-200 hover:bg-red-100',
    selected: 'bg-red-500 border-red-500 text-white'
  }
};

export const RATED_BY_TYPES = {
  AGENCY: 'agency',
  TOURIST: 'tourist',
  SYSTEM: 'system'
};