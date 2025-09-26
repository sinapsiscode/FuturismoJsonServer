import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FunnelIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SERVICE_AREAS, STATUS_TYPES } from '../../constants/feedbackConstants';

const FeedbackFilters = ({
  selectedFilter,
  setSelectedFilter,
  selectedArea,
  setSelectedArea,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  onExport
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{t('feedback.filters.title')}:</span>
        </div>
        
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="all">{t('feedback.filters.all')}</option>
          <option value="service">{t('feedback.filters.services')}</option>
          <option value="staff">{t('feedback.filters.staff')}</option>
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="all">{t('feedback.filters.allAreas')}</option>
          {SERVICE_AREAS.map(area => (
            <option key={area.key} value={area.key}>
              {t(area.label)}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="all">{t('feedback.filters.allStatuses')}</option>
          {STATUS_TYPES.map(status => (
            <option key={status.value} value={status.value}>
              {t(status.label)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={onExport}
            className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {t('common.export')}
          </button>
        </div>
      </div>
    </div>
  );
};

FeedbackFilters.propTypes = {
  selectedFilter: PropTypes.string.isRequired,
  setSelectedFilter: PropTypes.func.isRequired,
  selectedArea: PropTypes.string.isRequired,
  setSelectedArea: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
};

export default FeedbackFilters;