import React from 'react';
import PropTypes from 'prop-types';

const ResponsiveTable = ({ 
  children, 
  className = '', 
  variant = 'default',
  showBorder = true,
  showShadow = true 
}) => {
  // Mobile-first responsive variants
  const variantClasses = {
    default: 'bg-white',
    minimal: 'bg-transparent',
    card: 'bg-white rounded-lg'
  };

  const borderClasses = showBorder ? 'border border-gray-200' : '';
  const shadowClasses = showShadow ? 'shadow-sm sm:shadow-md' : '';

  return (
    <div className={`
      w-full 
      ${variantClasses[variant]}
      ${borderClasses}
      ${shadowClasses}
      ${className}
    `}>
      {/* Mobile-first responsive container with enhanced scrolling */}
      <div className="
        w-full overflow-x-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        sm:overflow-visible
      ">
        <div className="
          inline-block min-w-full align-middle
          sm:min-w-0
        ">
          <div className="
            min-w-full
            divide-y divide-gray-200
          ">
            {children}
          </div>
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="sm:hidden flex justify-center items-center py-2 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4 4 4m0-8l-4-4-4 4" />
          </svg>
          Desliza para ver más
        </span>
      </div>
    </div>
  );
};

ResponsiveTable.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'card']),
  showBorder: PropTypes.bool,
  showShadow: PropTypes.bool
};

export default ResponsiveTable;