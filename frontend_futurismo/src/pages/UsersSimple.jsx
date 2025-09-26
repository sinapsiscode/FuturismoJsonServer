import React, { useState, useEffect } from 'react';
import { UsersIcon, UserPlusIcon } from '@heroicons/react/24/outline';

// Datos mock simples para probar
const mockUsersData = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@futurismo.com',
    firstName: 'Carlos',
    lastName: 'Administrator',
    role: 'admin',
    status: 'activo'
  },
  {
    id: 'user-2',
    username: 'supervisor',
    email: 'supervisor@futurismo.com',
    firstName: 'María',
    lastName: 'Rodríguez',
    role: 'supervisor',
    status: 'activo'
  }
];

const Users = () => {
  const [users, setUsers] = useState(mockUsersData);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sistema de Usuarios
          </h2>
          <p className="text-gray-600 mb-4">
            Módulo completo de gestión de usuarios para administradores.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Crear Usuarios</h3>
              <p className="text-sm text-blue-700">
                Crea nuevos usuarios con roles y permisos específicos
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Gestionar Permisos</h3>
              <p className="text-sm text-green-700">
                Asigna y modifica permisos granulares por módulo
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Control de Acceso</h3>
              <p className="text-sm text-purple-700">
                Activa/desactiva usuarios y resetea contraseñas
              </p>
            </div>
          </div>
          
        </div>

        {/* Tabla simple de usuarios */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;