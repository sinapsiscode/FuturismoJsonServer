import React from 'react';

const RewardsSimple = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
          🛍️ Tienda de Premios - Agencia
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Esta es la versión simplificada de la tienda de premios para agencias.
          </p>
          <div className="space-y-2">
            <p>✅ Constantes de rewards configuradas</p>
            <p>✅ Store de rewards creado</p>
            <p>✅ Rutas configuradas</p>
            <p>✅ Sidebar actualizado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsSimple;