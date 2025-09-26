import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartBarIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, UserGroupIcon, CalendarIcon, ArrowDownTrayIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  BarChart as Chart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import useAgencyStore from '../stores/agencyStore';

const AgencyReports = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState('monthly'); // monthly, yearly
  const [chartType, setChartType] = useState('revenue'); // revenue, reservations, participants
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get actions from store after component initialization
  const { actions } = useAgencyStore();

  // Obtener datos del reporte
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      
      try {
        if (reportType === 'monthly') {
          const data = await actions.fetchMonthlyReport(year, month);
          setReportData(data);
        } else {
          const yearlyData = await actions.fetchYearlyComparison(year);
          setReportData({ yearlyData, year });
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedDate, reportType, actions]);

  const navigateDate = (direction) => {
    if (direction === 'prev') {
      setSelectedDate(prev => reportType === 'monthly' ? subMonths(prev, 1) : new Date(prev.getFullYear() - 1, 0, 1));
    } else {
      setSelectedDate(prev => reportType === 'monthly' ? addMonths(prev, 1) : new Date(prev.getFullYear() + 1, 0, 1));
    }
  };

  // Colores para gráficos
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Preparar datos para gráfico de barras diario (solo para vista mensual)
  const dailyChartData = useMemo(() => {
    if (reportType !== 'monthly' || !reportData || !reportData.dailyData) return [];
    
    return reportData.dailyData.map(day => ({
      day: format(new Date(day.date), 'd MMM', { locale: es }),
      dayNumber: format(new Date(day.date), 'd'),
      date: day.date,
      revenue: day.revenue || 0,
      reservations: day.reservations || 0,
      participants: day.participants || 0
    }));
  }, [reportData, reportType]);

  // Preparar datos para gráfico de servicios
  const serviceChartData = useMemo(() => {
    if (reportType !== 'monthly' || !reportData || !reportData.serviceBreakdown) return [];
    
    return Object.entries(reportData.serviceBreakdown).map(([service, data], index) => ({
      name: service,
      revenue: data.revenue,
      reservations: data.count,
      participants: data.participants,
      fill: colors[index % colors.length]
    }));
  }, [reportData, reportType]);

  // Preparar datos para gráfico anual
  const yearlyChartData = useMemo(() => {
    if (reportType !== 'yearly' || !reportData || !reportData.yearlyData) return [];
    
    return reportData.yearlyData.map(month => ({
      month: month.monthName,
      revenue: month.totalRevenue,
      reservations: month.totalReservations,
      participants: month.totalParticipants
    }));
  }, [reportData, reportType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  const exportReport = () => {
    // Implementar exportación a PDF/Excel (sin CSV)
    console.log('Exportando reporte...', reportData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="w-8 h-8 mr-3 text-green-500" />
            Reportes de Ventas
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tus ventas y rendimiento
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="monthly">Reporte Mensual</option>
              <option value="yearly">Reporte Anual</option>
            </select>
          </div>
          
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Navegación de fecha */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold capitalize">
            {reportType === 'monthly' 
              ? format(selectedDate, 'MMMM yyyy', { locale: es })
              : `Año ${selectedDate.getFullYear()}`
            }
          </h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Tarjetas de resumen */}
      {!loading && reportType === 'monthly' && reportData && reportData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.totalReservations}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.totalReservations')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.totalRevenue)}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.totalIncome')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.totalParticipants}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.totalTourists')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.averageOrderValue)}
                </p>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      {!loading && reportData && (
      <div className="mb-6">
        {/* Gráfico principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {reportType === 'monthly' ? 'Ventas Diarias' : 'Ventas Mensuales'}
            </h3>
            <div className="flex items-center space-x-2">
              {reportType === 'monthly' && (
                <>
                  {chartType === 'revenue' && <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />}
                  {chartType === 'reservations' && <CalendarIcon className="w-5 h-5 text-blue-600" />}
                  {chartType === 'participants' && <UserGroupIcon className="w-5 h-5 text-green-600" />}
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="revenue">Ingresos</option>
                    <option value="reservations">Reservas</option>
                    <option value="participants">Turistas</option>
                  </select>
                </>
              )}
              {reportType === 'yearly' && <ChartBarIcon className="w-5 h-5 text-blue-600" />}
            </div>
          </div>
          
          <div className="h-48">
            {reportType === 'monthly' && dailyChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ChartBarIcon className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm font-medium">No hay datos de ventas para este período</p>
                <p className="text-xs mt-1 text-gray-400">Las ventas aparecerán aquí cuando se registren reservas</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'monthly' ? (
                <Chart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [
                      chartType === 'revenue' ? formatCurrency(value) : value,
                      chartType === 'revenue' ? 'Ingresos' : 
                      chartType === 'reservations' ? 'Reservas' : 'Turistas'
                    ]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey={chartType} 
                    fill={chartType === 'revenue' ? '#8B5CF6' : chartType === 'reservations' ? '#3B82F6' : '#10B981'}
                    radius={[4, 4, 0, 0]}
                  />
                </Chart>
            ) : (
              <LineChart data={yearlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Ingresos' : 
                    name === 'reservations' ? 'Reservas' : 'Turistas'
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="reservations" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
              )}
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Tabla detallada por servicios */}
      {!loading && reportType === 'monthly' && serviceChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalle por Tipo de Servicio
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceChartData.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: service.fill }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.reservations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(service.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(service.reservations > 0 ? service.revenue / service.reservations : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabla anual */}
      {!loading && reportType === 'yearly' && reportData && reportData.yearlyData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen Anual {reportData.year}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.yearlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {month.monthName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.totalReservations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.totalParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(month.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(month.averageOrderValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyReports;