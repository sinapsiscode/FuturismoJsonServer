import React from 'react';
import PropTypes from 'prop-types';

const TopItemsList = ({ 
  title, 
  items, 
  icon: Icon, 
  iconColor = 'blue',
  itemKey = 'name',
  countKey = 'count',
  subtitle = 'items',
  showMedals = true 
}) => {
  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-orange-500';
      default: return iconColor === 'green' ? 'bg-green-500' : 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Icon className={`w-5 h-5 text-${iconColor}-600 mr-2`} aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3" role="list">
        {items.map((item, index) => (
          <div 
            key={item[itemKey]} 
            className="flex items-center justify-between"
            role="listitem"
          >
            <div className="flex items-center">
              {showMedals && (
                <span 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${getMedalColor(index)}`}
                  aria-label={`Posición ${index + 1}`}
                >
                  {index + 1}
                </span>
              )}
              <span className="text-sm font-medium text-gray-800">
                {item[itemKey]}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{item[countKey]}</div>
              <div className="text-xs text-gray-500">{subtitle}</div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay datos disponibles
          </p>
        )}
      </div>
    </div>
  );
};

TopItemsList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
  itemKey: PropTypes.string,
  countKey: PropTypes.string,
  subtitle: PropTypes.string,
  showMedals: PropTypes.bool
};

export default TopItemsList;