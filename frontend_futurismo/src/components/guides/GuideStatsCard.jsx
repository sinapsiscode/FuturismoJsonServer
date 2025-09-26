import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  TrophyIcon, 
  UserGroupIcon, 
  ClockIcon, 
  StarIcon 
} from '@heroicons/react/24/outline';

const GuideStatsCard = ({ stats }) => {
  const { t } = useTranslation();

  const statItems = [
    {
      icon: UserGroupIcon,
      value: stats.toursCompleted,
      label: t('guides.stats.toursCompleted'),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: ClockIcon,
      value: stats.yearsExperience,
      label: t('guides.stats.yearsExperience'),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: TrophyIcon,
      value: stats.certifications,
      label: t('guides.stats.certifications'),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: StarIcon,
      value: stats.rating,
      label: t('guides.stats.rating'),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
        {t('guides.profile.statistics')}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`text-center p-4 ${stat.bgColor} rounded-lg`}>
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <p className={`text-2xl font-bold ${stat.iconColor}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${stat.iconColor.replace('text-', 'text-').replace('600', '700')}`}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

GuideStatsCard.propTypes = {
  stats: PropTypes.shape({
    toursCompleted: PropTypes.number.isRequired,
    yearsExperience: PropTypes.number.isRequired,
    certifications: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired
  }).isRequired
};

export default GuideStatsCard;