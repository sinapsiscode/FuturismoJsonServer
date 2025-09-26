import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon as Star } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const StaffPerformanceList = ({ staffStats }) => {
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
        {t('ratings.dashboard.staffPerformanceTitle')}
      </h3>
      <div className="space-y-4">
        {staffStats.map(staff => (
          <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{t(staff.name)}</p>
              <p className="text-sm text-gray-600">{t(staff.role)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {staff.rating}
                </span>
                {renderStars(staff.rating)}
              </div>
              <p className="text-xs text-gray-600">
                {staff.evaluations} {t('ratings.dashboard.evaluations')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StaffPerformanceList.propTypes = {
  staffStats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      evaluations: PropTypes.number.isRequired
    })
  ).isRequired
};

export default StaffPerformanceList;