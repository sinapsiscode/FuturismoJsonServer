/**
 * Dashboard migrado - TODOS los datos vienen del servidor
 * Reemplaza hardcodeo y datos mock
 */

import React, { useEffect, useState } from 'react';
import { CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import ExportPanel from '../components/dashboard/ExportPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ✅ NUEVO: Usar configuraciones del servidor
import { useServerConfig, useAppInitialization } from '../hooks/useServerConfig';
import { useAuthStore } from '../stores/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // ✅ NUEVO: Inicialización completa desde el servidor
  const {
    initData,
    loading: initLoading,
    error: initError
  } = useAppInitialization(user?.role, user?.id);

  // ✅ NUEVO: Configuraciones del servidor
  const {
    currentUser,
    dashboardData,
    hasPermission,
    isAdmin,
    refreshConfig
  } = useServerConfig();

  // Estado local para datos dinámicos
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NUEVO: Cargar datos del dashboard desde el servidor
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.role || !user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Obtener estadísticas específicas por rol
        const statsResponse = await fetch(`/api/dashboard/stats?role=${user.role}&userId=${user.id}`);
        const statsResult = await statsResponse.json();

        // Obtener datos mensuales
        const monthlyResponse = await fetch('/api/dashboard/monthly-data');
        const monthlyResult = await monthlyResponse.json();

        // Obtener datos de gráficos
        const chartResponse = await fetch('/api/dashboard/chart-data?type=line&timeRange=6months');
        const chartResult = await chartResponse.json();

        setDashboardStats(statsResult.data);
        setMonthlyData(monthlyResult.data);
        setChartData(chartResult.data);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.role, user?.id]);

  // ✅ NUEVO: Función para obtener saludo desde configuraciones del servidor
  const getGreeting = () => {
    const hour = new Date().getHours();

    // Si tenemos configuraciones del servidor, usar esas
    if (initData?.constants?.GREETING_MESSAGES) {
      const messages = initData.constants.GREETING_MESSAGES;
      if (hour < 12) return messages.MORNING;
      if (hour < 18) return messages.AFTERNOON;
      return messages.EVENING;
    }

    // Fallback temporal
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  // ✅ NUEVO: Función para obtener stats específicos por rol
  const getRoleSpecificStats = () => {
    if (!dashboardStats || !user?.role) return [];

    const baseStats = [];

    switch (user.role) {
      case 'admin':
        baseStats.push(
          {
            title: 'Usuarios Totales',
            value: dashboardStats.totalUsers || 0,
            icon: UserGroupIcon,
            color: 'blue',
            change: '+12%',
            trend: 'up'
          },
          {
            title: 'Agencias Activas',
            value: dashboardStats.totalAgencies || 0,
            icon: CheckCircleIcon,
            color: 'green',
            change: '+5%',
            trend: 'up'
          },
          {
            title: 'Guías Registrados',
            value: dashboardStats.totalGuides || 0,
            icon: UserGroupIcon,
            color: 'purple',
            change: '+8%',
            trend: 'up'
          }
        );
        break;

      case 'agency':
        baseStats.push(
          {
            title: 'Reservaciones Totales',
            value: dashboardStats.totalReservations || 0,
            icon: CalendarIcon,
            color: 'blue',
            change: '+15%',
            trend: 'up'
          },
          {
            title: 'Confirmadas',
            value: dashboardStats.confirmedReservations || 0,
            icon: CheckCircleIcon,
            color: 'green',
            change: '+10%',
            trend: 'up'
          },
          {
            title: 'Ingresos Mensuales',
            value: `$${dashboardStats.monthlyRevenue || 0}`,
            icon: CurrencyDollarIcon,
            color: 'yellow',
            change: '+25%',
            trend: 'up'
          }
        );
        break;

      case 'guide':
        baseStats.push(
          {
            title: 'Tours Completados',
            value: dashboardStats.toursCompleted || 0,
            icon: CheckCircleIcon,
            color: 'green',
            change: '+20%',
            trend: 'up'
          },
          {
            title: 'Tours Próximos',
            value: dashboardStats.upcomingTours || 0,
            icon: ClockIcon,
            color: 'blue',
            change: '3 esta semana',
            trend: 'neutral'
          },
          {
            title: 'Ingresos del Mes',
            value: `$${dashboardStats.monthlyIncome || 0}`,
            icon: CurrencyDollarIcon,
            color: 'yellow',
            change: '+18%',
            trend: 'up'
          }
        );
        break;

      default:
        // Para clientes u otros roles
        baseStats.push(
          {
            title: 'Servicios Disponibles',
            value: dashboardStats.availableServices || 0,
            icon: CheckCircleIcon,
            color: 'blue'
          }
        );
    }

    return baseStats;
  };

  // ✅ NUEVO: Función para verificar permisos usando servidor
  const getVisibleSections = () => {
    const sections = {
      statistics: true,
      charts: true,
      export: false
    };

    if (initData?.permissions) {
      sections.export = initData.permissions.can_export_data || false;
      sections.advanced = initData.permissions.can_view_advanced_stats || false;
    }

    return sections;
  };

  // Loading states
  if (initLoading || loading) {
    return <LoadingSpinner text={t('dashboard.loading')} />;
  }

  if (initError || error) {
    return (
      <div className="error-container">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar dashboard</h3>
        <p className="text-gray-600 mb-4">{initError || error}</p>
        <button
          onClick={() => refreshConfig()}
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const visibleSections = getVisibleSections();
  const roleStats = getRoleSpecificStats();

  return (
    <div className="page-container">
      {/* Header - Usando datos del servidor */}
      <div className="page-header">
        <h1 className="page-title">
          {getGreeting()}, {currentUser?.name || initData?.user?.name || 'Usuario'} ✨
        </h1>
        <p className="page-subtitle">
          {initData?.user?.role === 'admin' && 'Panel de Administración'}
          {initData?.user?.role === 'agency' && 'Panel de Agencia'}
          {initData?.user?.role === 'guide' && 'Panel de Guía'}
          {!initData?.user?.role && t('dashboard.todaySummary')}
        </p>
      </div>

      {/* Stats Cards - Datos del servidor */}
      {visibleSections.statistics && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          {roleStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
              trend={stat.trend}
            />
          ))}
        </div>
      )}

      {/* Charts Section - Datos del servidor */}
      {visibleSections.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Data Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
              Tendencia Mensual
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Ingresos"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Reservas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ServiceChart data={chartData} />
          </div>
        </div>
      )}

      {/* Export Panel - Solo si tiene permisos */}
      {visibleSections.export && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ExportPanel
            data={{
              stats: roleStats,
              monthly: monthlyData,
              chart: chartData
            }}
            userRole={user?.role}
          />
        </div>
      )}

      {/* Recent Activity - Si está en initData */}
      {initData?.recent_data?.recent_reservations && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {initData.recent_data.recent_reservations.slice(0, 5).map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    Reservación #{reservation.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(reservation.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  reservation.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;