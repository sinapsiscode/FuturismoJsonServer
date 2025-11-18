import { useState, useEffect } from 'react';
import { BuildingOfficeIcon, PencilIcon, CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAgencyStore } from '../../stores/agencyStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const CompanyDataSection = () => {
  const currentAgency = useAgencyStore((state) => state.currentAgency);
  const actions = useAgencyStore((state) => state.actions);
  const storeLoading = useAgencyStore((state) => state.isLoading);
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    ruc: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    establishedYear: ''
  });

  // Inicializar agencia si no existe currentAgency
  useEffect(() => {
    const initializeAgency = async () => {
      if (!user || currentAgency) return;

      setIsInitializing(true);
      try {
        // Buscar la agencia por user_id
        const response = await axios.get('/api/agencies');
        const agenciesResult = response.data;

        if (agenciesResult.success && agenciesResult.data) {
          const userAgency = agenciesResult.data.find(a => a.user_id === user.id);

          if (userAgency) {
            // Cargar datos de la agencia encontrada
            setFormData({
              companyName: userAgency.name || userAgency.company_name || '',
              ruc: userAgency.ruc || userAgency.tax_id || '',
              address: userAgency.address || '',
              phone: userAgency.phone || userAgency.contact_phone || '',
              email: userAgency.email || userAgency.contact_email || '',
              website: userAgency.website || '',
              description: userAgency.description || '',
              establishedYear: userAgency.established_year || userAgency.establishedYear || ''
            });

            // Actualizar currentAgency en el store
            useAgencyStore.setState({ currentAgency: userAgency });
          }
        }
      } catch (error) {
        console.error('Error al inicializar agencia:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAgency();
  }, [user, currentAgency]);

  // Cargar datos de la agencia cuando currentAgency cambia
  useEffect(() => {
    if (currentAgency) {
      setFormData({
        companyName: currentAgency.name || currentAgency.company_name || '',
        ruc: currentAgency.ruc || currentAgency.tax_id || '',
        address: currentAgency.address || '',
        phone: currentAgency.phone || currentAgency.contact_phone || '',
        email: currentAgency.email || currentAgency.contact_email || '',
        website: currentAgency.website || '',
        description: currentAgency.description || '',
        establishedYear: currentAgency.established_year || currentAgency.establishedYear || ''
      });
    }
  }, [currentAgency]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentAgency) {
      toast.error('No se encontró la información de la agencia');
      return;
    }

    setIsLocalLoading(true);

    try {
      // Transformar formData al formato del backend
      const updateData = {
        name: formData.companyName,
        company_name: formData.companyName,
        ruc: formData.ruc,
        tax_id: formData.ruc,
        address: formData.address,
        phone: formData.phone,
        contact_phone: formData.phone,
        email: formData.email,
        contact_email: formData.email,
        website: formData.website,
        description: formData.description,
        established_year: formData.establishedYear,
        establishedYear: formData.establishedYear
      };

      console.log('💾 Guardando datos de empresa:', updateData);

      await actions.updateAgencyProfile(updateData);

      toast.success('✅ Datos de empresa actualizados correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error(`Error al actualizar: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales de currentAgency
    if (currentAgency) {
      setFormData({
        companyName: currentAgency.name || currentAgency.company_name || '',
        ruc: currentAgency.ruc || currentAgency.tax_id || '',
        address: currentAgency.address || '',
        phone: currentAgency.phone || currentAgency.contact_phone || '',
        email: currentAgency.email || currentAgency.contact_email || '',
        website: currentAgency.website || '',
        description: currentAgency.description || '',
        establishedYear: currentAgency.established_year || currentAgency.establishedYear || ''
      });
    }
    setIsEditing(false);
  };

  // Mostrar loading mientras se inicializa
  if (isInitializing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600">Cargando información de la agencia...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Datos profesionales</h3>
            <p className="text-sm text-gray-500">Información principal de tu negocio o servicio</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLocalLoading || storeLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLocalLoading || storeLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLocalLoading || storeLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          )
        )}
      </div>

      {!isCollapsed && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la empresa/negocio *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RUC *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => handleInputChange('ruc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.ruc}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de establecimiento
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.establishedYear}</p>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono principal *
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    placeholder="9XXXXXXXX (9 dígitos)"
                    maxLength="9"
                    pattern="9[0-9]{8}"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value === '' || (value[0] === '9' && value.length <= 9)) {
                        handleInputChange('phone', value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email principal *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio web
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <a href={`https://${formData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {formData.website}
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del negocio/servicio
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe brevemente tu agencia de viajes..."
              />
            ) : (
              <p className="text-gray-900">{formData.description}</p>
            )}
          </div>

          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Tip:</span> Mantén tu información actualizada para una mejor experiencia de servicio y comunicación con tus clientes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDataSection;