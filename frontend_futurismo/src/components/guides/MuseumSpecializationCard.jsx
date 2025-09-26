import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const MuseumSpecializationCard = ({ museums, getMuseumInfo, getLevelInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-500" />
        {t('guides.profile.museumKnowledge')} ({museums.length})
      </h3>
      
      {museums.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('guides.profile.noMuseums')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {museums.map((museum, index) => {
            const museumInfo = getMuseumInfo(museum.name);
            const levelInfo = getLevelInfo(museum.expertise);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                        {museumInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600">{t('guides.profile.museum')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t('guides.profile.expertiseLevel')}:
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${levelInfo.color}`}>
                    {levelInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

MuseumSpecializationCard.propTypes = {
  museums: PropTypes.array.isRequired,
  getMuseumInfo: PropTypes.func.isRequired,
  getLevelInfo: PropTypes.func.isRequired
};

export default MuseumSpecializationCard;