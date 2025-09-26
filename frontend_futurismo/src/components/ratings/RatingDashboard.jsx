import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon as Star, 
  ArrowTrendingUpIcon as TrendingUp, 
  UsersIcon as Users, 
  ChartBarIcon as BarChart3
} from '@heroicons/react/24/outline';
import { useRatingDashboard } from '../../hooks/useRatingDashboard';
import RatingStatCard from './RatingStatCard';
import RatingFilters from './RatingFilters';
import ServiceAreaStats from './ServiceAreaStats';
import StaffPerformanceList from './StaffPerformanceList';
import RatingDistributionChart from './RatingDistributionChart';

const RatingDashboard = ({ ratingsData = [], staffEvaluations = [] }) => {
  const { t } = useTranslation();
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedArea,
    setSelectedArea,
    serviceAreas,
    periods,
    mockStats,
    mockAreaStats,
    mockStaffStats,
    ratingDistribution,
    handleExport
  } = useRatingDashboard(ratingsData, staffEvaluations);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('ratings.dashboard.title')}
          </h1>
          <p className="text-gray-600">
            {t('ratings.dashboard.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <RatingFilters
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            periods={periods}
            serviceAreas={serviceAreas}
            onExport={handleExport}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <RatingStatCard
            title={t('ratings.dashboard.stats.totalRatings')}
            value={mockStats.totalRatings}
            subtitle={t('ratings.dashboard.stats.inSelectedPeriod')}
            icon={BarChart3}
            trend={mockStats.improvementTrend}
          />
          <RatingStatCard
            title={t('ratings.dashboard.stats.averageRating')}
            value={mockStats.averageRating}
            subtitle={t('ratings.dashboard.stats.outOfFive')}
            icon={Star}
            trend="+0.3"
          />
          <RatingStatCard
            title={t('ratings.dashboard.stats.staffEvaluated')}
            value={mockStats.staffEvaluated}
            subtitle={t('ratings.dashboard.stats.activeEmployees')}
            icon={Users}
            trend="+15%"
          />
          <RatingStatCard
            title={t('ratings.dashboard.stats.generalTrend')}
            value={t('ratings.dashboard.stats.positive')}
            subtitle={t('ratings.dashboard.stats.continuousImprovement')}
            icon={TrendingUp}
            trend={mockStats.improvementTrend}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ServiceAreaStats
            serviceAreas={serviceAreas}
            areaStats={mockAreaStats}
          />
          <StaffPerformanceList staffStats={mockStaffStats} />
        </div>

        <RatingDistributionChart
          distribution={ratingDistribution}
          totalRatings={mockStats.totalRatings}
        />
      </div>
    </div>
  );
};

RatingDashboard.propTypes = {
  ratingsData: PropTypes.array,
  staffEvaluations: PropTypes.array
};

export default RatingDashboard;