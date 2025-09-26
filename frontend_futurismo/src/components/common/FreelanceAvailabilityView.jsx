import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/outline';
import { useFreelanceAvailability } from '../../hooks/useGuideAvailability';
import DateNavigation from './DateNavigation';

const FreelanceAvailabilityView = () => {
  const { t } = useTranslation();
  const {
    selectedDate,
    setSelectedDate,
    freelanceGuides,
    changeDate,
    getGuideAvailabilityInfo
  } = useFreelanceAvailability();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
          {t('guides.availability.freelanceTitle')}
        </h3>

        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onNavigate={changeDate}
        />

        <div className="space-y-4">
          {freelanceGuides.map((guide) => {
            const {
              specialties,
              availableSlots,
              isAvailable,
              busySlots
            } = getGuideAvailabilityInfo(guide);
            
            const initials = guide.fullName?.split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2) || 'GU';
            
            return (
              <div
                key={guide.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{guide.fullName}</h4>
                    <p className="text-sm text-gray-600">
                      {specialties.length > 0 
                        ? specialties.join(', ') 
                        : t('guides.defaultSpecialty')
                      }
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        ⭐ {guide.stats?.rating || t('common.notAvailable')} 
                        ({guide.stats?.toursCompleted || 0} {t('guides.tours')})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isAvailable ? (
                    <div>
                      <div className="flex items-center text-green-600 mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">
                          {t('guides.availability.available')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {t('guides.availability.freeSlots', { count: availableSlots.length })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-red-600 mb-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">
                          {t('guides.availability.busy')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {busySlots[0]?.tour || t('guides.availability.notAvailable')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FreelanceAvailabilityView;