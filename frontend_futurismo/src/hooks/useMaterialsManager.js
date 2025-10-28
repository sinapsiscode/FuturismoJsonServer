import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useEmergencyStore from '../stores/emergencyStore';

const useMaterialsManager = () => {
  const materials = useEmergencyStore((state) => state.materials);
  const categories = useEmergencyStore((state) => state.categories);
  const updateMaterial = useEmergencyStore((state) => state.updateMaterial);
  const createMaterial = useEmergencyStore((state) => state.createMaterial);
  const deleteMaterial = useEmergencyStore((state) => state.deleteMaterial);
  const fetchMaterials = useEmergencyStore((state) => state.fetchMaterials);
  const initialize = useEmergencyStore((state) => state.initialize);

  const [isEditing, setIsEditing] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [showOnlyMandatory, setShowOnlyMandatory] = useState(false);
  const { t } = useTranslation();

  // Load materials and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!categories || categories.length === 0) {
          await initialize();
        }
        if (!materials || materials.length === 0) {
          await fetchMaterials();
        }
      } catch (error) {
        console.error('Error loading materials data:', error);
      }
    };
    loadData();
  }, []);

  // Filter materials
  const filteredMaterials = (materials || []).filter(material => {
    const matchesSearch = !searchQuery ||
      material.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filterCategory || material.category === filterCategory;
    const matchesMandatory = !showOnlyMandatory || material.mandatory;

    return matchesSearch && matchesCategory && matchesMandatory;
  });

  const handleSaveMaterial = (materialData) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, materialData);
    } else {
      createMaterial(materialData);
    }
    setIsEditing(false);
    setEditingMaterial(null);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsEditing(true);
  };

  const handleDeleteMaterial = (materialId) => {
    if (confirm(t('emergency.materials.confirmDelete'))) {
      deleteMaterial(materialId);
    }
  };

  const handleViewMaterial = (material) => {
    setExpandedMaterial(expandedMaterial?.id === material.id ? null : material);
  };

  const getCategoryInfo = (categoryId) => {
    return (categories || []).find(c => c.id === categoryId) || {
      name: categoryId,
      icon: '📦',
      color: '#6B7280'
    };
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setShowOnlyMandatory(false);
  };

  const stats = {
    total: materials?.length || 0,
    mandatory: materials?.filter(m => m.mandatory).length || 0,
    categories: categories?.length || 0,
    filtered: filteredMaterials?.length || 0
  };

  return {
    // State
    isEditing,
    setIsEditing,
    editingMaterial,
    setEditingMaterial,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    expandedMaterial,
    showOnlyMandatory,
    setShowOnlyMandatory,
    
    // Data
    materials,
    categories,
    filteredMaterials,
    stats,
    
    // Handlers
    handleSaveMaterial,
    handleEditMaterial,
    handleDeleteMaterial,
    handleViewMaterial,
    getCategoryInfo,
    resetFilters
  };
};

export default useMaterialsManager;