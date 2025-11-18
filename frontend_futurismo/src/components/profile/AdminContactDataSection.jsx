import { useState, useEffect } from 'react';
import { PhoneIcon, PencilIcon, CheckIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import useUsersStore from '../../stores/usersStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminContactDataSection = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const updateUser = useUsersStore((state) => state.updateUser);
  const isLoading = useUsersStore((state) => state.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalPhone: '',
    officePhone: '',
    emergencyPhone: '',
    adminEmail: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        personalPhone: user.contact_data?.main_contact?.mobile || user.phone || '',
        officePhone: user.contact_data?.main_contact?.phone || user.phone || '',
        emergencyPhone: user.contact_data?.emergency_contact?.phone || '',
        adminEmail: user.contact_data?.main_contact?.email || user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('No se encontró la información del usuario');
      return;
    }

    setLocalLoading(true);

    try {
      const updateData = {
        contact_data: {
          main_contact: {
            phone: formData.officePhone,
            mobile: formData.personalPhone,
            email: formData.adminEmail
          },
          emergency_contact: {
            phone: formData.emergencyPhone
          }
        }
      };

      console.log('💾 Guardando datos de contacto:', updateData);

      await updateUser(currentUser.id, updateData);

      toast.success('✅ Datos de contacto actualizados correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error(`Error al actualizar: ${error.message || 'Error desconocido'}`);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (currentUser) {
      setFormData({
        personalPhone: currentUser.contact_data?.main_contact?.mobile || currentUser.phone || '',
        officePhone: currentUser.contact_data?.main_contact?.phone || currentUser.phone || '',
        emergencyPhone: currentUser.contact_data?.emergency_contact?.phone || '',
        adminEmail: currentUser.contact_data?.main_contact?.email || currentUser.email || ''
      });
    }
    setIsEditing(false);
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
                disabled={localLoading || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {localLoading || isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                disabled={localLoading || isLoading}
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
      )}
    </div>
  );
};

export default AdminContactDataSection;