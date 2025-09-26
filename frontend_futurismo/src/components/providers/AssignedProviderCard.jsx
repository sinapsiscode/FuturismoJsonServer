import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  ClockIcon, 
  TrashIcon, 
  MapPinIcon, 
  TagIcon 
} from '@heroicons/react/24/outline';

const AssignedProviderCard = ({ 
  provider, 
  index, 
  onRemove, 
  onTimeChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h5 className="font-semibold">{provider.providerName}</h5>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <TagIcon className="w-4 h-4" />
              {t(`providers.categories.${provider.providerCategory}`)}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {t(provider.providerLocation)}
            </span>
          </div>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <ClockIcon className="w-4 h-4 inline mr-1" />
            {t('providers.assignment.startTime')}
          </label>
          <input
            type="time"
            value={provider.startTime}
            onChange={(e) => onTimeChange(index, 'startTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <ClockIcon className="w-4 h-4 inline mr-1" />
            {t('providers.assignment.endTime')}
          </label>
          <input
            type="time"
            value={provider.endTime}
            onChange={(e) => onTimeChange(index, 'endTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.assignment.service')}
          </label>
          <input
            type="text"
            value={provider.service}
            onChange={(e) => onTimeChange(index, 'service', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={t('providers.assignment.servicePlaceholder')}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('providers.assignment.providerNotes')}
        </label>
        <textarea
          value={provider.notes}
          onChange={(e) => onTimeChange(index, 'notes', e.target.value)}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={t('providers.assignment.providerNotesPlaceholder')}
        />
      </div>
    </div>
  );
};

AssignedProviderCard.propTypes = {
  provider: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired
};

export default AssignedProviderCard;