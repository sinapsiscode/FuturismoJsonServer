import { useState, useEffect } from 'react';
import { PhoneIcon, PencilIcon, CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import profileService from '../../services/profileService';

const AdminContactDataSection = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    personalPhone: '',
    officePhone: '',
    emergencyPhone: '',
    adminEmail: ''
  });

  // Cargar datos desde el backend
  useEffect(() => {
    const loadContactData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getContactData();

        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            personalPhone: data.mainContact?.mobile || data.mainContact?.phone || '',
            officePhone: data.mainContact?.phone || '',
            emergencyPhone: data.emergencyContact?.phone || '',
            adminEmail: data.mainContact?.email || ''
          });
        }
      } catch (error) {
        console.error('Error al cargar datos de contacto:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Guardando datos de contacto:', formData);

      // Mapear campos del formulario a la estructura del backend
      const dataToSave = {
        mainContact: {
          phone: formData.officePhone,
          mobile: formData.personalPhone,
          email: formData.adminEmail
        },
        emergencyContact: {
          phone: formData.emergencyPhone
        }
      };

      const response = await profileService.updateContactData(dataToSave);

      if (response.success) {
        setIsEditing(false);
        alert('✅ Datos de contacto actualizados correctamente');
      } else {
        alert('❌ Error al actualizar datos de contacto');
      }
    } catch (error) {
      console.error('Error al guardar datos de contacto:', error);
      alert('❌ Error al actualizar datos de contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Recargar datos originales
    const loadContactData = async () => {
      try {
        const response = await profileService.getContactData();

        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            personalPhone: data.mainContact?.mobile || data.mainContact?.phone || '',
            officePhone: data.mainContact?.phone || '',
            emergencyPhone: data.emergencyContact?.phone || '',
            adminEmail: data.mainContact?.email || ''
          });
        }
      } catch (error) {
        console.error('Error al recargar datos de contacto:', error);
      }
    };
    loadContactData();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-green-100 rounded-lg">
            <PhoneIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Datos de Contacto</h3>
            <p className="text-sm text-gray-500">Información de contacto del administrador</p>
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
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                disabled={loading}
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
        loading && !isEditing ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando datos...</span>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Personal
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.personalPhone}
                onChange={(e) => handleInputChange('personalPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="+51 999 999 999"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formData.personalPhone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Oficina
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.officePhone}
                onChange={(e) => handleInputChange('officePhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="+51 (01) 999-9999"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formData.officePhone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de Emergencia
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="+51 999 999 999"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formData.emergencyPhone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo del Administrador
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@empresa.com"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formData.adminEmail}
              </p>
            )}
          </div>
        </div>
        )
      )}
    </div>
  );
};

export default AdminContactDataSection;