import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon as Star } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const RatingDistributionChart = ({ distribution, totalRatings }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('ratings.dashboard.distributionTitle')}
      </h3>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{rating}</span>
              <Star size={14} className="text-yellow-400" fill="currentColor" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${distribution[rating]?.percentage || 0}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-12">
              {distribution[rating]?.count || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

RatingDistributionChart.propTypes = {
  distribution: PropTypes.object.isRequired,
  totalRatings: PropTypes.number.isRequired
};

export default RatingDistributionChart;