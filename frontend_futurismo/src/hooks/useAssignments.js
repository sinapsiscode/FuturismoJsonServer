import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { API_DELAYS } from '../constants/hooksConstants';
import { 
  ASSIGNMENT_STATUS,
  DEFAULT_ASSIGNMENT,
  TOUR_LANGUAGES,
  GUIDE_SPECIALTIES
} from '../constants/assignmentsConstants';

/**
 * Hook personalizado para gestionar asignaciones de tours
 * @returns {Object} Estado y funciones para manejar asignaciones
 */
const useAssignments = () => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Mock data - TODO: Mover a archivo separado de mock data
  const mockAssignments = useMemo(() => [
    {
      id: 'ASG001',
      tourDate: '15/02/2024',
      tourTime: '09:00',
      tourName: 'Tour Completo Isla São Miguel',
      groupSize: 12,
      status: 'confirmed',
      agency: {
        id: 'AG001',
        name: 'Viajes Portugal',
        contact: '+351 123 456 789'
      },
      guide: {
        id: 'G001',
        name: 'João Silva',
        phone: '+351 987 654 321',
        languages: ['Portugués', 'Español', 'Inglés'],
        specialties: ['Historia', 'Naturaleza']
      },
      driver: {
        id: 'D001',
        name: 'Manuel Santos',
        phone: '+351 999 888 777',
        licenseType: 'D',
        vehicleType: 'Minibus'
      },
      vehicle: {
        id: 'V001',
        plateNumber: 'AA-12-34',
        type: 'Minibus',
        capacity: 20
      },
      tourists: [
        {
          name: 'María González',
          documentType: 'DNI',
          documentNumber: '12345678A',
          phone: '+34 666 555 444',
          age: 35
        },
        {
          name: 'Pedro Martínez',
          documentType: 'DNI',
          documentNumber: '87654321B',
          phone: '+34 666 555 445',
          age: 42
        }
      ],
      pickup: {
        location: 'Hotel Marina Atlantico',
        time: '08:30',
        coordinates: { lat: 37.7411, lng: -25.6686 }
      },
      notes: 'Grupo con niños. Incluir parada extra en el mirador de Vista do Rei.',
      language: 'Español'
    }
  ], []);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carga desde API
      await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL));
      
      setAssignments(mockAssignments);
    } catch (err) {
      // Error ya manejado con toast
      setError(err.message);
      toast.error(t('assignments.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const assignGuide = async (assignmentId, guideId) => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, API_DELAYS.FAST));
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, guide: { id: guideId, name: 'Guía Asignado' } }
          : assignment
      ));
      
      toast.success(t('assignments.guideAssigned'));
      return { success: true };
    } catch (err) {
      // Error ya manejado con toast
      toast.error(t('assignments.assignError'));
      return { success: false, error: err.message };
    }
  };

  const assignDriver = async (assignmentId, driverId) => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, API_DELAYS.FAST));
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, driver: { id: driverId, name: 'Conductor Asignado' } }
          : assignment
      ));
      
      toast.success(t('assignments.driverAssigned'));
      return { success: true };
    } catch (err) {
      // Error ya manejado con toast
      toast.error(t('assignments.assignError'));
      return { success: false, error: err.message };
    }
  };

  const updateAssignment = async (assignmentId, updates) => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, API_DELAYS.FAST));
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, ...updates }
          : assignment
      ));
      
      toast.success(t('assignments.updateSuccess'));
      return { success: true };
    } catch (err) {
      // Error ya manejado con toast
      toast.error(t('assignments.updateError'));
      return { success: false, error: err.message };
    }
  };

  const generateBrochure = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) {
        throw new Error(t('assignments.notFound'));
      }
      
      setSelectedAssignment(assignment);
      return { success: true, assignment };
    } catch (err) {
      // Error ya manejado con toast
      toast.error(t('assignments.brochureError'));
      return { success: false, error: err.message };
    }
  };

  const getAssignmentsByDate = (date) => {
    return assignments.filter(assignment => assignment.tourDate === date);
  };

  const getAssignmentsByStatus = (status) => {
    return assignments.filter(assignment => assignment.status === status);
  };

  const getPendingAssignments = () => {
    return assignments.filter(assignment => 
      !assignment.guide || !assignment.driver || !assignment.vehicle
    );
  };

  return {
    // Estado
    assignments,
    isLoading,
    error,
    selectedAssignment,
    
    // Acciones
    loadAssignments,
    assignGuide,
    assignDriver,
    updateAssignment,
    generateBrochure,
    setSelectedAssignment,
    
    // Queries
    getAssignmentsByDate,
    getAssignmentsByStatus,
    getPendingAssignments,
    
    // Utils
    clearError: () => setError(null)
  };
};

export default useAssignments;