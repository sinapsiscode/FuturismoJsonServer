import React from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const RewardsFloatingButton = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== 'agency' && user.role !== 'admin')) {
    return null;
  }

  const getRewardsUrl = () => {
    return user.role === 'admin' ? '/admin/rewards' : '/agency/rewards';
  };

  const getLabel = () => {
    return user.role === 'admin' ? 'Sistema de Premios' : 'Tienda de Premios';
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <a
        href={getRewardsUrl()}
        className="
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:from-purple-600 hover:to-pink-600 
          active:from-purple-700 active:to-pink-700
          text-white 
          rounded-full 
          p-3 sm:p-4 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 
          flex items-center 
          group
          touch-manipulation
          transform hover:scale-105 active:scale-95
        "
        title={getLabel()}
      >
        <GiftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="ml-2 hidden sm:group-hover:inline-block whitespace-nowrap text-sm sm:text-base font-medium">
          {getLabel()}
        </span>
      </a>
    </div>
  );
};

export default RewardsFloatingButton;