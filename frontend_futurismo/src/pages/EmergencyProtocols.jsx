import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, ArrowDownTrayIcon, DocumentTextIcon, ShieldCheckIcon, ExclamationTriangleIcon, PhoneIcon, CheckCircleIcon, CogIcon, FunnelIcon, EyeIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import useEmergencyStore from '../stores/emergencyStore';
import ProtocolViewer from '../components/emergency/ProtocolViewer';
import ProtocolEditor from '../components/emergency/ProtocolEditor';
import MaterialsManager from '../components/emergency/MaterialsManager';
import emergencyPDFService from '../services/emergencyPDFService';
import { useAuthStore } from '../stores/authStore';
import AdminEmergency from './AdminEmergency';

const EmergencyProtocols = () => {
  const { user } = useAuthStore();
  
  // Si es administrador, mostrar panel administrativo
  if (user?.role === 'admin') {
    return <AdminEmergency />;
  }
  
  const { protocols, categories, actions } = useEmergencyStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'

  // Filtrar protocolos
  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = !searchQuery || 
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || protocol.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownloadProtocol = async (protocol) => {
    try {
      await emergencyPDFService.downloadProtocolPDF(protocol);
    } catch (error) {
      console.error('Error descargando protocolo:', error);
      alert('Error al generar el PDF del protocolo');
    }
  };

  const handleDownloadAllProtocols = async () => {
    try {
      await emergencyPDFService.downloadAllProtocolsPDF(filteredProtocols);
    } catch (error) {
      console.error('Error descargando todos los protocolos:', error);
      alert('Error al generar el PDF de todos los protocolos');
    }
  };

  const handleDownloadGuideKit = async () => {
    try {
      await emergencyPDFService.downloadGuideEmergencyKit();
    } catch (error) {
      console.error('Error descargando kit de guía:', error);
      alert('Error al generar el PDF del kit de emergencia');
    }
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { 
      name: categoryId, 
      icon: '📋', 
      color: '#6B7280' 
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (selectedProtocol && !isEditing) {
    return (
      <ProtocolViewer
        protocol={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
        onEdit={() => setIsEditing(true)}
        onDownload={() => handleDownloadProtocol(selectedProtocol)}
      />
    );
  }

  if (isEditing) {
    return (
      <ProtocolEditor
        protocol={selectedProtocol}
        onClose={() => {
          setIsEditing(false);
          setSelectedProtocol(null);
        }}
        onSave={(updatedProtocol) => {
          if (selectedProtocol) {
            actions.updateProtocol(selectedProtocol.id, updatedProtocol);
          } else {
            actions.addProtocol(updatedProtocol);
          }
          setIsEditing(false);
          setSelectedProtocol(null);
        }}
      />
    );
  }

  if (showMaterials) {
    return (
      <MaterialsManager
        onClose={() => setShowMaterials(false)}
        isAdmin={user?.role === 'admin'}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-red-500" />
            Protocolos de Emergencia
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de protocolos y materiales de emergencia para guías
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Botones de descarga */}
          <button
            onClick={handleDownloadGuideKit}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Kit Completo</span>
          </button>

          <button
            onClick={handleDownloadAllProtocols}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span>Todos los Protocolos</span>
          </button>

          <button
            onClick={() => setShowMaterials(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            <CogIcon className="w-4 h-4" />
            <span>Materiales</span>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Nuevo Protocolo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar protocolos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vista */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <div className="w-4 h-4 space-y-1">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de protocolos */}
      {filteredProtocols.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron protocolos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajusta los filtros de búsqueda o crea un nuevo protocolo.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProtocols.map(protocol => {
            const category = getCategoryInfo(protocol.category);
            return (
              <div
                key={protocol.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {protocol.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {protocol.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          <span 
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}
                          >
                            {protocol.priority?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {protocol.description}
                  </p>

                  {/* Información adicional */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Actualizado: {protocol.lastUpdated}</span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        {protocol.content.steps.length} pasos
                      </span>
                      <span className="flex items-center">
                        <PhoneIcon className="w-3 h-3 mr-1" />
                        {protocol.content.contacts.length} contactos
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProtocol(protocol)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownloadProtocol(protocol)}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      title="Descargar PDF"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedProtocol(protocol);
                            setIsEditing(true);
                          }}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar este protocolo?')) {
                              actions.deleteProtocol(protocol.id);
                            }
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actualizado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProtocols.map(protocol => {
                  const category = getCategoryInfo(protocol.category);
                  return (
                    <tr key={protocol.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{protocol.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{protocol.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{protocol.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span className="text-sm text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}
                        >
                          {protocol.priority?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {protocol.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedProtocol(protocol)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver protocolo"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDownloadProtocol(protocol)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Descargar PDF"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                          
                          {user?.role === 'admin' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedProtocol(protocol);
                                  setIsEditing(true);
                                }}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Editar protocolo"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm('¿Estás seguro de eliminar este protocolo?')) {
                                    actions.deleteProtocol(protocol.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar protocolo"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyProtocols;