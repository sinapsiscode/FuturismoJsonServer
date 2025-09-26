import React from 'react';
import PropTypes from 'prop-types';

const MobileOverlay = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="
        fixed inset-0 
        bg-black bg-opacity-50 
        z-40 
        lg:hidden
        transition-opacity duration-300 ease-in-out
        backdrop-blur-sm
        touch-manipulation
      "
      onClick={onClick}
      onTouchEnd={onClick}
      aria-hidden="true"
      role="button"
      tabIndex={-1}
    />
  );
};

MobileOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MobileOverlay;