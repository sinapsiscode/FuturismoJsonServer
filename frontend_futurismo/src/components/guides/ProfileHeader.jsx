import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PencilIcon, StarIcon } from '@heroicons/react/24/outline';

const ProfileHeader = ({ 
  guide, 
  initials, 
  guideTypeLabel, 
  guideTypeColor, 
  rating, 
  onEdit, 
  onClose 
}) => {
  const { t } = useTranslation();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {guide?.fullName || t('guides.profile.noName')}
          </h1>
          <div className="flex items-center space-x-3 mt-1">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${guideTypeColor}`}>
              {guideTypeLabel}
            </span>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="text-sm text-gray-600 ml-1">
                ({rating}/5)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onEdit(guide)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <PencilIcon className="w-4 h-4" />
          <span>{t('common.edit')}</span>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {t('common.back')}
        </button>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  guide: PropTypes.object.isRequired,
  initials: PropTypes.string.isRequired,
  guideTypeLabel: PropTypes.string.isRequired,
  guideTypeColor: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProfileHeader;