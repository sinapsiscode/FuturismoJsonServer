import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import useFeedbackDashboard from '../../hooks/useFeedbackDashboard';
import StatCard from './StatCard';
import FeedbackCard from './FeedbackCard';
import FeedbackFilters from './FeedbackFilters';
import FeedbackAnalytics from './FeedbackAnalytics';

const FeedbackDashboard = () => {
  const { t } = useTranslation();
  const {
    selectedFilter,
    setSelectedFilter,
    selectedArea,
    setSelectedArea,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    stats,
    serviceFeedback,
    staffFeedback,
    handleExport,
    serviceFeedbackByArea,
    statusDistribution
  } = useFeedbackDashboard();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('feedback.dashboard.title')}
          </h1>
          <p className="text-gray-600">
            {t('feedback.dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={t('feedback.stats.totalFeedback')}
            value={stats.totalFeedback}
            subtitle={t('feedback.stats.thisMonth')}
            icon={ChatBubbleLeftRightIcon}
            trend="+23%"
            color="blue"
          />
          <StatCard
            title={t('feedback.stats.serviceFeedback')}
            value={stats.serviceFeedback}
            subtitle={t('feedback.stats.areasEvaluated')}
            icon={ChartBarIcon}
            trend="+18%"
            color="green"
          />
          <StatCard
            title={t('feedback.stats.staffFeedback')}
            value={stats.staffFeedback}
            subtitle={t('feedback.stats.staffEvaluations')}
            icon={UsersIcon}
            trend="+12%"
            color="purple"
          />
        </div>

        {/* Filters */}
        <FeedbackFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={handleExport}
        />

        {/* Feedback Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t('feedback.sections.serviceFeedback')}
              </h3>
              <span className="text-sm text-gray-500">
                {serviceFeedback.length} {t('feedback.sections.opinions')}
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {serviceFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} type="service" />
              ))}
            </div>
          </div>

          {/* Staff Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t('feedback.sections.staffFeedback')}
              </h3>
              <span className="text-sm text-gray-500">
                {staffFeedback.length} {t('feedback.sections.evaluations')}
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {staffFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} type="staff" />
              ))}
            </div>
          </div>
        </div>

        {/* Analytics */}
        <FeedbackAnalytics 
          serviceFeedback={serviceFeedbackByArea}
          statusData={statusDistribution}
        />
      </div>
    </div>
  );
};

export default FeedbackDashboard;