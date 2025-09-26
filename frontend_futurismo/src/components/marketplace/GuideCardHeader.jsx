import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  CheckBadgeIcon,
  HeartIcon,
  CameraIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

const GuideCardHeader = ({ guide, isFavorite, onFavoriteToggle, displayLanguages }) => {
  const { t } = useTranslation();

  return (
    <div className="relative h-48 overflow-hidden">
      {guide.profile.photos && guide.profile.photos.length > 0 ? (
        <img
          src={guide.profile.photos[0]}
          alt={guide.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <UserGroupIcon className="h-16 w-16 text-white/50" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            {displayLanguages.map((lang, index) => (
              <span key={index} className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-white">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 flex gap-2">
        {guide.marketplaceStatus.verified && (
          <span className="bg-white/90 backdrop-blur-sm text-cyan-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckBadgeIcon className="h-3 w-3" />
            {t('marketplace.card.verified')}
          </span>
        )}
        {guide.marketplaceStatus.featured && (
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full">
            {t('marketplace.card.featured')}
          </span>
        )}
      </div>

      <button
        onClick={onFavoriteToggle}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
      >
        {isFavorite ? (
          <HeartIcon className="h-4 w-4 text-red-500" />
        ) : (
          <HeartOutlineIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {guide.profile.photos && guide.profile.photos.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <CameraIcon className="h-3 w-3" />
          {guide.profile.photos.length}
        </div>
      )}
    </div>
  );
};

GuideCardHeader.propTypes = {
  guide: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
  displayLanguages: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default GuideCardHeader;