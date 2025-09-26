import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon as Star } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const EvaluationSummary = ({ averageRating, recommendationLabel }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-green-800">
            {t('ratings.evaluation.summary.title')}
          </h4>
          <p className="text-green-600">
            {t('ratings.evaluation.summary.average')}: {averageRating.toFixed(1)}/5 - {t(recommendationLabel)}
          </p>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
              fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

EvaluationSummary.propTypes = {
  averageRating: PropTypes.number.isRequired,
  recommendationLabel: PropTypes.string.isRequired
};

export default EvaluationSummary;