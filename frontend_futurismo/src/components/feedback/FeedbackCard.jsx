import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  LightBulbIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { STATUS_TYPES } from '../../constants/feedbackConstants';

const FeedbackCard = ({ feedback, type = 'service' }) => {
  const { t } = useTranslation();
  
  const getStatusInfo = (status) => {
    const statusInfo = STATUS_TYPES.find(s => s.value === status) || STATUS_TYPES[0];
    return {
      ...statusInfo,
      label: t(statusInfo.label)
    };
  };

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

  const getFeedbackTypeIcon = (feedbackType) => {
    const icons = {
      suggestion: <LightBulbIcon className="text-blue-600 w-4 h-4" />,
      recognition: <HandThumbUpIcon className="text-green-600 w-4 h-4" />,
      positive: <HandThumbUpIcon className="text-green-600 w-4 h-4" />,
      negative: <HandThumbDownIcon className="text-red-600 w-4 h-4" />
    };
    return icons[feedbackType] || <ChatBubbleLeftRightIcon className="text-gray-600 w-4 h-4" />;
  };

  const statusInfo = getStatusInfo(feedback.status);
  const StatusIcon = getStatusIcon(feedback.status);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getFeedbackTypeIcon(feedback.type)}
          <h4 className="font-semibold text-gray-800">
            {t(feedback.title)}
          </h4>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusInfo.label}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {t(feedback.description)}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          {type === 'service' && (
            <span className="bg-gray-100 px-2 py-1 rounded mr-2">
              {t(`feedback.areas.${feedback.area}`)}
            </span>
          )}
          {type === 'staff' && (
            <span className="bg-gray-100 px-2 py-1 rounded mr-2">
              {feedback.staffName} - {t(`feedback.categories.${feedback.category}`)}
            </span>
          )}
          <span>{t('common.by')}: {feedback.submittedBy}</span>
        </div>
        <span>{feedback.timestamp}</span>
      </div>
    </div>
  );
};

FeedbackCard.propTypes = {
  feedback: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submittedBy: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    area: PropTypes.string,
    staffName: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  type: PropTypes.oneOf(['service', 'staff'])
};

export default FeedbackCard;