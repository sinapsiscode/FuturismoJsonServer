import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon as Star } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const EvaluationCriteriaItem = ({ criterion, rating, onRatingChange }) => {
  const { t } = useTranslation();
  const IconComponent = require(`@heroicons/react/24/outline/${criterion.icon}`)[criterion.icon];

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(criterion.key, star)}
            className={`transition-colors ${
              star <= rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star
              size={18}
              fill={star <= rating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : t('ratings.evaluation.notEvaluated')}
        </span>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center mb-2">
        <IconComponent className="text-blue-600 mr-2" size={18} />
        <h3 className="font-medium text-gray-800">{t(criterion.label)}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{t(criterion.description)}</p>
      
      <div>{renderStars()}</div>
    </div>
  );
};

EvaluationCriteriaItem.propTypes = {
  criterion: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired
};

export default EvaluationCriteriaItem;