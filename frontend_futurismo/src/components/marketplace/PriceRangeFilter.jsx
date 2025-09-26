import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PRICE_RANGE_CONFIG } from '../../constants/marketplaceConstants';

const PriceRangeFilter = ({ priceRange, onPriceChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">
          {t('marketplace.filters.price.min')}: S/. {priceRange.min}
        </label>
        <input
          type="range"
          min={PRICE_RANGE_CONFIG.min.min}
          max={PRICE_RANGE_CONFIG.min.max}
          step={PRICE_RANGE_CONFIG.min.step}
          value={priceRange.min}
          onChange={(e) => onPriceChange('min', e.target.value)}
          className="w-full mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">
          {t('marketplace.filters.price.max')}: S/. {priceRange.max}
        </label>
        <input
          type="range"
          min={PRICE_RANGE_CONFIG.max.min}
          max={PRICE_RANGE_CONFIG.max.max}
          step={PRICE_RANGE_CONFIG.max.step}
          value={priceRange.max}
          onChange={(e) => onPriceChange('max', e.target.value)}
          className="w-full mt-1"
        />
      </div>
    </div>
  );
};

PriceRangeFilter.propTypes = {
  priceRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  onPriceChange: PropTypes.func.isRequired
};

export default PriceRangeFilter;