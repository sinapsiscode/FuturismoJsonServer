import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, CurrencyDollarIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, HeartIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { formatters } from '../../utils/formatters';
import { useReservationsStore } from '../../stores/reservationsStore';
import { useAuthStore } from '../../stores/authStore';
import ReservationDetail from './ReservationDetail';
import ReservationEditModal from './ReservationEditModal';
import ExportModal from '../common/ExportModal';
import exportService from '../../services/exportService';
import ServiceRatingModal from '../ratings/ServiceRatingModal';
import ResponsiveTable from '../common/ResponsiveTable';
import toast from 'react-hot-toast';
import { mockReservations } from '../../data/mockReservationsData';
import { useReservationFilters } from '../../hooks/useReservationFilters';
import { getStatusBadge, getPaymentBadge, canRateService } from '../../utils/reservationHelpers';
import { paymentVoucherService } from '../../services/paymentVoucherService';

const ReservationList = () => {
  const { reservations } = useReservationsStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  // Usar mock data importada
  const reservationsData = mockReservations;
  
  // Hook personalizado para filtros
  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    customerFilter, setCustomerFilter,
    minPassengers, setMinPassengers,
    maxPassengers, setMaxPassengers,
    currentPage, setCurrentPage,
    filteredReservations,
    paginatedReservations,
    totalPages,
    exportStats,
    startIndex,
    itemsPerPage,
    resetFilters
  } = useReservationFilters(reservationsData);
  
  // Estados locales para UI
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleExport = () => {
    // Verificar si hay datos para exportar
    if (filteredReservations.length === 0) {
      toast.warning(t('reservations.noDataToExport'));
      return;
    }
    
    // Abrir el modal de exportación
    setShowExportModal(true);
  };
  
  const getStatusLabel = (status) => {
    const labels = {
      pendiente: t('reservations.pending'),
      confirmada: t('reservations.confirmed'),
      cancelada: t('reservations.cancelled'),
      completada: t('reservations.completed')
    };
    return labels[status] || status;
  };

  
  const getPaymentLabel = (status) => {
    const labels = {
      pendiente: t('reservations.pending'),
      pagado: t('reservations.paid'),
      reembolsado: t('reservations.refunded')
    };
    return labels[status] || status;
  };


  const handleViewDetail = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetail(true);
    setShowActions(null);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
    setShowActions(null);
  };

  const handleDelete = (reservation) => {
    // TODO: Implementar eliminación
    if (window.confirm(t('search.deleteConfirm'))) {
      toast.info(t('reservations.deleteNotImplemented'));
    }
    setShowActions(null);
  };

  const handleRateTourists = (reservation) => {
    if (!reservation.tourists || reservation.tourists.length === 0) {
      toast.error(t('reservations.noTouristsToRate'));
      return;
    }
    
    setSelectedService({
      id: reservation.id,
      name: reservation.tourName,
      date: reservation.date,
      time: reservation.time
    });
    setShowRatingModal(true);
    setShowActions(null);
  };

  const handleRatingsCompleted = (allRatings) => {
    // TODO: En una implementación real, aquí se guardarían las valoraciones en la base de datos
    // y se actualizaría el estado de la reserva como "valorada"
    
    setShowRatingModal(false);
    setSelectedService(null);
    toast.success(t('ratings.service.allRatingsCompleted'));
  };

  const handleSaveReservation = (updatedReservation) => {
    // TODO: En una implementación real, aquí se actualizaría la reserva en la base de datos
    // Por ahora solo mostramos el mensaje de éxito
    setShowEditModal(false);
    setSelectedReservation(null);
    // El toast de éxito se muestra desde el modal
  };

  const handleGenerateVoucher = (reservation) => {
    try {
      paymentVoucherService.downloadVoucher(reservation, `nota-pago-${reservation.id}.pdf`);
      toast.success('Nota de pago generada y descargada exitosamente');
    } catch (error) {
      console.error('Error generating voucher:', error);
      toast.error('Error al generar la nota de pago');
    }
    setShowActions(null);
  };

  const handlePreviewVoucher = (reservation) => {
    try {
      paymentVoucherService.previewVoucher(reservation);
    } catch (error) {
      console.error('Error previewing voucher:', error);
      toast.error('Error al previsualizar la nota de pago');
    }
    setShowActions(null);
  };

  const handleChangeStatus = (reservation) => {
    setSelectedReservation(reservation);
    setShowStatusModal(true);
    setShowActions(null);
  };



  const handleModalExport = async (format) => {
    try {
      // Mapear el filtro actual al formato del servicio
      let filterStatus = 'all';
      if (statusFilter !== 'all') {
        filterStatus = statusFilter;
      }
      
      // Exportar usando el servicio
      exportService.exportData(format, filterStatus);
      
      // Obtener estadísticas para el mensaje
      const stats = exportService.getFilteredStats(filterStatus);
      const statusLabel = filterStatus === 'all' ? 'Todas las reservas' : 
                         filterStatus === 'confirmada' ? 'Solo confirmadas' :
                         filterStatus === 'pendiente' ? 'Solo pendientes' :
                         filterStatus === 'cancelada' ? 'Solo canceladas' : 'Reservas filtradas';
      
      // Mostrar mensaje de éxito
      toast.success(t('reservations.exportSuccess', {
        count: stats.totalReservations,
        tourists: stats.totalTourists,
        revenue: stats.totalRevenue.toLocaleString(),
        format: format.toUpperCase()
      }));
      
    } catch (error) {
      toast.error(t('reservations.exportError'));
      throw new Error(`Error al exportar: ${error.message}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header con búsqueda y filtros */}
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Primera fila: Búsqueda y Exportar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
              <div className="flex-1 sm:max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder={t('search.searchByTour')}
                    className="pl-10 pr-4 py-2.5 sm:py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleExport}
                className="btn btn-outline flex items-center justify-center gap-2 hover:bg-primary-50 hover:border-primary-500 py-2.5 sm:py-2 text-sm font-medium"
                title="Exportar reservas filtradas en Excel y PDF"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('search.export')} ({filteredReservations.length})</span>
                <span className="sm:hidden">Exportar ({filteredReservations.length})</span>
              </button>
            </div>

            {/* Segunda fila: Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 sm:flex-wrap">
              {/* Estado */}
              <select
                className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('search.allStatuses')}</option>
                <option value="pendiente">{t('reservations.pending')}</option>
                <option value="confirmada">{t('reservations.confirmed')}</option>
                <option value="cancelada">{t('reservations.cancelled')}</option>
                <option value="completada">{t('reservations.completed')}</option>
              </select>

              {/* Fechas - en móvil como inputs separados */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:bg-gray-50 sm:rounded-lg sm:px-3 sm:py-2 sm:border sm:border-gray-300">
                <span className="text-sm text-gray-600 sm:whitespace-nowrap hidden sm:block">{t('search.dateRange')}:</span>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg sm:px-2 sm:py-1 sm:border-0 sm:bg-transparent focus:ring-2 focus:ring-primary-500 sm:focus:ring-0 sm:focus:outline-none text-sm"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    title={t('search.dateFrom')}
                  />
                  <span className="text-gray-400 hidden sm:inline">-</span>
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg sm:px-2 sm:py-1 sm:border-0 sm:bg-transparent focus:ring-2 focus:ring-primary-500 sm:focus:ring-0 sm:focus:outline-none text-sm"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    title={t('search.dateTo')}
                  />
                </div>
              </div>

              {/* Cliente */}
              <input
                type="text"
                placeholder={t('search.clientOrAgency')}
                className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-40 text-sm sm:text-base"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />

              {/* Pasajeros - en grid en móvil */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <input
                  type="number"
                  placeholder={t('search.minPassengers')}
                  className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-24 text-sm sm:text-base"
                  value={minPassengers}
                  onChange={(e) => setMinPassengers(e.target.value)}
                  min="1"
                />

                <input
                  type="number"
                  placeholder={t('search.maxPassengers')}
                  className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-24 text-sm sm:text-base"
                  value={maxPassengers}
                  onChange={(e) => setMaxPassengers(e.target.value)}
                  min="1"
                />
              </div>

              {/* Botón para limpiar filtros */}
              {(dateFrom || dateTo || customerFilter || minPassengers || maxPassengers) && (
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                    setCustomerFilter('');
                    setMinPassengers('');
                    setMaxPassengers('');
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 sm:py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors font-medium"
                  title={t('search.clear')}
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span className="sm:hidden">Limpiar</span>
                  <span className="hidden sm:inline">{t('search.clear')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de reservaciones */}
        <ResponsiveTable>
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200 hidden sm:table-header-group">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.code')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.tourClient')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.dateTime')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.passengers')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.total')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('reservations.status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('search.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  {/* Desktop view - hidden on mobile */}
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{reservation.id}</span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reservation.tourName}</p>
                      <p className="text-sm text-gray-500">{reservation.clientName}</p>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <CalendarIcon className="w-4 h-4" />
                        {formatters.formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {reservation.time}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span>
                        {reservation.adults + reservation.children}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      S/. {reservation.total}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === reservation.id ? null : reservation.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>

                      {showActions === reservation.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleViewDetail(reservation)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <EyeIcon className="w-4 h-4" />
                            {t('search.viewDetails')}
                          </button>
                          
                          {/* Botón de valoración - solo para servicios completados */}
                          {canRateService(reservation) && (
                            <button
                              onClick={() => handleRateTourists(reservation)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                            >
                              <HeartIcon className="w-4 h-4" />
                              {t('search.rateTourists')} ({reservation.tourists?.length || 0})
                            </button>
                          )}
                          {/* Solo agencias pueden editar sus propias reservas */}
                          {user?.role === 'agency' && (
                            <>
                              <button
                                onClick={() => handleEdit(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <PencilIcon className="w-4 h-4" />
                                {t('search.edit')}
                              </button>
                              <button
                                onClick={() => handleChangeStatus(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <ArrowPathIcon className="w-4 h-4" />
                                Cambiar Estado
                              </button>
                              <button
                                onClick={() => handleGenerateVoucher(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                                {t('search.generateVoucher')}
                              </button>
                            </>
                          )}
                          {/* Solo admins pueden eliminar */}
                          {user?.role === 'admin' && (
                            <>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="w-4 h-4" />
                                {t('search.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Mobile card view - visible only on mobile */}
                  <td className="sm:hidden px-3 py-4 w-full">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      {/* Header with ID and actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">#{reservation.id}</span>
                        <div className="flex items-center gap-2">
                          <span className={`badge text-xs ${getStatusBadge(reservation.status)}`}>
                            {getStatusLabel(reservation.status)}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === reservation.id ? null : reservation.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                            {showActions === reservation.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => handleViewDetail(reservation)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  {t('search.viewDetails')}
                                </button>
                                
                                {canRateService(reservation) && (
                                  <button
                                    onClick={() => handleRateTourists(reservation)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                  >
                                    <HeartIcon className="w-4 h-4" />
                                    {t('search.rateTourists')} ({reservation.tourists?.length || 0})
                                  </button>
                                )}
                                {user?.role === 'agency' && (
                                  <>
                                    <button
                                      onClick={() => handleEdit(reservation)}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleChangeStatus(reservation)}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <ArrowPathIcon className="w-4 h-4" />
                                      Cambiar Estado
                                    </button>
                                    <button
                                      onClick={() => handleGenerateVoucher(reservation)}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <DocumentTextIcon className="w-4 h-4" />
                                      Voucher
                                    </button>
                                  </>
                                )}
                                {user?.role === 'admin' && (
                                  <>
                                    <hr className="my-1" />
                                    <button
                                      onClick={() => handleDelete(reservation)}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                      Eliminar
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tour and client info */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{reservation.tourName}</p>
                        <p className="text-sm text-gray-600">{reservation.clientName}</p>
                      </div>

                      {/* Date, time, passengers info */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{formatters.formatDate(reservation.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="w-3 h-3" />
                          <span>{reservation.adults + reservation.children} pax</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CurrencyDollarIcon className="w-3 h-3" />
                          <span>S/. {reservation.total}</span>
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-3 py-4 sm:px-6 border-t border-gray-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                <span className="hidden sm:inline">
                  {t('search.showing')} {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredReservations.length)} {t('search.of')} {filteredReservations.length} {t('search.reservationsPlural')}
                </span>
                <span className="sm:hidden">
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredReservations.length)} de {filteredReservations.length}
                </span>
              </div>
              <div className="flex gap-1 sm:gap-2 justify-center">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 sm:px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                {/* Show fewer page numbers on mobile */}
                {totalPages <= 5 ? (
                  // Show all pages if 5 or fewer
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-2 py-1 sm:px-3 rounded-md text-sm font-medium ${
                        currentPage === index + 1
                          ? 'bg-primary-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  // Show condensed pagination for more than 5 pages
                  <>
                    {/* First page */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      className={`px-2 py-1 sm:px-3 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-primary-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      1
                    </button>
                    
                    {/* Previous page if not adjacent to first */}
                    {currentPage > 3 && <span className="px-1 text-gray-500">...</span>}
                    
                    {/* Current page area */}
                    {currentPage > 2 && currentPage < totalPages - 1 && (
                      <button
                        onClick={() => setCurrentPage(currentPage)}
                        className="px-2 py-1 sm:px-3 rounded-md text-sm font-medium bg-primary-500 text-white"
                      >
                        {currentPage}
                      </button>
                    )}
                    
                    {/* Next page if not adjacent to last */}
                    {currentPage < totalPages - 2 && <span className="px-1 text-gray-500">...</span>}
                    
                    {/* Last page */}
                    {totalPages > 1 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-2 py-1 sm:px-3 rounded-md text-sm font-medium ${
                          currentPage === totalPages
                            ? 'bg-primary-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 sm:px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {showDetail && (
        <ReservationDetail 
          reservation={selectedReservation}
          onClose={() => {
            setShowDetail(false);
            setSelectedReservation(null);
          }}
        />
      )}

      {/* Modal de edición */}
      {showEditModal && selectedReservation && (
        <ReservationEditModal
          reservation={selectedReservation}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          onSave={handleSaveReservation}
        />
      )}

      {/* Modal de exportación */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleModalExport}
        reservationCount={filteredReservations.length}
        filterStatus={statusFilter}
        stats={exportStats}
      />

      {/* Modal de valoración de turistas */}
      {showRatingModal && selectedService && (
        <ServiceRatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          tourists={mockReservations.find(r => r.id === selectedService.id)?.tourists || []}
          onAllRatingsCompleted={handleRatingsCompleted}
        />
      )}

      {/* Modal de cambio de estado */}
      {showStatusModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado de Reserva</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reserva: <span className="font-medium">{selectedReservation.id}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Estado actual: <span className={`badge ${getStatusBadge(selectedReservation.status)}`}>
                {getStatusLabel(selectedReservation.status)}
              </span>
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  // TODO: Implementar cambio de estado
                  toast.success('Estado cambiado a Pendiente');
                  setShowStatusModal(false);
                }}
                className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Pendiente
              </button>
              <button
                onClick={() => {
                  toast.success('Estado cambiado a Confirmada');
                  setShowStatusModal(false);
                }}
                className="w-full px-4 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Confirmada
              </button>
              <button
                onClick={() => {
                  toast.success('Estado cambiado a Completada');
                  setShowStatusModal(false);
                }}
                className="w-full px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Completada
              </button>
              <button
                onClick={() => {
                  toast.success('Estado cambiado a Cancelada');
                  setShowStatusModal(false);
                }}
                className="w-full px-4 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Cancelada
              </button>
            </div>
            
            <button
              onClick={() => setShowStatusModal(false)}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default ReservationList;