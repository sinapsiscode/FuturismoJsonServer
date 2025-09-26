import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const EvaluationRecommendationSection = ({ recommendation, recommendationOptions, onRecommendationChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {t('ratings.evaluation.recommendation.title')}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {recommendationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onRecommendationChange(option.value)}
            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
              recommendation === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className={option.color}>{t(option.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

EvaluationRecommendationSection.propTypes = {
  recommendation: PropTypes.string.isRequired,
  recommendationOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  onRecommendationChange: PropTypes.func.isRequired
};

export default EvaluationRecommendationSection;