import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GiftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XCircleIcon,
  PhotoIcon,
  TagIcon,
  CubeIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useRewardsStore from '../../stores/rewardsStore';
import { 
  REWARD_CATEGORIES, 
  REWARD_CATEGORY_LABELS,
  REDEMPTION_STATUS_LABELS,
  REDEMPTION_STATUS_COLORS
} from '../../constants/rewardsConstants';
import toast from 'react-hot-toast';

const RewardsManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('rewards');
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [pointsData, setPointsData] = useState({
    points: '',
    reason: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
    category: '',
    stock: '',
    image: '',
    active: true
  });

  const [errors, setErrors] = useState({});

  const {
    rewards,
    agencies,
    redemptions,
    loading,
    fetchRewards,
    fetchAgencies,
    fetchRedemptions,
    createReward,
    updateReward,
    deleteReward,
    updateRedemptionStatus,
    addPointsToAgency
  } = useRewardsStore();

  useEffect(() => {
    fetchRewards();
    fetchAgencies();
    fetchRedemptions();
  }, []);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.points || formData.points < 100) {
      newErrors.points = 'Los puntos deben ser al menos 100';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.stock || formData.stock < 1) {
      newErrors.stock = 'El stock debe ser al menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const rewardData = {
        ...formData,
        points: parseInt(formData.points),
        stock: parseInt(formData.stock)
      };

      if (editingReward) {
        await updateReward(editingReward.id, rewardData);
        toast.success('Premio actualizado exitosamente');
      } else {
        await createReward(rewardData);
        toast.success('Premio creado exitosamente');
      }
      
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      points: '',
      category: '',
      stock: '',
      image: '',
      active: true
    });
    setErrors({});
    setEditingReward(null);
    setShowForm(false);
  };

  // Manejar edición
  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      points: reward.points.toString(),
      category: reward.category,
      stock: reward.stock.toString(),
      image: reward.image || '',
      active: reward.active
    });
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (reward) => {
    if (window.confirm(`¿Está seguro de eliminar el premio "${reward.name}"?`)) {
      try {
        await deleteReward(reward.id);
        toast.success('Premio eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el premio');
      }
    }
  };

  // Ver detalles
  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetails(true);
  };

  // Manejar asignación de puntos
  const handleAssignPoints = (agency) => {
    setSelectedAgency(agency);
    setPointsData({ points: '', reason: '' });
    setShowPointsModal(true);
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    
    if (!pointsData.points || !pointsData.reason.trim()) {
      toast.error('Completa todos los campos');
      return;
    }

    const points = parseInt(pointsData.points);
    if (points <= 0) {
      toast.error('Los puntos deben ser mayores a 0');
      return;
    }

    try {
      await addPointsToAgency(selectedAgency.id, points, pointsData.reason);
      toast.success(`${points} puntos asignados a ${selectedAgency.name}`);
      setShowPointsModal(false);
      setSelectedAgency(null);
      setPointsData({ points: '', reason: '' });
    } catch (error) {
      toast.error('Error al asignar puntos');
    }
  };

  // Actualizar estado del canje
  const handleUpdateRedemption = async (id, status, notes = '') => {
    try {
      await updateRedemptionStatus(id, status, notes);
      toast.success('Estado del canje actualizado');
      setShowDetails(false);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      [REWARD_CATEGORIES.ELECTRONICS]: 'blue',
      [REWARD_CATEGORIES.TRAVEL]: 'green',
      [REWARD_CATEGORIES.GIFT_CARDS]: 'purple',
      [REWARD_CATEGORIES.EXPERIENCES]: 'orange',
      [REWARD_CATEGORIES.MERCHANDISE]: 'gray'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiftIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sistema de Premios</h1>
                <p className="text-gray-600">Gestiona premios y canjes del sistema de puntos</p>
              </div>
            </div>
            {activeTab === 'rewards' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Premio
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rewards'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <GiftIcon className="h-5 w-5 inline mr-2" />
              Premios ({rewards.length})
            </button>
            <button
              onClick={() => setActiveTab('agencies')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agencies'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <StarIcon className="h-5 w-5 inline mr-2" />
              Agencias ({agencies.length})
            </button>
            <button
              onClick={() => setActiveTab('redemptions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'redemptions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CheckCircleIcon className="h-5 w-5 inline mr-2" />
              Canjes ({redemptions.length})
            </button>
          </nav>
        </div>

        {/* Contenido por pestañas */}
        {activeTab === 'rewards' && (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Cargando premios...
                      </td>
                    </tr>
                  ) : rewards.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No hay premios registrados
                      </td>
                    </tr>
                  ) : (
                    rewards.map((reward) => (
                      <tr key={reward.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {reward.image ? (
                              <img className="h-10 w-10 rounded object-cover mr-3" src={reward.image} alt="" />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                                <PhotoIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reward.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {reward.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge badge-${getCategoryBadgeColor(reward.category)}`}>
                            {REWARD_CATEGORY_LABELS[reward.category]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-medium text-purple-600">
                            {reward.points.toLocaleString()} pts
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm font-medium ${
                            reward.stock > 10 ? 'text-green-600' : 
                            reward.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {reward.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`badge ${reward.active ? 'badge-green' : 'badge-red'}`}>
                            {reward.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(reward, 'reward')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(reward)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Editar"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(reward)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'agencies' && (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agencia</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos Totales</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos Disponibles</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos Usados</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                          <div className="text-sm text-gray-500">{agency.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-purple-600">
                          {agency.totalPoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-green-600">
                          {agency.availablePoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-600">
                          {agency.usedPoints.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {new Date(agency.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(agency, 'agency')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleAssignPoints(agency)}
                            className="text-green-600 hover:text-green-800"
                            title="Asignar puntos"
                          >
                            <PlusCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'redemptions' && (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agencia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premio</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Puntos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fecha Solicitud</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {redemptions.map((redemption) => (
                    <tr key={redemption.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{redemption.agencyName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{redemption.rewardName}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-purple-600">
                          {redemption.points.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`badge badge-${REDEMPTION_STATUS_COLORS[redemption.status]}`}>
                          {REDEMPTION_STATUS_LABELS[redemption.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {new Date(redemption.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(redemption, 'redemption')}
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingReward ? 'Editar Premio' : 'Nuevo Premio'}
                  </h2>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Premio *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Ej: iPad Air 10.9"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className={`w-full border rounded-lg px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Descripción del premio..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos Requeridos *
                      </label>
                      <input
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData({...formData, points: e.target.value})}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.points ? 'border-red-500' : ''}`}
                        placeholder="1000"
                        min="100"
                      />
                      {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.stock ? 'border-red-500' : ''}`}
                        placeholder="10"
                        min="1"
                      />
                      {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2 ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {Object.entries(REWARD_CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="active" className="text-sm text-gray-700">
                      Premio activo y disponible para canje
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : editingReward ? 'Actualizar' : 'Crear Premio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetails && selectedItem && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedItem.type === 'reward' ? 'Detalles del Premio' :
                     selectedItem.type === 'agency' ? 'Detalles de la Agencia' : 'Detalles del Canje'}
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Contenido específico por tipo */}
                {selectedItem.type === 'redemption' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Información del Canje</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Agencia:</span>
                          <span className="font-medium">{selectedItem.agencyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Premio:</span>
                          <span className="font-medium">{selectedItem.rewardName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Puntos:</span>
                          <span className="font-medium text-purple-600">
                            {selectedItem.points.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Estado:</span>
                          <span className={`badge badge-${REDEMPTION_STATUS_COLORS[selectedItem.status]}`}>
                            {REDEMPTION_STATUS_LABELS[selectedItem.status]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedItem.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notas</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {selectedItem.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      {selectedItem.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateRedemption(selectedItem.id, 'approved', 'Canje aprobado para entrega')}
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleUpdateRedemption(selectedItem.id, 'cancelled', 'Canje cancelado')}
                            className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {selectedItem.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateRedemption(selectedItem.id, 'delivered', 'Premio entregado exitosamente')}
                          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Marcar Entregado
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal para asignar puntos */}
        {showPointsModal && selectedAgency && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <form onSubmit={handlePointsSubmit} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Asignar Puntos</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPointsModal(false);
                      setSelectedAgency(null);
                      setPointsData({ points: '', reason: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Info de la agencia */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">{selectedAgency.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Puntos actuales:</span>
                      <span className="font-medium text-purple-600">
                        {selectedAgency.availablePoints.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total histórico:</span>
                      <span className="font-medium">
                        {selectedAgency.totalPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntos a Asignar *
                    </label>
                    <input
                      type="number"
                      value={pointsData.points}
                      onChange={(e) => setPointsData({...pointsData, points: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="1000"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo/Razón *
                    </label>
                    <textarea
                      value={pointsData.reason}
                      onChange={(e) => setPointsData({...pointsData, reason: e.target.value})}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: Bonificación por desempeño excepcional, Premio por meta alcanzada, etc."
                      required
                    />
                  </div>

                  {pointsData.points && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <div className="text-sm">
                          <span className="text-green-800">
                            Nuevos puntos totales: {' '}
                            <span className="font-semibold">
                              {(selectedAgency.availablePoints + parseInt(pointsData.points || 0)).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPointsModal(false);
                      setSelectedAgency(null);
                      setPointsData({ points: '', reason: '' });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !pointsData.points || !pointsData.reason.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Asignando...' : 'Asignar Puntos'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsManagement;