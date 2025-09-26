import { useState, useEffect } from 'react';
import { mockStats, mockServiceFeedback, mockStaffFeedback } from '../data/mockFeedbackData';

const useFeedbackDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // In a real app, this would fetch from API
  const [stats, setStats] = useState(mockStats);
  const [serviceFeedback, setServiceFeedback] = useState(mockServiceFeedback);
  const [staffFeedback, setStaffFeedback] = useState(mockStaffFeedback);

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
    console.log('Exporting feedback data...');
  };

  const filteredServiceFeedback = serviceFeedback.filter(feedback => {
    if (selectedArea !== 'all' && feedback.area !== selectedArea) return false;
    if (selectedStatus !== 'all' && feedback.status !== selectedStatus) return false;
    if (searchTerm && !feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredStaffFeedback = staffFeedback.filter(feedback => {
    if (selectedStatus !== 'all' && feedback.status !== selectedStatus) return false;
    if (searchTerm && !feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !feedback.staffName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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
    statusDistribution: calculateStatusDistribution()
  };
};

export default useFeedbackDashboard;