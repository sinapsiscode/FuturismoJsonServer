import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserPlusIcon, 
  UsersIcon,
  ArrowLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { useUsersStore } from '../stores/usersStore';

const Users = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { deleteUser, getUsersStatistics } = useUsersStore();

  const handleCreateUser = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setCurrentView('view');
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.firstName} ${user.lastName}"?`)) {
      deleteUser(user.id);
    }
  };

  const handleFormSubmit = async (userData) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentView('list');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const renderHeader = () => {
    const titles = {
      list: t('users.management') || 'Gestión de Usuarios',
      create: t('users.form.newUser') || 'Nuevo Usuario',
      edit: `${t('users.form.editUser') || 'Editar Usuario'}: ${selectedUser?.firstName} ${selectedUser?.lastName}`,
      view: `${t('users.details') || 'Detalles de'}: ${selectedUser?.firstName} ${selectedUser?.lastName}`
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center">
          {currentView !== 'list' && (
            <button
              onClick={handleCancel}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {titles[currentView]}
            </h1>
          </div>
        </div>

        {currentView === 'list' && (
          <button
            onClick={handleCreateUser}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </button>
        )}
      </div>
    );
  };

  const UserDetails = ({ user }) => {
    const stats = getUsersStatistics();
    
    return (
      <div className="space-y-6">
        {/* Información del usuario */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start space-x-6">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.position}</p>
              <p className="text-gray-500">{user.department}</p>
              
              <div className="mt-4 flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
                
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <button
                onClick={() => handleEditUser(user)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="text-sm text-gray-900">{user.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Usuario</dt>
                <dd className="text-sm text-gray-900">@{user.username}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Sistema
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Último Login</dt>
                <dd className="text-sm text-gray-900">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString('es-PE') + ' ' + 
                      new Date(user.lastLogin).toLocaleTimeString('es-PE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : 'Nunca'
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-PE')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Permisos</dt>
                <dd className="text-sm text-gray-900">
                  {user.permissions?.length || 0} permisos asignados
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Permisos */}
        {user.permissions && user.permissions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Permisos Asignados
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {user.permissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 truncate"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferencias */}
        {user.preferences && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Preferencias
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Idioma</dt>
                <dd className="text-sm text-gray-900">
                  {user.preferences.language === 'es' ? 'Español' : user.preferences.language}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Zona Horaria</dt>
                <dd className="text-sm text-gray-900">{user.preferences.timezone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Notificaciones</dt>
                <dd className="text-sm text-gray-900">
                  {user.preferences.notifications?.email ? 'Email, ' : ''}
                  {user.preferences.notifications?.push ? 'Push, ' : ''}
                  {user.preferences.notifications?.sms ? 'SMS' : ''}
                  {!user.preferences.notifications?.email && 
                   !user.preferences.notifications?.push && 
                   !user.preferences.notifications?.sms ? 'Ninguna' : ''}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {renderHeader()}

        {currentView === 'list' && (
          <UserList
            onEdit={handleEditUser}
            onView={handleViewUser}
            onDelete={handleDeleteUser}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <UserForm
            user={selectedUser}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {currentView === 'view' && selectedUser && (
          <UserDetails user={selectedUser} />
        )}

        {/* Información adicional */}
        {currentView === 'list' && (
          <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 sm:mr-3 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-blue-800">
                <h4 className="font-medium mb-1 sm:mb-2">Gestión de Usuarios</h4>
                <p className="mb-2">
                  Desde aquí puedes administrar todos los usuarios del sistema. Puedes crear nuevos usuarios, 
                  editar información existente, asignar roles y permisos, y controlar el acceso al sistema.
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li>Los roles determinan los permisos base del usuario</li>
                  <li>Puedes personalizar permisos individuales para cada usuario</li>
                  <li>Los usuarios inactivos no pueden acceder al sistema</li>
                  <li>Se puede resetear la contraseña desde las acciones de usuario</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;