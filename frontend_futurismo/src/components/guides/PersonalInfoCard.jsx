import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const PersonalInfoCard = ({ guide, isActive }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return t('guides.profile.notAvailable');
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
          {t('guides.profile.personalInfo')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-medium text-xs">DNI</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {guide?.dni || t('guides.profile.noDNI')}
              </p>
              <p className="text-sm text-gray-600">
                {t('guides.profile.identityDocument')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <PhoneIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {guide?.phone || t('guides.profile.noPhone')}
              </p>
              <p className="text-sm text-gray-600">
                {t('guides.profile.phone')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {guide?.email || t('guides.profile.noEmail')}
              </p>
              <p className="text-sm text-gray-600">
                {t('guides.profile.email')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
              <MapPinIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {guide?.address || t('guides.profile.noAddress')}
              </p>
              <p className="text-sm text-gray-600">
                {t('guides.profile.address')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-indigo-500" />
          {t('guides.profile.additionalInfo')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('guides.profile.status')}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isActive ? t('guides.status.active') : t('guides.status.inactive')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t('guides.profile.registrationDate')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(guide?.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t('guides.profile.lastUpdate')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(guide?.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

PersonalInfoCard.propTypes = {
  guide: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired
};

export default PersonalInfoCard;