import React from 'react';
import PropTypes from 'prop-types';
import { 
  FunnelIcon as Filter, 
  ArrowDownTrayIcon as Download 
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const RatingFilters = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  selectedArea, 
  setSelectedArea, 
  periods, 
  serviceAreas,
  onExport 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {t('common.filters')}:
          </span>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value}>
              {t(period.label)}
            </option>
          ))}
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="all">{t('common.allAreas')}</option>
          {serviceAreas.map(area => (
            <option key={area.key} value={area.key}>
              {t(area.label)}
            </option>
          ))}
        </select>

        <button 
          onClick={onExport}
          className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Download size={14} />
          {t('common.export')}
        </button>
      </div>
    </div>
  );
};

RatingFilters.propTypes = {
  selectedPeriod: PropTypes.string.isRequired,
  setSelectedPeriod: PropTypes.func.isRequired,
  selectedArea: PropTypes.string.isRequired,
  setSelectedArea: PropTypes.func.isRequired,
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  serviceAreas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onExport: PropTypes.func.isRequired
};

export default RatingFilters;