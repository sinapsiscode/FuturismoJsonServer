import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon, 
  MapPinIcon, 
  LanguageIcon, 
  CheckBadgeIcon,
  BoltIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import TourTypeIcon from './TourTypeIcon';

const GuideListItem = ({ 
  guide, 
  isFavorite, 
  onFavoriteToggle, 
  displayLanguages, 
  workZoneNames,
  yearsExperience 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0">
        <img
          src={guide.profile.avatar}
          alt={guide.fullName}
          className="w-20 h-20 rounded-full object-cover"
        />
        {guide.marketplaceStatus.verified && (
          <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-6 w-6 text-cyan-500 bg-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {guide.fullName}
              {guide.marketplaceStatus.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full">
                  {t('marketplace.card.featured')}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="font-medium">{guide.ratings.overall.toFixed(1)}</span>
                <span>({guide.ratings.totalReviews} {t('marketplace.card.reviews')})</span>
              </div>
              <span>•</span>
              <span>{yearsExperience} {t('marketplace.card.yearsExp')}</span>
              <span>•</span>
              <span>{guide.marketplaceStats.totalBookings} {t('marketplace.card.tours')}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">S/. {guide.pricing.hourlyRate}</p>
              <p className="text-sm text-gray-500">{t('marketplace.card.perHour')}</p>
            </div>
            <button
              onClick={onFavoriteToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isFavorite ? (
                <HeartIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {guide.profile.bio}
        </p>

        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1">
            <LanguageIcon className="h-4 w-4 text-gray-400" />
            <div className="flex gap-1">
              {displayLanguages.map((lang, index) => (
                <span key={index} className="text-sm font-medium text-gray-700">
                  {lang}
                </span>
              ))}
            </div>
            {guide.specializations.languages.length > 3 && (
              <span className="text-xs text-gray-500">
                +{guide.specializations.languages.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span>
              {workZoneNames.join(', ')}
              {guide.specializations.workZones.length > 2 && ' ...'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {guide.specializations.tourTypes.slice(0, 3).map(type => (
              <TourTypeIcon key={type} type={type} className="h-4 w-4 text-gray-600" />
            ))}
          </div>

          {guide.preferences.instantBooking && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <BoltIcon className="h-3 w-3" />
              {t('marketplace.card.instantBooking')}
            </span>
          )}
          
          {guide.marketplaceStats.responseTime <= 30 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ClockIcon className="h-3 w-3" />
              {t('marketplace.card.quickResponse')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

GuideListItem.propTypes = {
  guide: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  displayLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  workZoneNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  yearsExperience: PropTypes.number.isRequired
};

export default GuideListItem;