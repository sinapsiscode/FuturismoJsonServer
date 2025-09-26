import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import TourTypeIcon from './TourTypeIcon';

const GuideCardContent = ({ guide }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={guide.profile.avatar}
          alt={guide.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {guide.fullName}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">{guide.ratings.overall.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">({guide.ratings.totalReviews})</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {guide.profile.bio}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {guide.specializations.tourTypes.map(type => (
          <span
            key={type}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
          >
            <TourTypeIcon type={type} className="h-3 w-3" />
            <span className="capitalize">{t(`marketplace.tourTypes.${type}`)}</span>
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-lg font-bold text-gray-900">
            S/. {guide.pricing.hourlyRate}
            <span className="text-sm font-normal text-gray-500">/{t('marketplace.card.perHour')}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {guide.preferences.instantBooking && (
            <BoltIcon className="h-4 w-4 text-green-500" title={t('marketplace.card.instantBooking')} />
          )}
          {guide.marketplaceStats.responseTime <= 30 && (
            <ClockIcon className="h-4 w-4 text-blue-500" title={t('marketplace.card.quickResponse')} />
          )}
        </div>
      </div>
    </div>
  );
};

GuideCardContent.propTypes = {
  guide: PropTypes.object.isRequired
};

export default GuideCardContent;