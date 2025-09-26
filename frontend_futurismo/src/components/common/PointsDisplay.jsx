import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, GiftIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';
import useAgencyStore from '../../stores/agencyStore';

const PointsDisplay = () => {
  const { user } = useAuthStore();
  const { currentAgency, actions } = useAgencyStore();
  
  // Cargar puntos si es agencia
  useEffect(() => {
    if (user?.role === 'agency') {
      actions.fetchPointsBalance();
    }
  }, [user, actions]);

  // Solo mostrar para agencia
  if (!user || user.role !== 'agency') {
    return null;
  }

  // Mobile-first responsive agency view
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
      {/* Points balance - mobile-first responsive */}
      <Link
        to="/agency/points"
        className="
          flex items-center justify-center sm:justify-start
          gap-2 sm:gap-2
          px-3 sm:px-3 py-2 sm:py-2
          bg-gray-100 hover:bg-gray-200 
          rounded-lg 
          transition-all duration-200
          min-w-0
          flex-1 sm:flex-initial
        "
      >
        <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {currentAgency?.pointsBalance?.toLocaleString() || '0'}
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            puntos
          </span>
        </div>
      </Link>

      {/* Rewards store - mobile-first responsive */}
      <Link
        to="/agency/rewards"
        className="
          flex items-center justify-center
          p-2 sm:p-2
          bg-gradient-to-r from-purple-500 to-pink-500 
          text-white rounded-lg 
          hover:from-purple-600 hover:to-pink-600 
          transition-all duration-200
          shadow-sm hover:shadow-md
          flex-shrink-0
        "
        title="Tienda de Premios"
      >
        <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="ml-2 text-xs sm:hidden">Premios</span>
      </Link>
    </div>
  );
};

export default PointsDisplay;