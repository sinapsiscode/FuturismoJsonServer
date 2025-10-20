import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  BuildingOffice2Icon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import useToursStore from '../stores/toursStore';
import useGuidesStore from '../stores/guidesStore';
import useClientsStore from '../stores/clientsStore';
import useDriversStore from '../stores/driversStore';
import useVehiclesStore from '../stores/vehiclesStore';
import { formatters } from '../utils/formatters';
import toast from 'react-hot-toast';
import exportService from '../services/exportService';

const TourAssignments = () => {
  const navigate = useNavigate();
  const [selectedTour, setSelectedTour] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState('guide'); // 'guide', 'driver', 'vehicle'
  const [selectedGuide, setSelectedGuide] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [validateCompetences, setValidateCompetences] = useState(true);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Stores
  const { 
    tours, 
    loadTours, 
    assignGuideToTour,
    getAvailableGuidesForTour,
    removeAssignment,
    isLoading 
  } = useToursStore();
  
  const { guides, fetchGuides } = useGuidesStore();
  const { clients, initialize: initializeClients } = useClientsStore();
  const { fetchAvailableDrivers, assignDriver } = useDriversStore();
  const { fetchAvailableVehicles, assignVehicle } = useVehiclesStore();

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de manera independiente para evitar que un error bloquee todo
        const promises = [
          loadTours().catch(err => console.warn('Error cargando tours:', err)),
          fetchGuides().catch(err => console.warn('Error cargando guides:', err)),
          initializeClients().catch(err => console.warn('Error cargando clients:', err))
        ];

        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error al cargar los datos');
      }
    };

    loadData();
  }, []);

  // Filtrar tours - Por defecto solo mostrar tours sin asignaciones completas
  const filteredTours = tours.filter(tour => {
    // Verificar si el tour tiene todas las asignaciones
    const hasCompleteAssignments = tour.assignedGuide && tour.assignedDriver && tour.assignedVehicle;
    
    // Si el filtro es 'pending', mostrar solo tours sin asignaciones completas
    if (filter === 'pending') return !hasCompleteAssignments;
    
    // Si el filtro es 'assigned', mostrar solo tours con todas las asignaciones
    if (filter === 'assigned') return hasCompleteAssignments;
    
    // Si el filtro es 'today', mostrar tours de hoy sin asignaciones completas
    if (filter === 'today') {
      const today = new Date().toDateString();
      const tourDate = new Date(tour.date || tour.createdAt).toDateString();
      return today === tourDate && !hasCompleteAssignments;
    }
    
    // Si el filtro es 'all', mostrar solo tours sin asignaciones completas
    if (filter === 'all') return !hasCompleteAssignments;
    
    // Aplicar búsqueda solo en tours sin asignaciones completas
    if (searchTerm && !hasCompleteAssignments) {
      const term = searchTerm.toLowerCase();
      return tour.name.toLowerCase().includes(term) ||
             tour.code.toLowerCase().includes(term) ||
             tour.category.toLowerCase().includes(term);
    }
    
    return !hasCompleteAssignments;
  });

  // Contar tours por estado
  const getCounts = () => {
    const counts = {
      total: tours.length,
      pending: tours.filter(t => {
        const hasCompleteAssignments = t.assignedGuide && t.assignedDriver && t.assignedVehicle;
        return !hasCompleteAssignments;
      }).length,
      assigned: tours.filter(t => {
        const hasCompleteAssignments = t.assignedGuide && t.assignedDriver && t.assignedVehicle;
        return hasCompleteAssignments;
      }).length,
      today: tours.filter(t => {
        const today = new Date().toDateString();
        const tourDate = new Date(t.date || t.createdAt).toDateString();
        const hasCompleteAssignments = t.assignedGuide && t.assignedDriver && t.assignedVehicle;
        return today === tourDate && !hasCompleteAssignments;
      }).length
    };
    return counts;
  };

  const counts = getCounts();

  // Abrir modal de asignación
  const handleOpenAssignModal = async (tour) => {
    setSelectedTour(tour);
    setShowAssignModal(true);
    setAssignmentType('guide');
    setSelectedGuide('');
    setSelectedDriver('');
    setSelectedVehicle('');
    setValidateCompetences(true);
    
    // Cargar guías disponibles
    setCheckingAvailability(true);
    try {
      const date = tour.date || new Date().toISOString();
      const guides = await getAvailableGuidesForTour(tour.id, date);
      setAvailableGuides(guides);
    } catch (error) {
      console.error('Error cargando guías disponibles:', error);
      toast.error('Error al cargar guías disponibles');
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Cargar recursos disponibles según el tipo de asignación
  const handleAssignmentTypeChange = async (type) => {
    setAssignmentType(type);
    
    if (!selectedTour) return;
    
    const tourDate = selectedTour.date || new Date().toISOString();
    
    setCheckingAvailability(true);
    try {
      switch (type) {
        case 'driver':
          const drivers = await fetchAvailableDrivers(tourDate);
          setAvailableDrivers(drivers);
          break;
          
        case 'vehicle':
          const passengers = selectedTour.groupSize || 10;
          const vehicles = await fetchAvailableVehicles(tourDate, passengers);
          setAvailableVehicles(vehicles);
          break;
      }
    } catch (error) {
      console.error(`Error cargando ${type}s disponibles:`, error);
      toast.error(`Error al cargar ${type === 'driver' ? 'choferes' : 'vehículos'} disponibles`);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Asignar recurso al tour
  const handleAssign = async () => {
    if (!selectedTour) return;
    
    try {
      switch (assignmentType) {
        case 'guide':
          if (!selectedGuide) {
            toast.error('Seleccione un guía');
            return;
          }
          await assignGuideToTour(selectedTour.id, selectedGuide, { validateCompetences });
          toast.success('Guía asignado exitosamente');
          break;
          
        case 'driver':
          if (!selectedDriver) {
            toast.error('Seleccione un chofer');
            return;
          }
          await assignDriver(selectedDriver, {
            tourId: selectedTour.id,
            tourCode: selectedTour.code,
            date: selectedTour.date || new Date().toISOString(),
            vehicleId: selectedVehicle || null
          });
          toast.success('Chofer asignado exitosamente');
          break;
          
        case 'vehicle':
          if (!selectedVehicle) {
            toast.error('Seleccione un vehículo');
            return;
          }
          await assignVehicle(selectedVehicle, {
            tourId: selectedTour.id,
            tourCode: selectedTour.code,
            date: selectedTour.date || new Date().toISOString(),
            passengers: selectedTour.groupSize || 10,
            driverId: selectedDriver || null
          });
          toast.success('Vehículo asignado exitosamente');
          break;
      }
      
      // Recargar tours y cerrar modal
      await loadTours();
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error en asignación:', error);
    }
  };

  // Remover asignación
  const handleRemoveAssignment = async (tourId, type = 'guide') => {
    if (window.confirm('¿Está seguro de remover esta asignación?')) {
      try {
        await removeAssignment(tourId, type);
        toast.success('Asignación removida exitosamente');
      } catch (error) {
        console.error('Error removiendo asignación:', error);
      }
    }
  };

  // Exportar asignaciones
  const handleExport = async (format) => {
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      // Determinar el estado para exportar basado en el filtro actual
      let exportStatus = 'all';
      if (filter === 'assigned') exportStatus = 'completed';
      if (filter === 'pending') exportStatus = 'pending';

      await exportService.exportAssignments(format, exportStatus);
      toast.success(`Reporte exportado exitosamente como ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exportando asignaciones:', error);
      toast.error('Error al exportar el reporte');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Asignación de Tours
          </h1>
        </div>
        <p className="text-gray-600">
          Asigna guías, choferes y vehículos a los tours pendientes
        </p>
      </div>

      {/* Quick Access Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Recursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/drivers')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center">
              <TruckIcon className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">Choferes</h4>
                <p className="text-sm text-gray-600">Gestionar conductores</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </button>
          
          <button
            onClick={() => navigate('/clients')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center">
              <BuildingOffice2Icon className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">Agencias</h4>
                <p className="text-sm text-gray-600">Gestionar agencias</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </button>
          
          <button
            onClick={() => navigate('/vehicles')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center">
              <TruckIcon className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">Vehículos</h4>
                <p className="text-sm text-gray-600">Gestionar flota</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tours</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sin Asignar</p>
              <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{counts.assigned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{counts.today}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              {[
                { key: 'all', label: 'Pendientes' },
                { key: 'pending', label: 'Sin Asignar' },
                { key: 'assigned', label: 'Completados' },
                { key: 'today', label: 'Pendientes Hoy' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, código o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting || tours.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>

              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z" />
                      </svg>
                      Exportar a Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z" />
                      </svg>
                      Exportar a PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Tour Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
                  <p className="text-sm text-gray-500">Código: {tour.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tour.assignedGuide && tour.assignedDriver && tour.assignedVehicle
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {tour.assignedGuide && tour.assignedDriver && tour.assignedVehicle ? 'Completo' : 'Pendiente'}
                </span>
              </div>

              {/* Tour Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatters.formatDate(tour.date || tour.createdAt)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {tour.groupSize || 0} participantes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {tour.duration || 'N/A'} - {tour.category}
                </div>
              </div>

              {/* Assignments */}
              <div className="space-y-2 mb-4 pt-4 border-t">
                {/* Guía */}
                {tour.assignedGuide ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-green-700">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>
                        {guides.find(g => g.id === tour.assignedGuide)?.name || 'Guía asignado'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(tour.id, 'guide')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 inline mr-2" />
                    Sin guía asignado
                  </div>
                )}


                {/* Chofer */}
                {tour.assignedDriver ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-green-700">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>Chofer asignado</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(tour.id, 'driver')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 inline mr-2" />
                    Sin chofer asignado
                  </div>
                )}

                {/* Vehículo */}
                {tour.assignedVehicle ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-green-700">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      <span>Vehículo asignado</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAssignment(tour.id, 'vehicle')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <TruckIcon className="h-4 w-4 inline mr-2" />
                    Sin vehículo asignado
                  </div>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={() => handleOpenAssignModal(tour)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                Gestionar Asignaciones
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTours.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay tours pendientes de asignación
          </h3>
          <p className="text-gray-500">
            Todos los tours tienen sus asignaciones completas o no hay tours que coincidan con los filtros.
          </p>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedTour && (
        <div className="modal-overlay p-4">
          <div className="modal-content max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Asignar recursos a {selectedTour.name}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Assignment Type Tabs */}
            <div className="flex space-x-2 mb-6">
              {[
                { key: 'guide', label: 'Guía', icon: UserIcon },
                { key: 'driver', label: 'Chofer', icon: UserIcon },
                { key: 'vehicle', label: 'Vehículo', icon: TruckIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleAssignmentTypeChange(key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                    assignmentType === key
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </button>
              ))}
            </div>

            {/* Guide Assignment */}
            {assignmentType === 'guide' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Guía
                  </label>
                  {checkingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Verificando disponibilidad...</p>
                    </div>
                  ) : (
                    <select
                      value={selectedGuide}
                      onChange={(e) => setSelectedGuide(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccione un guía</option>
                      {availableGuides.map((guide) => (
                        <option key={guide.id} value={guide.id}>
                          {guide.name} - {guide.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="validateCompetences"
                    checked={validateCompetences}
                    onChange={(e) => setValidateCompetences(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="validateCompetences" className="ml-2 text-sm text-gray-700">
                    Validar competencias del guía
                  </label>
                </div>

                {availableGuides.length === 0 && !checkingAvailability && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      No hay guías disponibles para este tour en la fecha seleccionada.
                    </p>
                  </div>
                )}
              </div>
            )}


            {/* Driver Assignment */}
            {assignmentType === 'driver' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Chofer
                  </label>
                  {checkingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Verificando disponibilidad...</p>
                    </div>
                  ) : (
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccione un chofer</option>
                      {availableDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.fullName} - Licencia: {driver.licenseCategory}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {availableDrivers.length === 0 && !checkingAvailability && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      No hay choferes disponibles para este tour en la fecha seleccionada.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Vehicle Assignment */}
            {assignmentType === 'vehicle' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Vehículo
                  </label>
                  {checkingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Verificando disponibilidad...</p>
                    </div>
                  ) : (
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccione un vehículo</option>
                      {availableVehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.brand} {vehicle.model} ({vehicle.capacity} pax)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-800">
                      <p>Capacidad requerida: {selectedTour.groupSize || 10} pasajeros</p>
                      {selectedVehicle && availableVehicles.find(v => v.id === selectedVehicle) && (
                        <p className="mt-1">
                          Vehículo seleccionado: {availableVehicles.find(v => v.id === selectedVehicle).capacity} plazas
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {availableVehicles.length === 0 && !checkingAvailability && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      No hay vehículos disponibles con la capacidad requerida para este tour.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssign}
                disabled={
                  isLoading ||
                  (assignmentType === 'guide' && !selectedGuide) ||
                  (assignmentType === 'driver' && !selectedDriver) ||
                  (assignmentType === 'vehicle' && !selectedVehicle)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAssignments;