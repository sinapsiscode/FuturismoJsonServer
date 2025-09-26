import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  UsersIcon as Users,
  CalendarIcon as Calendar,
  CurrencyDollarIcon as DollarSign,
  ArrowTrendingUpIcon as TrendingUp,
  MapPinIcon as MapPin,
  StarIcon as Star,
  ChartBarIcon as BarChart3
} from '@heroicons/react/24/outline';

// Componentes
import StatCard from './StatCard';
import TopItemsList from './TopItemsList';
import TourTypeDistribution from './TourTypeDistribution';
import MonthlyTrend from './MonthlyTrend';

// Hooks
import useReservationStats from '../../hooks/useReservationStats';

// Utils
import { formatters } from '../../utils/formatters';

const ReservationStats = ({ 
  reservations = [], 
  isLoading = false,
  error = null 
}) => {
  const { t } = useTranslation();
  const stats = useReservationStats(reservations);

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return formatters.formatCurrency(amount, 'COP');
  };

  // Mostrar loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{t('errors.loadingStats')}: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('stats.totalClients')}
          value={stats.totalClients.toLocaleString()}
          subtitle={t('stats.completedReservations')}
          icon={Users}
          color="blue"
          trend="+12%"
          ariaLabel={t('stats.totalClientsAria')}
        />
        <StatCard
          title={t('stats.totalTourists')}
          value={stats.totalTourists.toLocaleString()}
          subtitle={t('stats.peopleServed')}
          icon={TrendingUp}
          color="green"
          trend="+18%"
          ariaLabel={t('stats.totalTouristsAria')}
        />
        <StatCard
          title={t('stats.totalRevenue')}
          value={formatCurrency(stats.totalRevenue)}
          subtitle={t('stats.accumulatedSales')}
          icon={DollarSign}
          color="purple"
          trend="+23%"
          ariaLabel={t('stats.totalRevenueAria')}
        />
        <StatCard
          title={t('stats.avgGroupSize')}
          value={stats.avgGroupSize}
          subtitle={t('stats.peoplePerReservation')}
          icon={BarChart3}
          color="orange"
          trend="+5%"
          ariaLabel={t('stats.avgGroupSizeAria')}
        />
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title={t('stats.avgPerClient')}
          value={formatCurrency(stats.avgRevenuePerClient)}
          subtitle={t('stats.avgReservationValue')}
          icon={Star}
          color="yellow"
          trend="+8%"
          ariaLabel={t('stats.avgPerClientAria')}
        />
        <StatCard
          title={t('stats.activeDestinations')}
          value={stats.topDestinations.length}
          subtitle={t('stats.availableLocations')}
          icon={MapPin}
          color="indigo"
          ariaLabel={t('stats.activeDestinationsAria')}
        />
      </div>

      {/* Sección de listas y distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Destinos */}
        <TopItemsList
          title={t('stats.topDestinations')}
          items={stats.topDestinations}
          icon={MapPin}
          iconColor="blue"
          itemKey="destination"
          countKey="count"
          subtitle={t('stats.reservations')}
        />

        {/* Top Guías */}
        <TopItemsList
          title={t('stats.topGuides')}
          items={stats.topGuides}
          icon={Users}
          iconColor="green"
          itemKey="guide"
          countKey="count"
          subtitle={t('stats.tours')}
        />

        {/* Distribución por Tipo */}
        <TourTypeDistribution
          distribution={stats.tourTypeDistribution}
          title={t('stats.tourTypes')}
        />
      </div>

      {/* Tendencia Mensual */}
      <MonthlyTrend
        data={stats.monthlyTrend}
        title={t('stats.monthlyTrend')}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

ReservationStats.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    tourists: PropTypes.number,
    totalAmount: PropTypes.number,
    destination: PropTypes.string,
    guide: PropTypes.string,
    tourType: PropTypes.string
  })),
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default ReservationStats;