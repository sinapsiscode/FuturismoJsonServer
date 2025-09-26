import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  GlobeAltIcon, 
  AcademicCapIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const CompetenciesSummary = ({ languages, museums, stats }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
      <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
        <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-500" />
        {t('guides.profile.competenciesSummary')}
      </h3>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full">
            <GlobeAltIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            {t('guides.profile.multilingual')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.mastersLanguages', { count: languages.length })}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full">
            <AcademicCapIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            {t('guides.profile.specialist')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.knowsMuseums', { count: museums.length })}
          </p>
          <div className="mt-2">
            <span className="px-2 py-1 text-xs text-purple-600 bg-purple-100 rounded-full">
              {t('guides.profile.specializations', { count: museums.length })}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            {t('guides.profile.experienced')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.yearsOfExperience', { years: stats.yearsExperience })}
          </p>
          <div className="mt-2">
            <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
              {t('guides.profile.completedTours', { count: stats.toursCompleted })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

CompetenciesSummary.propTypes = {
  languages: PropTypes.array.isRequired,
  museums: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    yearsExperience: PropTypes.number.isRequired,
    toursCompleted: PropTypes.number.isRequired
  }).isRequired
};

export default CompetenciesSummary;