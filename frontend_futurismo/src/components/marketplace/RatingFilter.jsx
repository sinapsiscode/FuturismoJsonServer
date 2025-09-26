import PropTypes from 'prop-types';
import { StarIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { RATING_OPTIONS } from '../../constants/marketplaceConstants';

const RatingFilter = ({ selectedRating, onRatingChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {RATING_OPTIONS.map(rating => (
        <button
          key={rating}
          onClick={() => onRatingChange(rating)}
          className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
            selectedRating === rating
              ? 'bg-cyan-50 border border-cyan-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating === 5 
              ? t('marketplace.filters.rating.only5stars') 
              : t('marketplace.filters.rating.plusStars', { rating })}
          </span>
        </button>
      ))}
    </div>
  );
};

RatingFilter.propTypes = {
  selectedRating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired
};

export default RatingFilter;