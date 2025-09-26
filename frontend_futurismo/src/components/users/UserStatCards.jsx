import React from 'react';
import { UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { STAT_ICONS } from '../../constants/usersConstants';

const UserStatCards = ({ roleStats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('users.stats.totalUsers'),
      value: roleStats.total || 0,
      icon: UserIcon,
      iconColor: 'text-blue-600'
    },
    {
      title: t('users.stats.administrators'),
      value: roleStats.administradores || 0,
      letter: STAT_ICONS.ADMIN.letter,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      title: t('users.stats.agencies'),
      value: roleStats.agencias || 0,
      letter: STAT_ICONS.AGENCY.letter,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: t('users.stats.totalGuides'),
      value: roleStats.guias || 0,
      letter: STAT_ICONS.GUIDE.letter,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            {stat.icon ? (
              <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor} flex-shrink-0`} />
            ) : (
              <div className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className={`${stat.textColor} font-bold text-xs sm:text-sm`}>{stat.letter}</span>
              </div>
            )}
            <div className="ml-2 sm:ml-3 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.title}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Plant/Freelance card */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
          <div className="ml-2 sm:ml-3 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{t('users.stats.plantFreelance')}</p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {roleStats.guiasPlanta || 0} / {roleStats.guiasFreelance || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatCards;