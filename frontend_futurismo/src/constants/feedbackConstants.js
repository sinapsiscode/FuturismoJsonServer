import { SERVICE_AREAS as SHARED_SERVICE_AREAS } from './sharedConstants';

// Service areas for feedback module
export const SERVICE_AREAS = [
  { key: SHARED_SERVICE_AREAS.CUSTOMER_SERVICE, label: 'feedback.areas.customerService' },
  { key: SHARED_SERVICE_AREAS.OPERATIONS, label: 'feedback.areas.operations' },
  { key: SHARED_SERVICE_AREAS.PUNCTUALITY, label: 'feedback.areas.punctuality' },
  { key: SHARED_SERVICE_AREAS.COMMUNICATION, label: 'feedback.areas.communication' },
  { key: SHARED_SERVICE_AREAS.LOGISTICS, label: 'feedback.areas.logistics' },
  { key: SHARED_SERVICE_AREAS.SAFETY, label: 'feedback.areas.safety' }
];

export const STATUS_TYPES = [
  { value: 'pending', label: 'feedback.status.pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reviewed', label: 'feedback.status.reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'feedback.status.inProgress', color: 'bg-orange-100 text-orange-800' },
  { value: 'implemented', label: 'feedback.status.implemented', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'feedback.status.rejected', color: 'bg-red-100 text-red-800' }
];

export const FEEDBACK_TYPES = {
  suggestion: 'suggestion',
  recognition: 'recognition',
  positive: 'positive',
  negative: 'negative'
};