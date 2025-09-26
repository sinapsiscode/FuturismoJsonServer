import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "blue", 
  trend,
  ariaLabel 
}) => {
  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 'text-red-600';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}
      role="region"
      aria-label={ariaLabel || title}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900" aria-live="polite">
            {value}
          </p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon 
            className={`w-6 h-6 text-${color}-600 mb-2`} 
            aria-hidden="true" 
          />
          {trend && (
            <span 
              className={`text-xs font-medium ${trendColor}`}
              aria-label={`Tendencia: ${trend}`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
  trend: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default StatCard;