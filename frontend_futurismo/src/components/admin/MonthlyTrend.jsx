import React from 'react';
import PropTypes from 'prop-types';
import { ArrowTrendingUpIcon as TrendingUp } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const MonthlyTrend = ({ data, title, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {data.map((month) => (
          <div 
            key={month.month} 
            className="text-center p-4 bg-gray-50 rounded-lg"
            role="region"
            aria-label={`Datos de ${month.month}`}
          >
            <div className="text-sm text-gray-600 mb-1">{month.month}</div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {month.clients}
            </div>
            <div className="text-xs text-gray-500">clientes</div>
            <div className="text-sm font-medium text-green-600 mt-1">
              {formatCurrency(month.revenue)}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No hay datos de tendencia disponibles
          </div>
        )}
      </div>
    </div>
  );
};

MonthlyTrend.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    month: PropTypes.string.isRequired,
    clients: PropTypes.number.isRequired,
    revenue: PropTypes.number.isRequired
  })).isRequired,
  title: PropTypes.string.isRequired,
  formatCurrency: PropTypes.func.isRequired
};

export default MonthlyTrend;