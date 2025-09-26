import { useState } from 'react';
import { 
  getMockDashboardStats, 
  getMockAreaStats, 
  getMockStaffStats, 
  getMockServiceAreas, 
  getMockPeriods 
} from '../data/mockRatingsData';
import { RATING_PERIODS } from '../constants/ratingsConstants';

export const useRatingDashboard = (ratingsData = [], staffEvaluations = []) => {
  const [selectedPeriod, setSelectedPeriod] = useState(RATING_PERIODS.MONTH);
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');

  const serviceAreas = getMockServiceAreas();
  const periods = getMockPeriods();
  const mockStats = getMockDashboardStats();
  const mockAreaStats = getMockAreaStats();
  const mockStaffStats = getMockStaffStats();

  const getRatingDistribution = () => {
    const distribution = {};
    const total = mockStats.totalRatings;
    
    // Mock distribution calculation
    [5, 4, 3, 2, 1].forEach(rating => {
      distribution[rating] = {
        count: Math.round(total * (rating / 15)),
        percentage: rating * 20
      };
    });
    
    return distribution;
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data for period:', selectedPeriod);
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedArea,
    setSelectedArea,
    selectedStaff,
    setSelectedStaff,
    serviceAreas,
    periods,
    mockStats,
    mockAreaStats,
    mockStaffStats,
    ratingDistribution: getRatingDistribution(),
    handleExport
  };
};