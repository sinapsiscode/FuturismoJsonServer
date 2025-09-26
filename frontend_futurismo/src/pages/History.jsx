import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import useHistoryStore from '../stores/historyStore';
import useAuthStore from '../stores/authStore';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryTable from '../components/history/HistoryTable';
import HistoryPagination from '../components/history/HistoryPagination';
import ServiceDetailsModal from '../components/history/ServiceDetailsModal';
import RatingModal from '../components/rating/RatingModal';

const History = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  const {
    filteredServices,
    filters,
    pagination,
    sort,
    loading,
    error,
    loadHistory,
    updateFilter,
    clearFilters,
    changePage,
    updateSort,
    getPaginatedServices,
    getFilterOptions
  } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, []); // Empty dependency array to run only once

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedService(null);
  };

  const handleRate = (service) => {
    setSelectedService(service);
    setIsRatingModalOpen(true);
  };

  const handleCloseRating = () => {
    setIsRatingModalOpen(false);
    setSelectedService(null);
  };

  const handleSubmitRating = async (ratingData) => {
    setRatingLoading(true);
    try {
      // Simular guardado de calificación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la llamada a la API
      console.log('Rating submitted:', ratingData);
      
      // Actualizar el servicio con la nueva calificación
      // En un entorno real, esto vendría del servidor
      // Por ahora simulamos la actualización
      
      handleCloseRating();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  const paginatedServices = getPaginatedServices();
  const filterOptions = getFilterOptions();

  // Filtrar opciones según el rol del usuario
  const getFilteredOptions = () => {
    if (user?.role === 'guide') {
      // Los guías solo ven sus propios servicios
      return {
        guides: [user.name],
        drivers: filterOptions.drivers,
        vehicles: filterOptions.vehicles
      };
    }
    return filterOptions;
  };

  const roleFilteredOptions = getFilteredOptions();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-red-500 mb-4">
            <DocumentTextIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('history.error.title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={loadHistory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('history.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('history.title')}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {user?.role === 'admin' && t('history.description.admin')}
                {user?.role === 'agency' && t('history.description.agency')}
                {user?.role === 'guide' && t('history.description.guide')}
              </p>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredServices.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('history.stats.filtered')}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredServices.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('history.stats.completed')}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredServices.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('history.stats.pending')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <HistoryFilters
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          filterOptions={roleFilteredOptions}
          loading={loading}
        />

        {/* Tabla */}
        <div className="mb-6">
          <HistoryTable
            services={paginatedServices}
            sort={sort}
            onSort={updateSort}
            onViewDetails={handleViewDetails}
            onRate={handleRate}
            loading={loading}
          />
        </div>

        {/* Paginación */}
        <HistoryPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={changePage}
          loading={loading}
        />

        {/* Modal de detalles */}
        <ServiceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          service={selectedService}
        />

        {/* Modal de calificación */}
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={handleCloseRating}
          onSubmit={handleSubmitRating}
          service={selectedService}
          type="service"
          loading={ratingLoading}
        />
      </div>
    </div>
  );
};

export default History;