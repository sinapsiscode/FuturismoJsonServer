import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useEmergencyStore from '../stores/emergencyStore';

const useMaterialsManager = () => {
  const { materials, categories, actions } = useEmergencyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [showOnlyMandatory, setShowOnlyMandatory] = useState(false);
  const { t } = useTranslation();

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchQuery || 
      material.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || material.category === filterCategory;
    const matchesMandatory = !showOnlyMandatory || material.mandatory;
    
    return matchesSearch && matchesCategory && matchesMandatory;
  });

  const handleSaveMaterial = (materialData) => {
    if (editingMaterial) {
      actions.updateMaterial(editingMaterial.id, materialData);
    } else {
      actions.addMaterial(materialData);
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
      actions.deleteMaterial(materialId);
    }
  };

  const handleViewMaterial = (material) => {
    setExpandedMaterial(expandedMaterial?.id === material.id ? null : material);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { 
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
    total: materials.length,
    mandatory: materials.filter(m => m.mandatory).length,
    categories: categories.length,
    filtered: filteredMaterials.length
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