import React from 'react';
import PropTypes from 'prop-types';
import { ChartPieIcon as PieChart } from '@heroicons/react/24/outline';

const TourTypeDistribution = ({ distribution, title }) => {
  const getColorByIndex = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <PieChart className="w-5 h-5 text-purple-600 mr-2" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3" role="list">
        {distribution.map((item, index) => (
          <div 
            key={item.type} 
            className="flex items-center justify-between"
            role="listitem"
          >
            <div className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full mr-3 ${getColorByIndex(index)}`}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-800">
                {item.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
        {distribution.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay datos de distribución disponibles
          </p>
        )}
      </div>
    </div>
  );
};

TourTypeDistribution.propTypes = {
  distribution: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    percentage: PropTypes.string.isRequired
  })).isRequired,
  title: PropTypes.string.isRequired
};

export default TourTypeDistribution;