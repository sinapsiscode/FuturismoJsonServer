import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const useExportPanel = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const statusOptions = [
    { 
      value: 'all', 
      label: t('dashboard.export.statusOptions.all'), 
      icon: ChartBarIcon, 
      color: 'text-blue-600' 
    },
    { 
      value: 'pendiente', 
      label: t('dashboard.export.statusOptions.pending'), 
      icon: ClockIcon, 
      color: 'text-yellow-600' 
    },
    { 
      value: 'confirmada', 
      label: t('dashboard.export.statusOptions.confirmed'), 
      icon: CheckCircleIcon, 
      color: 'text-green-600' 
    },
    { 
      value: 'cancelada', 
      label: t('dashboard.export.statusOptions.cancelled'), 
      icon: XCircleIcon, 
      color: 'text-red-600' 
    }
  ];

  const exportFormats = [
    { 
      format: 'excel', 
      label: 'Excel', 
      icon: DocumentTextIcon, 
      color: 'bg-green-500 hover:bg-green-600',
      description: t('dashboard.export.formats.excel.description')
    },
    { 
      format: 'pdf', 
      label: 'PDF', 
      icon: DocumentTextIcon, 
      color: 'bg-red-500 hover:bg-red-600',
      description: t('dashboard.export.formats.pdf.description')
    }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      // Get current filter statistics
      const stats = exportService.getFilteredStats(selectedStatus);
      const statusLabel = statusOptions.find(opt => opt.value === selectedStatus)?.label || '';
      
      // Export with selected filter
      exportService.exportData(format, selectedStatus);
      
      // Show success message
      toast.success(t('dashboard.export.success', {
        status: statusLabel,
        count: stats.totalReservations,
        tourists: stats.totalTourists,
        revenue: stats.totalRevenue.toLocaleString(),
        format: format.toUpperCase()
      }));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('dashboard.export.error'));
    } finally {
      setIsExporting(false);
    }
  };

  // Get current filter statistics
  const stats = exportService.getFilteredStats(selectedStatus);

  const getSelectedStatusLabel = () => {
    return statusOptions.find(opt => opt.value === selectedStatus)?.label || '';
  };

  return {
    selectedStatus,
    setSelectedStatus,
    isExporting,
    statusOptions,
    exportFormats,
    handleExport,
    stats,
    getSelectedStatusLabel
  };
};

export default useExportPanel;