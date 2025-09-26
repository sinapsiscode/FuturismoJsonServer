import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon as Star } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const ServiceAreaStats = ({ serviceAreas, areaStats }) => {
  const { t } = useTranslation();

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
            fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('ratings.dashboard.serviceAreasTitle')}
      </h3>
      <div className="space-y-4">
        {serviceAreas.map(area => (
          <div key={area.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{t(area.label)}</p>
              <p className="text-sm text-gray-600">
                {areaStats[area.key].count} {t('ratings.dashboard.ratings')}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {areaStats[area.key].average}
                </span>
                {renderStars(areaStats[area.key].average)}
              </div>
              <span className={`text-xs font-medium ${
                areaStats[area.key].trend.startsWith('+') 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {areaStats[area.key].trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ServiceAreaStats.propTypes = {
  serviceAreas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  areaStats: PropTypes.object.isRequired
};

export default ServiceAreaStats;