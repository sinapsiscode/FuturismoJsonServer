import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline';
import { SERVICE_AREAS, STATUS_TYPES } from '../../constants/feedbackConstants';

const FeedbackAnalytics = ({ serviceFeedback, statusData }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      reviewed: EyeIcon,
      in_progress: ExclamationTriangleIcon,
      implemented: CheckCircleIcon,
      rejected: HandThumbDownIcon
    };
    return icons[status] || ClockIcon;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Feedback by Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('feedback.analytics.distributionByArea')}
        </h3>
        <div className="space-y-3">
          {SERVICE_AREAS.map(area => {
            const count = serviceFeedback[area.key] || 0;
            const percentage = serviceFeedback.total > 0 
              ? (count / serviceFeedback.total * 100).toFixed(1) 
              : 0;
            
            return (
              <div key={area.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t(area.label)}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800 w-8">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('feedback.analytics.statusDistribution')}
        </h3>
        <div className="space-y-3">
          {STATUS_TYPES.map(status => {
            const StatusIcon = getStatusIcon(status.value);
            const count = statusData[status.value] || 0;
            const percentage = statusData.total > 0 
              ? (count / statusData.total * 100).toFixed(1) 
              : 0;
            
            return (
              <div key={status.value} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t(status.label)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800 w-8">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

FeedbackAnalytics.propTypes = {
  serviceFeedback: PropTypes.object.isRequired,
  statusData: PropTypes.object.isRequired
};

export default FeedbackAnalytics;