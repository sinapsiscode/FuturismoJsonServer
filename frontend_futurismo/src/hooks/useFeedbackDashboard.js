import { useState, useEffect } from 'react';
import api from '../services/api';

const useFeedbackDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Estado para datos del API
  const [stats, setStats] = useState({
    totalFeedback: 0,
    serviceFeedback: 0,
    staffFeedback: 0
  });
  const [serviceFeedback, setServiceFeedback] = useState([]);
  const [staffFeedback, setStaffFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/statistics/feedback');

        if (response.data.success) {
          const { stats: fetchedStats, serviceFeedback: service, staffFeedback: staff } = response.data.data;

          setStats({
            totalFeedback: fetchedStats.totalFeedback,
            totalFeedbackTrend: fetchedStats.totalFeedbackTrend,
            serviceFeedback: fetchedStats.serviceFeedback,
            serviceFeedbackTrend: fetchedStats.serviceFeedbackTrend,
            staffFeedback: fetchedStats.staffFeedback,
            staffFeedbackTrend: fetchedStats.staffFeedbackTrend
          });

          setServiceFeedback(service || []);
          setStaffFeedback(staff || []);
        }
      } catch (err) {
        console.error('Error fetching feedback data:', err);
        setError(err.message);
        // Set default empty data on error
        setStats({
          totalFeedback: 0,
          serviceFeedback: 0,
          staffFeedback: 0
        });
        setServiceFeedback([]);
        setStaffFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  // Calculate analytics data
  const calculateServiceFeedbackByArea = () => {
    const areaCount = serviceFeedback.reduce((acc, feedback) => {
      acc[feedback.area] = (acc[feedback.area] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {});
    return areaCount;
  };

  const calculateStatusDistribution = () => {
    const allFeedback = [...serviceFeedback, ...staffFeedback];
    const statusCount = allFeedback.reduce((acc, feedback) => {
      acc[feedback.status] = (acc[feedback.status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {});
    return statusCount;
  };

  const handleExport = () => {
    // Implementation for export functionality
    const data = {
      stats,
      serviceFeedback,
      staffFeedback,
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `feedback-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log('Feedback data exported successfully');
  };

  // Filter feedback based on current filters
  const filteredServiceFeedback = serviceFeedback.filter(feedback => {
    if (selectedArea !== 'all' && feedback.area !== selectedArea) return false;
    if (selectedStatus !== 'all' && feedback.status !== selectedStatus) return false;
    if (searchTerm &&
        !feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredStaffFeedback = staffFeedback.filter(feedback => {
    if (selectedStatus !== 'all' && feedback.status !== selectedStatus) return false;
    if (searchTerm &&
        !feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.staffName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return {
    selectedFilter,
    setSelectedFilter,
    selectedArea,
    setSelectedArea,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    selectedFeedback,
    setSelectedFeedback,
    stats,
    serviceFeedback: filteredServiceFeedback,
    staffFeedback: filteredStaffFeedback,
    handleExport,
    serviceFeedbackByArea: calculateServiceFeedbackByArea(),
    statusDistribution: calculateStatusDistribution(),
    loading,
    error,
    refresh: () => {
      // Trigger reload by changing a state that useEffect depends on
      window.location.reload();
    }
  };
};

export default useFeedbackDashboard;
