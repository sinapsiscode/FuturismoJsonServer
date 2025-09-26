import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSpecializationCard = ({ languages, getLanguageInfo, getLevelInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-500" />
        {t('guides.profile.languageSpecialization')} ({languages.length})
      </h3>
      
      {languages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('guides.profile.noLanguages')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang, index) => {
            const languageInfo = getLanguageInfo(lang.code);
            const levelInfo = getLevelInfo(lang.level);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{languageInfo.name}</h4>
                      <p className="text-sm text-gray-600">{t('guides.profile.language')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t('guides.profile.proficiencyLevel')}:
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

LanguageSpecializationCard.propTypes = {
  languages: PropTypes.array.isRequired,
  getLanguageInfo: PropTypes.func.isRequired,
  getLevelInfo: PropTypes.func.isRequired
};

export default LanguageSpecializationCard;