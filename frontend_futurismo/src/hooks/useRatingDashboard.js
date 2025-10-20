import { useState, useEffect } from 'react';

export const useRatingDashboard = (ratingsData = [], staffEvaluations = []) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');

  // Estados para datos de la API
  const [serviceAreas, setServiceAreas] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [mockStats, setMockStats] = useState({});
  const [mockAreaStats, setMockAreaStats] = useState([]);
  const [mockStaffStats, setMockStaffStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar todas las estadísticas en paralelo
        const [statsRes, areasRes, staffRes, serviceAreasRes, periodsRes] = await Promise.all([
          fetch('/api/ratings/dashboard/stats'),
          fetch('/api/ratings/areas'),
          fetch('/api/ratings/staff'),
          fetch('/api/ratings/service-areas'),
          fetch('/api/ratings/periods')
        ]);

        const [stats, areas, staff, svcAreas, prds] = await Promise.all([
          statsRes.json(),
          areasRes.json(),
          staffRes.json(),
          serviceAreasRes.json(),
          periodsRes.json()
        ]);

        if (stats.success) setMockStats(stats.data);
        if (areas.success) setMockAreaStats(areas.data);
        if (staff.success) setMockStaffStats(staff.data);
        if (svcAreas.success) setServiceAreas(svcAreas.data);
        if (prds.success) setPeriods(prds.data);

        setLoading(false);
      } catch (err) {
        console.error('Error loading ratings data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRatingDistribution = () => {
    const distribution = {};
    const total = mockStats.totalRatings || 0;

    // Calcular distribución
    [5, 4, 3, 2, 1].forEach(rating => {
      distribution[rating] = {
        count: Math.round(total * (rating / 15)),
        percentage: rating * 20
      };
    });

    return distribution;
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data for period:', selectedPeriod);
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedArea,
    setSelectedArea,
    selectedStaff,
    setSelectedStaff,
    serviceAreas,
    periods,
    mockStats,
    mockAreaStats,
    mockStaffStats,
    ratingDistribution: getRatingDistribution(),
    handleExport,
    loading,
    error
  };
};
