import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import profileService from '../services/profileService';
import { DOCUMENT_STATUS } from '../constants/profileConstants';

const useDocuments = () => {
  const { t, i18n } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load documents from API
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const result = await profileService.getDocumentTemplates();
        if (result.success) {
          setDocuments(result.data || []);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error('Error al cargar documentos');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const categories = {
    all: t('profile.documents.categories.all'),
    legal: t('profile.documents.categories.legal'),
    fiscal: t('profile.documents.categories.fiscal'),
    insurance: t('profile.documents.categories.insurance'),
    tourism: t('profile.documents.categories.tourism')
  };

  const getStatusBadge = (status) => {
    const badges = {
      [DOCUMENT_STATUS.VALID]: {
        color: 'bg-green-100 text-green-800',
        text: t('profile.documents.status.approved')
      },
      [DOCUMENT_STATUS.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800',
        text: t('profile.documents.status.pending')
      },
      [DOCUMENT_STATUS.REJECTED]: {
        color: 'bg-red-100 text-red-800',
        text: t('profile.documents.status.rejected')
      },
      [DOCUMENT_STATUS.EXPIRED]: {
        color: 'bg-red-100 text-red-800',
        text: t('profile.documents.status.expired')
      }
    };
    return badges[status] || badges[DOCUMENT_STATUS.PENDING];
  };

  const formatDate = (date) => {
    if (!date) return t('profile.documents.noExpiry');
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
    const today = new Date();
    const daysDiff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDocument = {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'other',
        fileName: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date(),
        expiryDate: null,
        status: DOCUMENT_STATUS.PENDING,
        category: 'legal',
        url: '#'
      };
      
      setDocuments([...documents, newDocument]);
      setIsUploading(false);
      toast.success(t('profile.documents.uploadSuccess'));
    }, 2000);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm(t('profile.documents.confirmDelete'))) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success(t('profile.documents.deleteSuccess'));
    }
  };

  const handleViewDocument = (doc) => {
    // In a real app, this would open the document
    if (process.env.NODE_ENV === 'development') {
      console.log('Viewing document:', doc);
    }
    window.open(doc.url, '_blank');
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getExpiredCount = () => {
    return documents.filter(doc => {
      if (!doc.expiryDate) return false;
      const expiry = doc.expiryDate instanceof Date ? doc.expiryDate : new Date(doc.expiryDate);
      return expiry < new Date();
    }).length;
  };

  const getExpiringSoonCount = () => {
    return documents.filter(doc => isExpiringSoon(doc.expiryDate)).length;
  };

  return {
    isCollapsed,
    setIsCollapsed,
    documents,
    selectedCategory,
    setSelectedCategory,
    isUploading,
    categories,
    getStatusBadge,
    formatDate,
    isExpiringSoon,
    handleFileUpload,
    handleDeleteDocument,
    handleViewDocument,
    filteredDocuments,
    getExpiredCount,
    getExpiringSoonCount
  };
};

export default useDocuments;