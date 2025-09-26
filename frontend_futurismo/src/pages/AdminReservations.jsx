import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, FunnelIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, StarIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useAgencyStore from '../stores/agencyStore';

const AdminReservations = () => {
  const { t } = useTranslation();
  const { actions } = useAgencyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Obtener todas las reservas
  const allReservations = actions.getReservations();

  // Filtrar reservas
  const filteredReservations = useMemo(() => {
    let filtered = allReservations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res =>
        res.clientName.toLowerCase().includes(term) ||
        res.serviceType.toLowerCase().includes(term) ||
        res.id.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [allReservations, statusFilter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (reservationId, newStatus) => {
    const reservation = allReservations.find(res => res.id === reservationId);
    
    if (reservation && reservation.status === 'pending' && newStatus === 'confirmed') {
      const pointsToEarn = actions.calculatePointsForReservation(reservation);
      
      if (window.confirm(
        `¿Confirmar esta reserva?\n\n` +
        `La agencia ganará ${pointsToEarn} puntos automáticamente.\n` +
        `Cliente: ${reservation.clientName}\n` +
        `Servicio: ${reservation.serviceType}\n` +
        `Monto: S/. ${reservation.totalAmount}`
      )) {
        actions.updateReservation(reservationId, { status: newStatus });
        alert(`Reserva confirmada. La agencia ha ganado ${pointsToEarn} puntos.`);
      }
    } else {
      if (window.confirm(`¿Cambiar el estado de la reserva a "${newStatus}"?`)) {
        actions.updateReservation(reservationId, { status: newStatus });
      }
    }
  };

  const openReservationModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setShowModal(false);
  };

  const getStatusStats = () => {
    const stats = {
      total: allReservations.length,
      pending: allReservations.filter(r => r.status === 'pending').length,
      confirmed: allReservations.filter(r => r.status === 'confirmed').length,
      cancelled: allReservations.filter(r => r.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-blue-500" />
            Gestión de Reservas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y confirma las reservas de las agencias
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">{t('dashboard.totalReservations')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">{t('dashboard.pending')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-sm text-gray-600">{t('dashboard.confirmed')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-sm text-gray-600">{t('dashboard.cancelled')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por cliente, servicio o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>

            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredReservations.length} de {allReservations.length} reservas
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reserva
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha & Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.serviceType}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {reservation.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.clientName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{format(new Date(reservation.date), 'd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{reservation.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{reservation.participants}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>S/. {reservation.totalAmount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span>
                        {reservation.status === 'confirmed' ? 'Confirmada' :
                         reservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openReservationModal(reservation)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Confirmar reserva"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar reserva"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <div className="flex items-center space-x-1 text-yellow-600" title="Puntos otorgados">
                          <StarIcon className="w-4 h-4" />
                          <span className="text-xs">
                            {actions.calculatePointsForReservation(reservation)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron reservas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay reservas que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedReservation && (
        <div className="modal-overlay p-4">
          <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de la Reserva
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Reserva
                    </label>
                    <p className="text-sm text-gray-900">{selectedReservation.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedReservation.status)}`}>
                      {getStatusIcon(selectedReservation.status)}
                      <span>
                        {selectedReservation.status === 'confirmed' ? 'Confirmada' :
                         selectedReservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Información del servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Servicio
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{selectedReservation.serviceType}</p>
                </div>

                {/* Información del cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <p className="text-lg text-gray-900">{selectedReservation.clientName}</p>
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {format(new Date(selectedReservation.date), 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{selectedReservation.time}</span>
                    </div>
                  </div>
                </div>

                {/* Participantes y monto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participantes
                    </label>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{selectedReservation.participants} personas</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Total
                    </label>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-900">S/. {selectedReservation.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Guía asignado */}
                {selectedReservation.guideAssigned && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guía Asignado
                    </label>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{selectedReservation.guideAssigned}</span>
                    </div>
                  </div>
                )}

                {/* Puntos a ganar */}
                {selectedReservation.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <StarIcon className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Al confirmar esta reserva, la agencia ganará {actions.calculatePointsForReservation(selectedReservation)} puntos
                      </span>
                    </div>
                  </div>
                )}

                {/* Puntos ganados */}
                {selectedReservation.status === 'confirmed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <StarIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        La agencia ganó {actions.calculatePointsForReservation(selectedReservation)} puntos por esta reserva
                      </span>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                {selectedReservation.status === 'pending' && (
                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReservation.id, 'confirmed');
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Confirmar Reserva</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReservation.id, 'cancelled');
                        closeModal();
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      <span>Cancelar Reserva</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;