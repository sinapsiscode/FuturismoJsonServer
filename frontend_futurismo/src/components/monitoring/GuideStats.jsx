import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/24/solid';

const GuideStats = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">{stats.toursToday}</p>
        <p className="text-sm text-gray-600">{t('monitoring.guide.toursToday')}</p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">{stats.toursTotals}</p>
        <p className="text-sm text-gray-600">{t('monitoring.guide.totalTours')}</p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-1">
          <StarIcon className="h-6 w-6 text-yellow-400" />
          <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
        </div>
        <p className="text-sm text-gray-600">{t('monitoring.guide.rating')}</p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">{stats.punctuality}%</p>
        <p className="text-sm text-gray-600">{t('monitoring.guide.punctuality')}</p>
      </div>
    </div>
  );
};

GuideStats.propTypes = {
  stats: PropTypes.object.isRequired
};

export default GuideStats;